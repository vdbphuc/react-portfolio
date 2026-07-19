import os
import time
import asyncio
import httpx
import uvicorn
import json
import logging
from logging.handlers import RotatingFileHandler
import shutil
from fastapi import FastAPI, Header, HTTPException, Request, status as http_status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware
import redis.asyncio as redis
from kubernetes import client, config

# --- Setup JSON Logging ---
class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "log": record.getMessage(),
            "logger": record.name
        }
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
        # Cho phép gán thêm các trường custom qua tham số 'extra'
        if hasattr(record, "extra_fields"):
            log_record.update(record.extra_fields)
        return json.dumps(log_record)

logger = logging.getLogger("system-monitor")
logger.setLevel(logging.INFO)

# Formatter
json_formatter = JSONFormatter(datefmt="%Y-%m-%dT%H:%M:%SZ")

# Stream handler for stdout
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(json_formatter)
logger.addHandler(stream_handler)

# File handler with rotation (2MB per file, keeping 9 backups - 10 files total)
LOG_DIR = "/app/logs"
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR, exist_ok=True)
log_file_path = os.path.join(LOG_DIR, "app.log")

try:
    file_handler = RotatingFileHandler(log_file_path, maxBytes=2*1024*1024, backupCount=9)
    file_handler.setFormatter(json_formatter)
    logger.addHandler(file_handler)
except Exception as le:
    print(f"Warning: Failed to initialize file logging: {le}", flush=True)

# Configuration
REDIS_HOST = os.getenv("REDIS_HOST", "redis-service")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
WEBSITES_TO_MONITOR = [
    {"name": "Google", "url": "https://www.google.com"},
    {"name": "GitHub", "url": "https://www.github.com"},
    {"name": "My Portfolio", "url": "https://react-portfolio-85u.pages.dev"}
]

app = FastAPI(title="System Monitor API")

# Enable CORS for browser access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("Initializing connection to Redis database...", extra={"extra_fields": {"redis_host": REDIS_HOST, "redis_port": REDIS_PORT}})
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)

# --- Rate Limiting Middleware ---
RATE_LIMIT_REQUESTS = 60
RATE_LIMIT_WINDOW_SECONDS = 60

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # We only rate limit API paths
        if request.url.path.startswith("/api"):
            # Fetch client IP from X-Forwarded-For header if behind reverse proxy/ingress
            x_forwarded_for = request.headers.get("x-forwarded-for")
            if x_forwarded_for:
                client_ip = x_forwarded_for.split(",")[0].strip()
            else:
                client_ip = request.client.host if request.client else "unknown"
            
            try:
                redis_key = f"rate_limit:{client_ip}"
                current_count_str = await redis_client.get(redis_key)
                
                if current_count_str is not None:
                    current_count = int(current_count_str)
                    if current_count >= RATE_LIMIT_REQUESTS:
                        logger.warning(
                            "Rate limit exceeded for client",
                            extra={"extra_fields": {"client_ip": client_ip, "path": request.url.path}}
                        )
                        return JSONResponse(
                            status_code=429,
                            content={"detail": "Too many requests. Please try again later."}
                        )
                    await redis_client.incr(redis_key)
                else:
                    await redis_client.set(redis_key, 1, ex=RATE_LIMIT_WINDOW_SECONDS)
            except Exception as e:
                # Fail-open if Redis encounters connection errors
                logger.error(
                    "Error executing rate limit in Redis",
                    extra={"extra_fields": {"error": str(e)}}
                )
        
        response = await call_next(request)
        return response

app.add_middleware(RateLimitMiddleware)

# Load Kubernetes Configuration
try:
    config.load_incluster_config()
    logger.info("Loaded in-cluster Kubernetes configuration.")
except Exception:
    try:
        config.load_kube_config()
        logger.info("Loaded local Kubeconfig.")
    except Exception as e:
        logger.warning("Failed to load Kubernetes configuration", extra={"extra_fields": {"error": str(e)}})

