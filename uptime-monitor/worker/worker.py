import os
import requests
import psycopg2
import telebot
from datetime import datetime

# Lấy cấu hình từ biến môi trường (Kỹ năng 12-Factor App)
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "postgres")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "password")
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")

# Danh sách các web cần check
TARGETS = [
    "https://google.com",
    "https://github.com",
    "https://react-portfolio-85u.pages.dev/" # Thay bằng web thật của bạn
]

def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )
    return conn

def send_alert(url, error_msg):
    if TELEGRAM_TOKEN and CHAT_ID:
        try:
            bot = telebot.TeleBot(TELEGRAM_TOKEN)
            bot.send_message(CHAT_ID, f"🚨 **ALERT:** {url} is DOWN!\nError: {error_msg}")
            print(f"Sent alert for {url}")
        except Exception as e:
            print(f"Failed to send alert: {e}")

def check_sites():
    conn = get_db_connection()
    cur = conn.cursor()

    print(f"--- Starting Check at {datetime.now()} ---")
    
    for url in TARGETS:
        status_code = 0
        response_time = 0
        is_up = False
        error_msg = ""

        try:
            # Timeout 10s, nếu lâu hơn coi như chết
            response = requests.get(url, timeout=10)
            status_code = response.status_code
            response_time = int(response.elapsed.total_seconds() * 1000)
            
            if 200 <= status_code < 300:
                is_up = True
            else:
                error_msg = f"Status Code: {status_code}"
                
        except Exception as e:
            error_msg = str(e)
            is_up = False

        # Ghi vào DB
        cur.execute(
            "INSERT INTO monitor_logs (url, status_code, response_time_ms, is_up) VALUES (%s, %s, %s, %s)",
            (url, status_code, response_time, is_up)
        )
        
        # Logic gửi cảnh báo: Chỉ gửi nếu Web chết
        if not is_up:
            print(f"❌ {url} DOWN! ({error_msg})")
            send_alert(url, error_msg)
        else:
            print(f"✅ {url} is UP - {response_time}ms")

    conn.commit()
    cur.close()
    conn.close()
    print("--- Check Finished ---")

if __name__ == "__main__":
    check_sites()