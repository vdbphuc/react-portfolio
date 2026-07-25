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
import google.generativeai as genai
import anthropic
from pydantic import BaseModel

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

# API Keys and Telegram configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

gemini_client = None
anthropic_client = None

if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_client = genai.GenerativeModel("gemini-1.5-flash")
        logger.info("Gemini client successfully initialized.")
    except Exception as e:
        logger.error(f"Failed to configure Gemini: {e}")

if ANTHROPIC_API_KEY:
    try:
        anthropic_client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
        logger.info("Anthropic client successfully initialized.")
    except Exception as e:
        logger.error(f"Failed to configure Anthropic: {e}")

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

# --- Alerting Utilities ---
async def send_telegram_message(message: str):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "HTML"
    }
    try:
        async with httpx.AsyncClient(timeout=5.0) as client_http:
            response = await client_http.post(url, json=payload)
            if response.status_code == 200:
                logger.info("Telegram notification sent successfully.")
            else:
                logger.warning(f"Telegram returned status {response.status_code}: {response.text}")
    except Exception as e:
        logger.error(f"Failed to send Telegram notification: {e}")

async def trigger_alert(key: str, message: str, level: str = "CRITICAL"):
    alert_log = {
        "key": key,
        "message": message,
        "level": level,
        "created_at": time.time() * 1000,
        "status": "active"
    }
    await redis_client.lpush("monitor:alerts", json.dumps(alert_log))
    await redis_client.ltrim("monitor:alerts", 0, 14)
    
    is_active = await redis_client.get(f"alert:active:{key}")
    if not is_active:
        await redis_client.set(f"alert:active:{key}", json.dumps(alert_log))
        emoji = "🔴" if level == "CRITICAL" else "⚠️"
        await send_telegram_message(f"{emoji} <b>[SYSTEM ALERT - {level}]</b>\n{message}\nTime: {time.strftime('%Y-%m-%d %H:%M:%S')}")

async def resolve_alert(key: str, message: str):
    is_active = await redis_client.get(f"alert:active:{key}")
    if is_active:
        await redis_client.delete(f"alert:active:{key}")
        alert_log = {
            "key": key,
            "message": message,
            "level": "INFO",
            "created_at": time.time() * 1000,
            "status": "resolved"
        }
        await redis_client.lpush("monitor:alerts", json.dumps(alert_log))
        await redis_client.ltrim("monitor:alerts", 0, 14)
        
        await send_telegram_message(f"🟢 <b>[SYSTEM RECOVERED]</b>\n{message}\nTime: {time.strftime('%Y-%m-%d %H:%M:%S')}")

async def check_resource_alert(key: str, value: float, threshold: float, message: str):
    if value > threshold:
        await trigger_alert(key, message, "WARNING")
    else:
        await resolve_alert(key, f"Resource alert resolved: {key} is normal at {value}%")

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

                # Push history to Redis list
                history_key = f"monitor:history:latency:{site['name']}"
                await redis_client.lpush(history_key, json.dumps({
                    "timestamp": time.time() * 1000,
                    "latency": latency,
                    "is_up": is_up
                }))
                await redis_client.ltrim(history_key, 0, 29)

                # Check alerts
                if not is_up:
                    await trigger_alert(f"site:{site['name']}", f"Website is OFFLINE: {site['name']} ({site['url']})", "CRITICAL")
                else:
                    await resolve_alert(f"site:{site['name']}", f"Website is ONLINE again: {site['name']} ({site['url']})")

        except Exception as e:
            logger.error("Background monitoring loop crashed", exc_info=True)
            
        await asyncio.sleep(10)