async def background_monitoring():
    """Hàm chạy ngầm liên tục để ping trạng thái web và lưu vào Redis."""
    while True:
        try:
            for site in WEBSITES_TO_MONITOR:
                is_up = False
                status_code = 0
                latency = 0
                try:
                    start_time = time.time()
                    async with httpx.AsyncClient(timeout=5.0) as client_http:
                        response = await client_http.get(site["url"])
                        latency = int((time.time() - start_time) * 1000)
                        status_code = response.status_code
                        is_up = status_code < 400
                    
                    logger.info(
                        f"Ping website successful: {site['name']}",
                        extra={"extra_fields": {"url": site["url"], "status_code": status_code, "latency_ms": latency}}
                    )
                except Exception as e:
                    logger.warning(
                        f"Ping website failed: {site['name']}",
                        extra={"extra_fields": {"url": site["url"], "error": str(e)}}
                    )
                    is_up = False
                    status_code = 0
                    latency = 0
                
                data_to_store = {
                    "url": site["url"],
                    "is_up": is_up,
                    "status_code": status_code,
                    "response_time_ms": latency,
                    "created_at": time.time() * 1000
                }
                await redis_client.hset("monitor:status", site["name"], json.dumps(data_to_store))
        except Exception as e:
            logger.error("Background monitoring loop crashed", exc_info=True)
            
        await asyncio.sleep(10)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(background_monitoring())

@app.get("/api/status")
async def get_status():
    """API trả về List trực tiếp cho React StatusDashboard."""
    try:
        status_data = await redis_client.hgetall("monitor:status")
        results = []
        for val in status_data.values():
            results.append(json.loads(val))
        return results
    except Exception as e:
        logger.error("Error fetching website status from Redis", exc_info=True)
        return []

ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "2026")

