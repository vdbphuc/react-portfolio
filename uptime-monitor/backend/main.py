from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import os
from pydantic import BaseModel
from typing import List
from datetime import datetime

app = FastAPI()

# Cấu hình CORS (Để React gọi được API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Trong môi trường thật nên set cụ thể domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cấu hình DB
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "postgres")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "password")

class LogItem(BaseModel):
    url: str
    status_code: int
    response_time_ms: int
    is_up: bool
    created_at: datetime

@app.get("/")
def read_root():
    return {"status": "API is running"}

@app.get("/api/status", response_model=List[LogItem])
def get_latest_status():
    """Lấy trạng thái mới nhất của từng URL"""
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "db"), # Lấy từ env, mặc định là "db"
        database=os.getenv("DB_NAME", "postgres"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASS", "password")
    )
    cur = conn.cursor()
    
    # Query SQL thông minh: Lấy record mới nhất của mỗi URL
    query = """
    SELECT DISTINCT ON (url) url, status_code, response_time_ms, is_up, created_at
    FROM monitor_logs
    ORDER BY url, created_at DESC;
    """
    
    cur.execute(query)
    rows = cur.fetchall()
    
    results = []
    for row in rows:
        results.append({
            "url": row[0],
            "status_code": row[1],
            "response_time_ms": row[2],
            "is_up": row[3],
            "created_at": row[4]
        })
    
    cur.close()
    conn.close()
    return results