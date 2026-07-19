# 🛠️ Hướng Dẫn Nâng Cấp & Triển Khai Khi Thay Đổi Source Code

Tài liệu này hướng dẫn chi tiết các bước cần thực hiện để cập nhật hệ thống **System Health Monitor** mỗi khi bạn thay đổi mã nguồn ở các phần khác nhau (Backend Python, Thư viện, K8s manifests, Fluent Bit, hoặc React Frontend).

---

## 🗺️ Tóm tắt nhanh các bước theo loại thay đổi

| Loại thay đổi | File liên quan | Lệnh cần chạy ở máy local | Ghi chú |
| :--- | :--- | :--- | :--- |
| **1. Sửa code Python** | `backend/main.py` | `./deploy_monitor.sh` | Build lại docker image mới và nạp vào cluster. |
| **2. Thêm thư viện Python** | `backend/requirements.txt` | `./deploy_monitor.sh` | Build lại docker image mới chứa thư viện mới. |
| **3. Thay đổi cấu hình K8s** | `k8s/*.yaml` (trừ ConfigMap) | `./deploy_monitor.sh` | Tự động apply cấu hình YAML mới lên cụm K3s. |
| **4. Sửa cấu hình Fluent Bit** | `k8s/fluent-bit-configmap.yaml` | `./deploy_monitor.sh` + Rollout restart | Cần restart pod để container sidecar nhận config mới. |
| **5. Sửa giao diện React** | `src/components/*` | Tự động cập nhật qua HMR | Chạy `npm run dev` local để lập trình trực quan. |

---

## 1. 🐍 Khi thay đổi Code Backend Python (`main.py` hoặc `requirements.txt`)

Khi bạn thay đổi logic xử lý API (ví dụ: thêm API endpoint, sửa thuật toán tính toán) hoặc cài đặt thêm thư viện Python mới:

