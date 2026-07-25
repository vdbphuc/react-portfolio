# 🖥️ Remote Host & SSH Connection Workflow

Tài liệu hướng dẫn kết nối, quản lý bảo mật và thao tác từ xa trên máy chủ **Oracle Cloud Infrastructure (OCI) VM**.

---

## 🔑 1. Kết nối SSH tới Remote Host

Máy chủ được vận hành trên đám mây Oracle Cloud (Ubuntu Linux).

### Thao tác kết nối SSH từ Terminal:

```bash
# Kết nối trực tiếp sử dụng SSH Key
ssh -i ~/.ssh/id_rsa ubuntu@<ORACLE_CLOUD_IP>
```

### Cấu hình SSH Config (`~/.ssh/config`) khuyến nghị:

```text
Host oracle-server
    HostName <ORACLE_CLOUD_IP>
    User ubuntu
    IdentityFile ~/.ssh/id_rsa
    ServerAliveInterval 60
```
*Sau khi cấu hình, bạn chỉ cần gõ `ssh oracle-server` để truy cập ngay lập tức.*

---

## 🔒 2. Quản lý Secret Keys & Variable trong Remote Host

Tất cả cấu hình bảo mật (Admin Token, Token Telegram Bot, Gemini API Key) được lưu trữ trong Kubernetes Secret tên `monitor-secrets` trên máy chủ.

### Cập nhật Secret trên Remote Host:

```bash
# SSH vào máy chủ
ssh oracle-server

# Tạo/Cập nhật secret monitor-secrets trong namespace default
kubectl create secret generic monitor-secrets   --from-literal=admin-token="YOUR_ADMIN_TOKEN"   --from-literal=gemini-api-key="YOUR_GEMINI_KEY"   --from-literal=telegram-bot-token="YOUR_TELEGRAM_TOKEN"   --from-literal=telegram-chat-id="YOUR_TELEGRAM_CHAT_ID"   --dry-run=client -o yaml | kubectl apply -f -
```

---

## ⚙️ 3. Kiểm tra Logs & Uptime trực tiếp trên Máy chủ

```bash
# Xem danh sách Pods đang chạy
kubectl get pods -n default

# Xem logs của Backend System Monitor
kubectl logs -f deployment/monitor-backend -n default

# Kiểm tra trạng thái K3s Service
sudo systemctl status k3s
```