@app.get("/api/cluster/status")
async def get_cluster_status(x_admin_token: str = Header(None)):
    """API trả về thông số cluster K8s và tài nguyên phần cứng các Node."""
    if not x_admin_token or x_admin_token != ADMIN_TOKEN:
        logger.warning(
            "Unauthorized access attempt to cluster metrics",
            extra={"extra_fields": {"provided_token": x_admin_token or "None"}}
        )
        raise HTTPException(
            status_code=http_status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access to cluster metrics."
        )
    
    logger.info("Admin authorized to query cluster metrics.")
    try:
        v1 = client.CoreV1Api()
        custom_api = client.CustomObjectsApi()
        
        # 1. Lấy danh sách Node
        nodes = v1.list_node()
        node_metrics = []
        
        # Lấy thông tin sử dụng CPU/RAM từ metrics-server
        metrics_map = {}
        try:
            metrics = custom_api.list_cluster_custom_object(
                group="metrics.k8s.io",
                version="v1beta1",
                plural="nodes"
            )
            for item in metrics.get("items", []):
                metrics_map[item["metadata"]["name"]] = item
        except Exception as me:
            logger.warning("Failed to fetch node metrics from metrics-server", extra={"extra_fields": {"error": str(me)}})
            
        for n in nodes.items:
            name = n.metadata.name
            labels = n.metadata.labels or {}
            
            # Vai trò Node
            role = "agent"
            if "node-role.kubernetes.io/control-plane" in labels or "node-role.kubernetes.io/master" in labels:
                role = "control-plane"
                
            # Trạng thái Node
            status = "Unknown"
            for cond in n.status.conditions or []:
                if cond.type == "Ready":
                    status = "Ready" if cond.status == "True" else "NotReady"
                    break
                    
            # Số core CPU
            cpu_capacity = n.status.capacity.get("cpu", "1")
            cpu_cores = int(cpu_capacity) if cpu_capacity.isdigit() else 1
            
            # Dung lượng RAM (Ki -> MB)
            mem_capacity_str = n.status.capacity.get("memory", "0Ki")
            mem_capacity_kb = 0
            if mem_capacity_str.endswith("Ki"):
                mem_capacity_kb = int(mem_capacity_str.replace("Ki", ""))
            elif mem_capacity_str.isdigit():
                mem_capacity_kb = int(mem_capacity_str) // 1024
                
            # Thông số thực tế sử dụng từ metrics-server
            cpu_usage_pct = 0.0
            mem_usage_pct = 0.0
            cpu_usage_m = 0
            mem_usage_kb = 0
            
            if name in metrics_map:
                usage = metrics_map[name].get("usage", {})
                cpu_nano = usage.get("cpu", "0n")
                if cpu_nano.endswith("n"):
                    cpu_usage_m = int(cpu_nano.replace("n", "")) // 1000000
                elif cpu_nano.isdigit():
                    cpu_usage_m = int(cpu_nano) // 1000000
                    
                mem_ki = usage.get("memory", "0Ki")
                if mem_ki.endswith("Ki"):
                    mem_usage_kb = int(mem_ki.replace("Ki", ""))
                elif mem_ki.isdigit():
                    mem_usage_kb = int(mem_ki)
                    
                if cpu_cores > 0:
                    cpu_usage_pct = round((cpu_usage_m / (cpu_cores * 1000)) * 100, 1)
                if mem_capacity_kb > 0:
                    mem_usage_pct = round((mem_usage_kb / mem_capacity_kb) * 100, 1)
                    
            # Đổi tên Node thật thành tên chung chung để bảo mật
            masked_name = "Node Master" if role == "control-plane" else f"Node Agent"
            
            node_metrics.append({
                "name": masked_name,
                "role": role,
                "status": status,
                "cpu_cores": cpu_cores,
                "cpu_usage_m": cpu_usage_m,
                "cpu_usage_pct": cpu_usage_pct,
                "memory_capacity_mb": mem_capacity_kb // 1024,
                "memory_usage_mb": mem_usage_kb // 1024,
                "memory_usage_pct": mem_usage_pct
            })
            
        # 2. Thống kê số Pod
        pods = v1.list_pod_for_all_namespaces()
        pod_stats = {
            "total": len(pods.items),
            "running": 0,
            "pending": 0,
            "failed": 0,
            "succeeded": 0
        }
        for p in pods.items:
            phase = p.status.phase.lower()
            if phase in pod_stats:
                pod_stats[phase] += 1

        # 3. Tính toán dung lượng đĩa của máy chủ Host
        disk_path = "/host" if os.path.exists("/host") else "/"
        try:
            total, used, free = shutil.disk_usage(disk_path)
            disk_total_gb = round(total / (1024 ** 3), 1)
            disk_used_gb = round(used / (1024 ** 3), 1)
            disk_usage_pct = round((used / total) * 100, 1)
        except Exception as de:
            logger.warning("Failed to read host disk usage", extra={"extra_fields": {"error": str(de)}})
            disk_total_gb, disk_used_gb, disk_usage_pct = 0, 0, 0

        # 4. Tính toán thời gian Uptime của máy chủ Host
        uptime_path = "/host/proc/uptime" if os.path.exists("/host/proc/uptime") else "/proc/uptime"
        uptime_str = "Unknown"
        try:
            with open(uptime_path, "r") as f:
                uptime_seconds = float(f.readline().split()[0])
            
            days = int(uptime_seconds // (24 * 3600))
            hours = int((uptime_seconds % (24 * 3600)) // 3600)
            minutes = int((uptime_seconds % 3600) // 60)
            
            if days > 0:
                uptime_str = f"{days}d {hours}h {minutes}m"
            elif hours > 0:
                uptime_str = f"{hours}h {minutes}m"
            else:
                uptime_str = f"{minutes}m"
        except Exception as ue:
            logger.warning("Failed to read host uptime", extra={"extra_fields": {"error": str(ue)}})
                
        logger.info(
            "Cluster metrics fetched successfully",
            extra={"extra_fields": {"nodes_count": len(nodes.items), "pods_count": len(pods.items)}}
        )
        return {
            "status": "Healthy",
            "nodes": node_metrics,
            "pods": pod_stats,
            "host_disk": {
                "total_gb": disk_total_gb,
                "used_gb": disk_used_gb,
                "pct": disk_usage_pct
            },
            "host_uptime": uptime_str,
            "timestamp": time.time() * 1000
        }
        
    except Exception as e:
        logger.error("Error fetching cluster status", exc_info=True)
        return {
            "status": "Unhealthy",
            "error": str(e),
            "nodes": [],
            "pods": {"total": 0, "running": 0, "pending": 0, "failed": 0, "succeeded": 0},
            "timestamp": time.time() * 1000
        }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