async def background_cluster_monitoring():
    """Hàm chạy ngầm thu thập metrics của K8s cluster và lưu vào Redis history."""
    while True:
        try:
            v1 = client.CoreV1Api()
            custom_api = client.CustomObjectsApi()
            
            nodes = v1.list_node()
            metrics_map = {}
            try:
                metrics = custom_api.list_cluster_custom_object(
                    group="metrics.k8s.io",
                    version="v1beta1",
                    plural="nodes"
                )
                for item in metrics.get("items", []):
                    metrics_map[item["metadata"]["name"]] = item
            except Exception:
                pass
                
            for n in nodes.items:
                name = n.metadata.name
                labels = n.metadata.labels or {}
                role = "agent"
                if "node-role.kubernetes.io/control-plane" in labels or "node-role.kubernetes.io/master" in labels:
                    role = "control-plane"
                    
                cpu_capacity = n.status.capacity.get("cpu", "1")
                cpu_cores = int(cpu_capacity) if cpu_capacity.isdigit() else 1
                
                mem_capacity_str = n.status.capacity.get("memory", "0Ki")
                mem_capacity_kb = 0
                if mem_capacity_str.endswith("Ki"):
                    mem_capacity_kb = int(mem_capacity_str.replace("Ki", ""))
                elif mem_capacity_str.isdigit():
                    mem_capacity_kb = int(mem_capacity_str) // 1024
                    
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
                
                masked_name = "Node Master" if role == "control-plane" else "Node Agent"
                
                # Check resource thresholds
                await check_resource_alert(f"cpu:{masked_name}", cpu_usage_pct, 90.0, f"CPU usage on {masked_name} is high: {cpu_usage_pct}%")
                await check_resource_alert(f"memory:{masked_name}", mem_usage_pct, 90.0, f"Memory usage on {masked_name} is high: {mem_usage_pct}%")
                
                # Push history
                ts = time.time() * 1000
                cpu_history_key = f"monitor:history:cpu:{masked_name}"
                mem_history_key = f"monitor:history:memory:{masked_name}"
                
                await redis_client.lpush(cpu_history_key, json.dumps({"timestamp": ts, "value": cpu_usage_pct}))
                await redis_client.ltrim(cpu_history_key, 0, 29)
                
                await redis_client.lpush(mem_history_key, json.dumps({"timestamp": ts, "value": mem_usage_pct}))
                await redis_client.ltrim(mem_history_key, 0, 29)
                
            # Total pods
            pods = v1.list_pod_for_all_namespaces()
            pods_history_key = "monitor:history:pods"
            await redis_client.lpush(pods_history_key, json.dumps({"timestamp": time.time() * 1000, "value": len(pods.items)}))
            await redis_client.ltrim(pods_history_key, 0, 29)
            
        except Exception as e:
            logger.error(f"Error in background_cluster_monitoring: {e}")
            
        await asyncio.sleep(15)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(background_monitoring())
    asyncio.create_task(background_cluster_monitoring())

@app.get("/api/status")
async def get_status():
    """API trả về List trực tiếp cho React StatusDashboard."""
    try:
        status_data = await redis_client.hgetall("monitor:status")
        results = []
        for val in status_data.values():
            item = json.loads(val)
            site_name = None
            for site in WEBSITES_TO_MONITOR:
                if site["url"] == item["url"]:
                    site_name = site["name"]
                    break
            
            # Fetch history
            history = []
            if site_name:
                history_data = await redis_client.lrange(f"monitor:history:latency:{site_name}", 0, -1)
                history = [json.loads(h) for h in history_data]
                history.reverse()
            item["history"] = history
            results.append(item)
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
            masked_name = "Node Master" if role == "control-plane" else "Node Agent"
            
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
                
        # Fetch histories
        cpu_master_hist = await redis_client.lrange("monitor:history:cpu:Node Master", 0, -1)
        cpu_agent_hist = await redis_client.lrange("monitor:history:cpu:Node Agent", 0, -1)
        mem_master_hist = await redis_client.lrange("monitor:history:memory:Node Master", 0, -1)
        mem_agent_hist = await redis_client.lrange("monitor:history:memory:Node Agent", 0, -1)
        pods_hist = await redis_client.lrange("monitor:history:pods", 0, -1)
        
        def parse_hist(h_list):
            parsed = [json.loads(x) for x in h_list]
            parsed.reverse()
            return parsed

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
            "history": {
                "cpu_master": parse_hist(cpu_master_hist),
                "cpu_agent": parse_hist(cpu_agent_hist),
                "mem_master": parse_hist(mem_master_hist),
                "mem_agent": parse_hist(mem_agent_hist),
                "pods": parse_hist(pods_hist)
            },
            "timestamp": time.time() * 1000
        }
        
    except Exception as e:
        logger.error("Error fetching cluster status", exc_info=True)
        return {
            "status": "Unhealthy",
            "error": str(e),
            "nodes": [],
            "pods": {"total": 0, "running": 0, "pending": 0, "failed": 0, "succeeded": 0},
            "history": {
                "cpu_master": [], "cpu_agent": [], "mem_master": [], "mem_agent": [], "pods": []
            },
            "timestamp": time.time() * 1000
        }

