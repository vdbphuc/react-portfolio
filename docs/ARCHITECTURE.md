# 🏛️ Full Stack System Architecture & Maintenance Guide

Tổng quan cấu trúc dự án **React Portfolio & System Monitor Platform**.

---

## 📁 Cấu trúc Thư mục Mở rộng (Folder Structure)

```text
react-portfolio/
├── docs/                           # 📚 Tài liệu Workflow & Maintenance
│   ├── AI_WORKFLOW.md              # -> Luồng hoạt động AI Assistant & Agent Skills
│   ├── REMOTE_HOST_WORKFLOW.md     # -> Hướng dẫn kết nối SSH & Secret Keys
│   └── INFRASTRUCTURE_WORKFLOW.md  # -> Chi tiết hạ tầng K3s, Redis, Cloudflare
├── src/                            # 🎨 Source Code Frontend (React + Vite + Tailwind)
│   ├── components/                 # -> Các Component 3D Glassmorphic (Hero, Nav, Skills, Projects, Certs...)
│   ├── pages/                      # -> Pages chính (HomePage, MonitorPage, BlogPage...)
│   ├── data/                       # -> Dữ liệu Portfolio (CV, Projects, Certs JSON)
│   ├── index.css                   # -> Custom 3D perspective styles & keyframe animations
│   └── ChatBot.jsx                 # -> Giao diện AI Assistant Chat Workspace
├── system-monitor/                 # ⚙️ Source Code Backend & Kubernetes Deployment
│   ├── backend/                    # -> FastAPI Engine, Agent Skills, System Metrics
│   │   ├── main.py                 #    - Core API & Agent Skill Functions
│   │   ├── requirements.txt        #    - Dependencies (FastAPI, Redis, Gemini, Anthropic)
│   │   └── Dockerfile              #    - Docker build file
│   ├── k8s/                        # -> Các Manifest Deployment Kubernetes
│   │   ├── backend-deployment.yaml #    - Deployment & Environment Secrets Ref
│   │   ├── redis-deployment.yaml   #    - Redis Memory Storage
│   │   └── monitor-rbac.yaml       #    - K8s Cluster Metrics RBAC Permissions
│   └── deploy_monitor.sh           # -> Script tự động build & deploy lên K3s
├── README.md                       # 📖 Root Documentation & Quick Start
└── package.json                    # 📦 Frontend Dependencies
```