1. Thực hiện sửa đổi tệp tin [main.py](file:///home/phucvu/Project/react-portfolio/system-monitor/backend/main.py) hoặc [requirements.txt](file:///home/phucvu/Project/react-portfolio/system-monitor/backend/requirements.txt) ở máy local.
2. Mở terminal tại thư mục dự án và chạy script deployment:
   ```bash
   cd /home/phucvu/Project/react-portfolio/system-monitor
   ./deploy_monitor.sh
   ```
   **Cơ chế hoạt động:**
   * Script sẽ tải source code mới lên VM Oracle Cloud.
   * Thực hiện build Docker image mới trên VM với tag `monitor-backend:latest`.
   * Import trực tiếp image vừa build vào kho chứa `containerd` nội bộ của K3s.
   * Áp dụng (`kubectl apply`) lại manifest.
   * Chạy lệnh `kubectl rollout restart deployment/monitor-backend` để ép buộc Kubernetes hủy các Pod cũ và khởi động Pod mới nhằm áp dụng image mới vừa nạp.

---

## 2. ☸️ Khi thay đổi file cấu hình Kubernetes (`k8s/*.yaml` trừ Fluent Bit)

Nếu bạn cần sửa đổi các thông số vận hành của Kubernetes (ví dụ: đổi cổng Port của Service, tăng số lượng Replicas, thay đổi biến môi trường, hoặc thay đổi giới hạn tài nguyên CPU/RAM):

1. Sửa đổi các file tương ứng trong thư mục [k8s/](file:///home/phucvu/Project/react-portfolio/system-monitor/k8s/):
   * [backend-deployment.yaml](file:///home/phucvu/Project/react-portfolio/system-monitor/k8s/backend-deployment.yaml)
   * [backend-service.yaml](file:///home/phucvu/Project/react-portfolio/system-monitor/k8s/backend-service.yaml)
   * [backend-ingress.yaml](file:///home/phucvu/Project/react-portfolio/system-monitor/k8s/backend-ingress.yaml)
   * [redis-deployment.yaml](file:///home/phucvu/Project/react-portfolio/system-monitor/k8s/redis-deployment.yaml)
2. Chạy lệnh deploy:
   ```bash
   ./deploy_monitor.sh
   ```
   **Cơ chế hoạt động:**
   * Script sẽ upload các file YAML mới lên VM và chạy `kubectl apply -f k8s/`.
   * Kubernetes sẽ tự động phát hiện thay đổi trong cấu hình và thực hiện cập nhật cuốn chiếu (rolling update) các Pod tương ứng mà không làm gián đoạn hệ thống.

---

## 📝 3. Khi thay đổi cấu hình Fluent Bit / Log Shipper (`fluent-bit-configmap.yaml`)

Nếu bạn thay đổi cấu hình lọc log, thay đổi token ghi Loki của Grafana Cloud, thêm/bớt nhãn (labels), hoặc thay đổi định dạng log đầu ra:

1. Sửa cấu hình trong tệp [fluent-bit-configmap.yaml](file:///home/phucvu/Project/react-portfolio/system-monitor/k8s/fluent-bit-configmap.yaml).
2. Chạy lệnh deploy để cập nhật ConfigMap trên cụm K8s:
   ```bash
   ./deploy_monitor.sh
   ```
3. **⚠️ Bước bắt buộc:** Vì ConfigMap được mount trực tiếp vào container sidecar `fluent-bit` dưới dạng tệp tin cấu hình, việc cập nhật ConfigMap trên K8s **sẽ không làm Fluent Bit tự động cập nhật**. Bạn phải thực hiện khởi động lại (restart) Pod theo cách thủ công bằng lệnh sau để Fluent Bit đọc lại cấu hình mới:
   ```bash
   ssh -o StrictHostKeyChecking=no -i ssh-file/ssh-key-2026-06-27.key ubuntu@161.118.195.32 "export KUBECONFIG=~/.kube/config && kubectl rollout restart deployment/monitor-backend"
   ```

---

## 🔒 5. Quản Lý Thông Tin Nhạy Cảm (Secrets Management)

Tuyệt đối **không lưu trữ** thông tin bảo mật (token, password) trực tiếp dưới dạng văn bản thuần (plain-text) trong các file YAML hoặc code Python được đẩy lên Git. Các thông tin này đã được chuyển vào Kubernetes Secret `monitor-secrets` trên cụm K3s:
*   `admin-token`: Token dùng để xác thực quyền quản trị của React Dashboard (ví dụ: `2044`).
*   `loki-user`: Tài khoản ghi log của Grafana Cloud Loki (`1685575`).
*   `loki-passwd`: API Key/Token ghi log của Grafana Cloud Loki.

### Thay đổi token/mật khẩu bảo mật:
Nếu bạn cần thay đổi mật khẩu hoặc key Grafana Cloud mới, hãy chạy lệnh trực tiếp trên máy ảo VM để cập nhật Secret (không lưu vào file):
```bash
ssh -o StrictHostKeyChecking=no -i ssh-file/ssh-key-2026-06-27.key ubuntu@161.118.195.32 "export KUBECONFIG=~/.kube/config && kubectl create secret generic monitor-secrets --from-literal=admin-token=<TOKEN_MOI> --from-literal=loki-user=<USER_MOI> --from-literal=loki-passwd=<PASS_MOI> --dry-run=client -o yaml | kubectl apply -f -"
```
Sau khi cập nhật Secret, hãy thực hiện rollout restart pod để nhận giá trị mới:
```bash
ssh -o StrictHostKeyChecking=no -i ssh-file/ssh-key-2026-06-27.key ubuntu@161.118.195.32 "export KUBECONFIG=~/.kube/config && kubectl rollout restart deployment/monitor-backend"
```

---

## 💻 4. Khi thay đổi Giao diện React Frontend (`src/...`)

Khi bạn chỉnh sửa hoặc nâng cấp giao diện Dashboard hiển thị thông số trên Web:

### Lập trình ở chế độ Development (Local):
1. Chạy dev server tại máy local của bạn:
   ```bash
   cd /home/phucvu/Project/react-portfolio
   npm run dev
   ```
2. Mở trình duyệt truy cập `http://localhost:5173/monitor` để xem giao diện trực quan. Nhờ tính năng Hot Module Replacement (HMR) của Vite, mọi thay đổi trong mã nguồn component của bạn sẽ được hiển thị ngay lập tức mà không cần F5.

### Triển khai ra môi trường Production:
1. Khi đã ưng ý với giao diện mới, thực hiện build bundle production để tối ưu dung lượng:
   ```bash
   npm run build
   ```
2. Đẩy (deploy) thư mục sản phẩm `dist` lên Cloudflare Pages hoặc hosting provider của bạn để cập nhật giao diện web chính thức.

---

## 🔍 Kiểm tra trạng thái hệ thống sau khi redeploy

Mỗi khi tiến hành redeploy hoặc restart, bạn nên kiểm tra xem các pod có khởi động thành công và log có chạy bình thường hay không:

```bash
# Kết nối SSH vào VM và kiểm tra trạng thái Pod
ssh -o StrictHostKeyChecking=no -i ssh-file/ssh-key-2026-06-27.key ubuntu@161.118.195.32 "export KUBECONFIG=~/.kube/config && kubectl get pods"

# Kiểm tra log sidecar Fluent Bit xem có lỗi đẩy log lên Loki hay không
ssh -o StrictHostKeyChecking=no -i ssh-file/ssh-key-2026-06-27.key ubuntu@161.118.195.32 "export KUBECONFIG=~/.kube/config && kubectl logs deployment/monitor-backend -c fluent-bit --tail=50"
```