@app.get("/api/alerts")
async def get_alerts():
    """API trả về danh sách cảnh báo hệ thống gần đây."""
    try:
        alert_data = await redis_client.lrange("monitor:alerts", 0, -1)
        return [json.loads(a) for a in alert_data]
    except Exception as e:
        logger.error("Error fetching alerts from Redis", exc_info=True)
        return []

@app.get("/api/cluster/diagnose")
async def get_diagnose(x_admin_token: str = Header(None)):
    """API sử dụng LLM để chẩn đoán tình trạng hệ thống."""
    if not x_admin_token or x_admin_token != ADMIN_TOKEN:
        raise HTTPException(
            status_code=http_status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access."
        )
        
    try:
        # Thu thập dữ liệu hiện tại
        status_data = await redis_client.hgetall("monitor:status")
        sites_summary = []
        for val in status_data.values():
            item = json.loads(val)
            sites_summary.append({
                "url": item["url"],
                "is_up": item["is_up"],
                "latency_ms": item["response_time_ms"],
                "status_code": item["status_code"]
            })
            
        cluster_info = {}
        try:
            cluster_info = await get_cluster_status(x_admin_token=x_admin_token)
        except Exception:
            pass
            
        alerts = await get_alerts()
        
        system_data = {
            "timestamp": time.time(),
            "websites": sites_summary,
            "cluster": {
                "nodes": cluster_info.get("nodes", []),
                "pods": cluster_info.get("pods", {}),
                "host_disk": cluster_info.get("host_disk", {}),
                "host_uptime": cluster_info.get("host_uptime", "Unknown")
            },
            "recent_alerts": alerts[:5]
        }
        
        prompt = f"""
Bạn là chuyên gia SRE và Cloud Architect. Hãy phân tích dữ liệu giám sát hệ thống dưới đây và đưa ra báo cáo chẩn đoán hệ thống chi tiết nhưng súc tích bằng tiếng Việt.
Yêu cầu báo cáo gồm các phần:
1. 📊 **Tóm tắt sức khỏe hệ thống** (Đánh giá chung qua Emoji)
2. ⚠️ **Các vấn đề cần chú ý** (Nếu có website sập, CPU/RAM cao, hoặc log cảnh báo)
3. 💡 **Đề xuất khắc phục / Tối ưu** (Hướng dẫn tối ưu Kubernetes, tài nguyên hoặc mạng)

Dữ liệu hệ thống hiện tại:
{json.dumps(system_data, indent=2)}
"""

        response_text = ""
        if gemini_client:
            response = gemini_client.generate_content(prompt)
            response_text = response.text
        elif anthropic_client:
            message = await anthropic_client.messages.create(
                model="claude-3-5-sonnet-latest",
                max_tokens=1524,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            response_text = message.content[0].text
        else:
            response_text = """
### ⚠️ Không tìm thấy API Key cho dịch vụ AI (Gemini / Claude).
Vui lòng cấu hình biến môi trường `GEMINI_API_KEY` hoặc `ANTHROPIC_API_KEY` để kích hoạt tính năng chẩn đoán hệ thống thông minh bằng AI.
"""
        return {"report": response_text}
        
    except Exception as e:
        logger.error("Error generating system diagnostics", exc_info=True)
        return {"report": f"Lỗi tạo chẩn đoán hệ thống: {str(e)}"}


# ==============================================================================
# AGENT SKILLS & TOOLS (AI FUNCTION CALLING)
# ==============================================================================

async def get_system_health_skill():
    """[Agent Skill] Retrieves real-time server CPU/RAM usage, uptime, and website monitoring status."""
    try:
        status_data = await redis_client.hgetall("monitor:status")
        sites_status = []
        for val in status_data.values():
            item = json.loads(val)
            status_str = "ONLINE (200 OK)" if item.get('is_up') else "OFFLINE"
            sites_status.append(f"• {item.get('url')}: {status_str} - Latency: {item.get('response_time_ms')}ms")
        
        return {
            "skill_name": "get_system_health_skill",
            "status": "success",
            "monitored_websites": sites_status,
            "architecture": "Oracle Cloud VM (K3s Kubernetes Cluster)",
            "timestamp": time.time()
        }
    except Exception as e:
        return {"skill_name": "get_system_health_skill", "error": str(e)}

async def get_cv_credentials_skill():
    """[Agent Skill] Retrieves verified professional credentials, CKAD & PSM I certifications, Erlang/IMS telecom stack, and projects for Phuc Vu."""
    return {
        "skill_name": "get_cv_credentials_skill",
        "candidate": "Vu Dinh Bao Phuc (Phuc Vu)",
        "role": "Software Engineer & Scrum Master (4+ Years Exp)",
        "certifications": [
            {"title": "CKAD: Certified Kubernetes Application Developer", "issuer": "The Linux Foundation", "date": "Jun 2026", "id": "806d167b-3a2b-40c5-89ec-0ebb19e54a4f"},
            {"title": "Professional Scrum Master I (PSM I)", "issuer": "Scrum.org", "date": "Sep 2025", "id": "01e6a425-dbdb-4420-9207-30c0984dd21a"}
        ],
        "core_domains": [
            "IMS Telecom Architecture (P-CSCF, IBCF components)",
            "High-concurrency systems programming in Erlang, C++, Python",
            "Kubernetes & Container Orchestration (Docker, K3s, Helm, Kustomize)",
            "Scrum Master & Mentorship (4+ Interns guided)"
        ],
        "key_projects": [
            "Global Telecom IMS Core Infrastructure",
            "LoRaWAN Gateway Coverage Display System (GPS + The Things Network + Firebase)",
            "System Monitor & K3s Cluster Diagnostics Platform"
        ]
    }


class ChatRequest(BaseModel):
    message: str
    history: list = []

@app.post("/api/chat")
async def chat_with_assistant(req: ChatRequest):
    """API chat với Trợ lý ảo của Phúc Vũ, tích hợp Agent Skills (System Metrics & CV Credentials Skills)."""
    try:
        # Dynamically execute Agent Skills to get live context
        health_skill_result = await get_system_health_skill()
        cv_skill_result = await get_cv_credentials_skill()
        
        system_context = f"""
Bạn là AI Assistant được trang bị các Agent Skills thông minh, đại diện cho anh Vũ Đình Bảo Phúc (Phúc Vũ).
Nhiệm vụ của bạn là giải đáp thắc mắc về hồ sơ năng lực, các dự án, kỹ năng, chứng chỉ quốc tế và trạng thái máy chủ của anh Phúc.

[AGENT SKILL EXECUTION RESULTS]:
1. CV & Credentials Skill Output:
{json.dumps(cv_skill_result, indent=2, ensure_ascii=False)}

2. Live System Health Skill Output:
{json.dumps(health_skill_result, indent=2, ensure_ascii=False)}

[Quy tắc phản hồi]:
- Hãy trả lời bằng đúng ngôn ngữ người dùng đang dùng (Tiếng Việt hoặc Tiếng Anh).
- Khi người dùng hỏi về hệ thống, hãy trích dẫn số liệu thực tế từ Live System Health Skill.
- Giữ phong thái tự tin, chuyên nghiệp, nhiệt tình.
"""

        response_text = ""
        
        if gemini_client:
            contents = []
            contents.append({"role": "user", "parts": [f"[System Instruction]\n{system_context}\n\n[User message]\nBắt đầu cuộc trò chuyện. Hãy nhớ các thông tin trên."] })
            contents.append({"role": "model", "parts": ["Dạ tôi đã hiểu! Tôi sẵn sàng đóng vai trợ lý ảo của anh Phúc Vũ để giải đáp thắc mắc của bạn."] })
            
            for msg in req.history:
                role = "user" if msg["role"] == "user" else "model"
                contents.append({"role": role, "parts": [msg["content"]]})
                
            contents.append({"role": "user", "parts": [req.message]})
            
            response = gemini_client.generate_content(contents)
            response_text = response.text
            
        elif anthropic_client:
            messages = []
            for msg in req.history:
                messages.append({"role": msg["role"], "content": msg["content"]})
            messages.append({"role": "user", "content": req.message})
            
            message = await anthropic_client.messages.create(
                model="claude-3-5-sonnet-latest",
                max_tokens=1024,
                system=system_context,
                messages=messages
            )
            response_text = message.content[0].text
        else:
            response_text = "Xin chào! Hiện tại tôi chưa được cấu hình API Key (Gemini/Claude) trên máy chủ. Bạn có thể liên hệ trực tiếp với anh Phúc qua email phuc821644@gmail.com. Cảm ơn bạn!"
            
        return {"response": response_text}
    except Exception as e:
        logger.error("Error in AI Chat API", exc_info=True)
        return {"response": f"Xin lỗi, tôi gặp sự cố kết nối với mô hình AI: {str(e)}"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
