# 🚦 Hướng Dẫn Vận Hành & Kiến Trúc System Health Monitor

Tài liệu này hướng dẫn chi tiết về cấu trúc hệ thống, luồng dữ liệu (Data Flow), cách cài đặt/vận hành và cấu hình hệ thống giám sát tài nguyên máy chủ (Grafana-like) và website tích hợp trong React Portfolio.

---

## 1. 🏗️ Kiến Trúc Hệ Thống & Luồng Đi Dữ Liệu (Data Flow)

Hệ thống được thiết kế theo mô hình Microservices phân tách độc lập giữa **Frontend (React)** và **Backend (FastAPI + Redis + K8s API)** chạy trên cụm K3s.

### Sơ đồ Luồng Dữ Liệu (Mermaid Diagram)

```mermaid
graph TD
    %% Định nghĩa các Client/Frontend
    Browser[Trình duyệt của User] -->|1. F12/Request API| Ingress[Traefik Ingress - Port 80]
    
    %% Định nghĩa tầng Ingress & Backend API
    subgraph K3s Control-Plane Node (VM Oracle Cloud)
        Ingress -->|Prefix Routing /api| Backend[FastAPI Pod - Port 8000]
        
        %% Quyền hạn & File mount của Backend
        Backend -->|2. Query CPU/RAM| KubeAPI[Kubernetes API Server]
        Backend -->|3. Đọc Uptime & Disk| HostFS[Host File System Mounted /host]
        Backend -->|4. Lấy trạng thái website| Redis[(Redis Pod)]
        
        %% Vòng lặp ngầm của Backend
        BackendLoop[Loop chạy ngầm 10s] -->|Pings & Lưu trạng thái| Redis
    end

    %% Các trang Web bên ngoài
    BackendLoop -->|Ping Latency| Google[https://www.google.com]
    BackendLoop -->|Ping Latency| GitHub[https://www.github.com]
    BackendLoop -->|Ping Latency| Portfolio[Website Portfolio của bạn]
```

### Chi tiết luồng xử lý:
1.  **Giao diện (Frontend React)**: Khi người dùng truy cập trang `/monitor`, React sẽ gọi HTTP GET request tới endpoint `/api/status` (lấy trạng thái Web) và `/api/cluster/status` (lấy tài nguyên máy chủ) thông qua cổng public 80 của VM (được điều hướng bởi Traefik Ingress).
2.  **Thông số K8s Cluster (FastAPI ➔ Kube-API)**: Backend Pod sử dụng ServiceAccount `monitor-backend-sa` kết nối trực tiếp tới Kubernetes API nội bộ. Nó truy vấn thông tin các Node và gọi tới `metrics.k8s.io` để lấy dung lượng CPU/RAM đang sử dụng thực tế.
3.  **Thông số Máy Chủ Host (FastAPI ➔ VM Host OS)**: Thông qua cơ chế ghim (mount) thư mục gốc `/` của VM vật lý vào `/host` của Pod, backend có thể đọc file `/host/proc/uptime` (Uptime thật của VM) và đo trực tiếp ổ đĩa bằng hàm hệ thống của Python.
4.  **Giám sát Website (FastAPI ➔ Redis)**: Một luồng chạy ngầm (background worker) cứ mỗi 10 giây sẽ ping tới Google, GitHub và website portfolio của bạn để đo độ trễ (latency), sau đó lưu kết quả vào Redis Pod. Khi React gọi API, FastAPI chỉ cần đọc nhanh từ Redis và trả về phản hồi tức thì.

---

## 2. 📁 Cấu Trúc Các Tệp Tin

