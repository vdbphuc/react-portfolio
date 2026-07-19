#!/bin/bash
set -e

# Path to the SSH private key (nested 2 levels up)
KEY_PATH="../../ssh-file/ssh-key-2026-06-27.key"
VM_USER="ubuntu"
VM_IP="161.118.195.32"

echo "=== Uploading system-monitor to remote VM ==="
# Upload the parent folder system-monitor
scp -o StrictHostKeyChecking=no -i "$KEY_PATH" -r ../../react-portfolio/system-monitor "$VM_USER@$VM_IP:~/"

echo "=== Building and deploying on remote VM ==="
ssh -o StrictHostKeyChecking=no -i "$KEY_PATH" "$VM_USER@$VM_IP" "bash -s" << 'EOF'
set -e

export KUBECONFIG=~/.kube/config

echo "[1/3] Building backend Docker image..."
cd ~/system-monitor/backend
docker build -t monitor-backend:latest .

echo "[2/3] Importing image into K3s containerd store..."
docker save monitor-backend:latest | sudo k3s ctr images import -

echo "[3/3] Deploying K8s manifests..."
cd ~/system-monitor/k8s
kubectl apply -f .

echo "Waiting for pods to roll out..."
kubectl rollout status deployment/monitor-backend --timeout=120s
kubectl rollout status deployment/redis --timeout=120s

echo "Listing status..."
kubectl get pods,ingress,svc -l app=monitor-backend || kubectl get pods,ingress,svc
EOF

echo "=== Deployment Completed! ==="
