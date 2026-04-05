import os
import time
import asyncio
import httpx
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import redis.asyncio as redis

# Configuration
REDIS_HOST = os.getenv("REDIS_HOST", "redis-service")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
# Một số website mẫu để hệ thống monitor theo dõi
WEBSITES_TO_MONITOR = [
    {"name": "Google", "url": "https://www.google.com"},
    {"name": "GitHub", "url": "https://www.github.com"},
    {"name": "My Portfolio", "url": "https://react-portfolio-85u.pages.dev"} # Ví dụ web nội bộ
]

app = FastAPI(title="System Monitor API")

# Bật CORS cho phép Web (React) truy cập API này từ trình duyệt
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)

import json

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
                    async with httpx.AsyncClient(timeout=5.0) as client:
                        response = await client.get(site["url"])
                        latency = int((time.time() - start_time) * 1000)
                        status_code = response.status_code
                        is_up = status_code < 400
                except Exception as e:
                    print(f"Error fetching {site['url']}: {e}", flush=True)
                    is_up = False
                    status_code = 0
                    latency = 0
                
                # Lưu object JSON
                data_to_store = {
                    "url": site["url"],
                    "is_up": is_up,
                    "status_code": status_code,
                    "response_time_ms": latency,
                    "created_at": time.time() * 1000
                }
                await redis_client.hset("monitor:status", site["name"], json.dumps(data_to_store))
        except Exception as e:
            print(f"Background monitoring loop crashed with error: {e}", flush=True)
            
        await asyncio.sleep(10)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(background_monitoring())

@app.get("/api/status")
async def get_status():
    """API trả về List trực tiếp cho React setState."""
    status_data = await redis_client.hgetall("monitor:status")
    results = []
    for val in status_data.values():
        results.append(json.loads(val))
    return results

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
