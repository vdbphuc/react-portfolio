# 🏗️ Host Infrastructure & Services Workflow

Tài liệu mô tả chi tiết kiến trúc hạ tầng máy chủ Oracle Cloud, cụm **K3s Kubernetes**, hệ thống **Redis Cache**, và luồng triển khai ứng dụng.

---

## 🛰️ 1. Danh sách các Dịch vụ đang Vận hành trên Server

| Dịch vụ | Công nghệ | Nhiệm vụ chính | Domain / Endpoint |
| :--- | :--- | :--- | :--- |
| **Frontend Portfolio** | Cloudflare Pages / React | Giao diện 3D Portfolio & Chat UI | `https://bida.asia` |
| **Backend API Monitor** | FastAPI (Python 3.11) | API Giám sát uptime, Agent Skills, Alerting | `https://monitor-api.bida.asia` |
| **Redis In-Memory** | Redis 7.0 | Lưu cache trạng thái website, CPU/RAM & log alerts | Nội bộ K3s Cluster (`redis-service:6379`) |
| **Kubernetes Engine** | K3s (Lightweight K8s) | Quản lý container pods, restart tự động khi lỗi | Node local trên Oracle VM |
| **Network Ingress** | Cloudflare Tunnel / Ingress | Bảo mật SSL/TLS, ẩn IP thật của máy chủ | Cloudflare Edge Network |

---

## 📊 2. Sơ đồ Hạ tầng Máy chủ (Infrastructure Architecture)

```text
               ┌────────────────────────────────────────┐
               │    Cloudflare Global Edge Network      │
               └──────────────────┬─────────────────────┘
                                  │ (HTTPS / TLS)
                                  ▼
                     ┌────────────────────────┐
                     │   Cloudflare Tunnel    │
                     └────────────┬───────────┘
                                  │ (Encrypted Tunnel)
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Oracle Cloud Infrastructure VM                    │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     K3s Kubernetes Cluster                       │  │
│  │                                                                  │  │
│  │  ┌───────────────────────────┐    ┌───────────────────────────┐  │  │
│  │  │  monitor-backend (Pod)    │    │   redis-deploy (Pod)      │  │  │
│  │  │  - FastAPI Engine         │<-->│   - In-Memory Cache       │  │  │
│  │  │  - AI Agent Skills        │    │   - Alert Logs Queue      │  │  │
│  │  │  - Uptime Checker Worker  │    └───────────────────────────┘  │  │
│  │  └───────────────────────────┘                                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 3. Quy trình Triển khai (Deployment Script)

Hệ thống được tự động hóa triển khai bằng script `system-monitor/deploy_monitor.sh`:

```bash
# Triển khai tự động tất cả tài nguyên K8s lên server
cd ~/Project/react-portfolio/system-monitor
chmod +x deploy_monitor.sh
./deploy_monitor.sh
```

Script sẽ tự động thực thi các bước:
1. Build Docker image `monitor-backend:latest`
2. Nạp image vào cụm K3s (`k3s ctr images import`)
3. Apply các file YAML trong `system-monitor/k8s/`:
   * `redis-deployment.yaml` & `redis-service.yaml`
   * `backend-deployment.yaml` & `backend-service.yaml`
   * `monitor-rbac.yaml` (Cấp quyền đọc pod metrics cho K8s API)
