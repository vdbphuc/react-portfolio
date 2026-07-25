# 🚀 React Portfolio & AI System Monitor Platform

> Modern **React 19 + 3D UI**, **Python FastAPI**, **K3s Kubernetes**, and **AI Agent Skills** platform for Vu Dinh Bao Phuc (Phuc Vu).

---

## 📚 Workflow Documentation (`docs/`)

Để dự án dễ bảo trì và mở rộng trong tương lai, tất cả tài liệu hướng dẫn quy trình được chia thành các file Markdown chuyên biệt trong thư mục [`docs/`](./docs):

* 🤖 **[AI_WORKFLOW.md](./docs/AI_WORKFLOW.md)**  
  * Hướng dẫn chi tiết luồng xử lý AI Assistant (`/api/chat`), định nghĩa và cách mở rộng các **Python Agent Skills** (`get_system_health_skill()`, `get_cv_credentials_skill()`).
* 🖥️ **[REMOTE_HOST_WORKFLOW.md](./docs/REMOTE_HOST_WORKFLOW.md)**  
  * Hướng dẫn kết nối **SSH**, cấu hình SSH config, quản lý **Secret Keys** (`monitor-secrets`) và thao tác trực tiếp trên máy chủ Oracle Cloud.
* 🏗️ **[INFRASTRUCTURE_WORKFLOW.md](./docs/INFRASTRUCTURE_WORKFLOW.md)**  
  * Chi tiết danh sách dịch vụ đang vận hành trên server: Cụm **K3s Kubernetes**, **Redis Cache**, **Cloudflare Tunnels**, và script tự động triển khai `deploy_monitor.sh`.
* 🏛️ **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)**  
  * Sơ đồ cấu trúc thư mục toàn bộ dự án (Frontend React + Backend FastAPI + K8s Manifests).

---

## 📁 Cấu trúc Thư mục Chính (Directory Overview)

```text
react-portfolio/
├── docs/                           # 📚 Documentation & Workflows
│   ├── AI_WORKFLOW.md              # -> Agent Skills & LLM Chat Integration
│   ├── REMOTE_HOST_WORKFLOW.md     # -> SSH & Remote Server Management
│   ├── INFRASTRUCTURE_WORKFLOW.md  # -> K3s, Redis & Cloudflare Tunnel Status
│   └── ARCHITECTURE.md             # -> Full Stack Project Structure
├── src/                            # 🎨 Frontend Source Code (React 19, Vite, Tailwind CSS 3D)
│   ├── components/                 # -> 3D Glassmorphic Components (Hero, Nav, Skills, Projects, Certs)
│   └── ChatBot.jsx                 # -> 3D AI Assistant Workspace UI
├── system-monitor/                 # ⚙️ Backend Engine & Cloud Infrastructure
│   ├── backend/                    # -> FastAPI Engine & Python Agent Skills (main.py)
│   ├── k8s/                        # -> Kubernetes Manifests (Redis, Backend, Ingress, RBAC)
│   └── deploy_monitor.sh           # -> Automatic K3s Deployment Script
└── README.md                       # 📖 Main Project Documentation
```

---

## ⚡ Quick Start (Local Development)

### Frontend (React + Vite):
```bash
npm install
npm run dev
```

### Backend (Python FastAPI):
```bash
cd system-monitor/backend
pip install -r requirements.txt
python main.py
```