Dự án giám sát nằm tại thư mục `/home/phucvu/Project/react-portfolio/system-monitor/`:
*   `backend/`
    *   [main.py](file:///home/phucvu/Project/react-portfolio/system-monitor/backend/main.py): Mã nguồn Python FastAPI, tích hợp Kubernetes client và kết nối Redis.
    *   [requirements.txt](file:///home/phucvu/Project/react-portfolio/system-monitor/backend/requirements.txt): Khai báo thư viện (FastAPI, Redis, Kubernetes client).
    *   [Dockerfile](file:///home/phucvu/Project/react-portfolio/system-monitor/backend/Dockerfile): File build Docker image cho backend.
*   `k8s/`
    *   [monitor-rbac.yaml](file:///home/phucvu/Project/react-portfolio/system-monitor/k8s/monitor-rbac.yaml): Cấu hình quyền RBAC (ServiceAccount, ClusterRole) để Pod đọc được thông số K8s.
    *   [backend-deployment.yaml](file:///home/phucvu/Project/react-portfolio/system-monitor/k8s/backend-deployment.yaml): Khai báo Deployment chạy Backend Pod ghim trên node Master, cấu hình Mount `/` vật lý.
    *   [backend-service.yaml](file:///home/phucvu/Project/react-portfolio/system-monitor/k8s/backend-service.yaml): Service nội bộ cho backend.
    *   [backend-ingress.yaml](file:///home/phucvu/Project/react-portfolio/system-monitor/k8s/backend-ingress.yaml): Traefik Ingress định tuyến cổng 80 đầu vào tiền tố `/api`.
    *   [redis-deployment.yaml](file:///home/phucvu/Project/react-portfolio/system-monitor/k8s/redis-deployment.yaml): Trình khai báo Redis database (ghim trên node Master).
    *   [redis-service.yaml](file:///home/phucvu/Project/react-portfolio/system-monitor/k8s/redis-service.yaml): Service nội bộ cho Redis.
*   [deploy_monitor.sh](file:///home/phucvu/Project/react-portfolio/system-monitor/deploy_monitor.sh): Kịch bản tự động hóa build và deploy từ máy tính của bạn lên VM.

---

## 3. 🚀 Hướng Dẫn Vận Hành & Triển Khai

### A. Triển khai Backend lên K3s Cluster
Mỗi khi bạn sửa đổi code Python hoặc file YAML ở K8s, chỉ cần chạy duy nhất script sau tại máy máy local của bạn:
```bash
cd /home/phucvu/Project/react-portfolio/system-monitor
./deploy_monitor.sh
```
Script sẽ tự động:
1.  Đồng bộ thư mục lên máy ảo VM Oracle Cloud.
2.  Kết nối SSH và tự động chạy `docker build` tạo Docker image mới.
3.  Nạp image thẳng vào container store của K3s (`containerd`).
4.  Áp dụng (`kubectl apply`) toàn bộ file cấu hình YAML.
5.  Khởi động lại Pod để nhận code mới nhất.

### B. Chạy Frontend React ở Máy Local (Laptop của bạn)
Khi lập trình ở máy local, bạn cần khai báo biến môi trường trỏ API tới VM IP. Có hai cách:
*   **Cách đơn giản**: Tôi đã cấu hình mặc định sẵn IP `http://161.118.195.32/api/...` trong tệp [ClusterDashboard.jsx](file:///home/phucvu/Project/react-portfolio/src/components/ClusterDashboard.jsx) và [StatusDashboard.jsx](file:///home/phucvu/Project/react-portfolio/src/components/StatusDashboard.jsx), bạn chỉ cần mở terminal chạy:
    ```bash
    npm run dev
    ```
*   **Cách chuyên nghiệp**: Tạo tệp tin `.env.development` ở thư mục gốc dự án `react-portfolio/` và ghi:
    ```env
    VITE_API_URL=http://161.118.195.32/api/status
    ```

---

## 4. 🔒 Bảo Mật & Che Giấu Thông Tin (Security Hardening)

Do API này được gọi trực tiếp bởi trình duyệt của người dùng (client-side), để bảo vệ máy chủ của bạn khỏi các hành vi dò quét, hệ thống đã được thiết kế bảo mật sẵn:

1.  **Che giấu Kernel & OS**: API chỉ trả về các số liệu phần trăm CPU, RAM, dung lượng Disk và Uptime chung chung. Tuyệt đối **không trả về** phiên bản nhân Linux (Kernel version), phiên bản hệ điều hành (OS Version) hay phiên bản Kubernetes (Kubelet version) nhằm ngăn chặn kẻ xấu tìm lỗ hổng CVE phù hợp.
2.  **Ẩn danh tên Node**: Tên thật của các VM trên đám mây đã được che dấu và thay bằng tên ảo chung chung là `Node Master` và `Node Agent`.
3.  **Xác thực API qua Header X-Admin-Token**:
    Mật khẩu kích hoạt (ví dụ: `2026`) **không bị chỉnh cứng** trong mã nguồn React nhằm tránh lộ lọt qua F12 Sources. Khi bạn kích hoạt bằng URL bí mật, React sẽ chuyển mật khẩu thành token gửi kèm trong Header `X-Admin-Token` của mọi HTTP request. Backend trên K3s sẽ xác thực mã này với biến môi trường `ADMIN_TOKEN` trên máy chủ; mọi request không hợp lệ đều bị chặn ngay lập tức với lỗi `401 Unauthorized`.
4.  **Khuyến nghị Ẩn IP thật qua Cloudflare (Nên làm)**:
    Khi đưa web lên chạy chính thức, hãy trỏ subdomain (ví dụ `api.phucvu.dev`) về IP máy chủ thông qua Cloudflare và **bật Proxy (đám mây màu cam 🟠)**. Trình duyệt lúc này chỉ giao tiếp với Cloudflare IP, giúp máy chủ Oracle Cloud của bạn ẩn hoàn toàn IP thật để tránh scan và DDoS.
