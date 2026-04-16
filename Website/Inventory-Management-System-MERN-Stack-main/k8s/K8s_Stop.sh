kubectl delete -f k8s/backend/namespace.yaml
kubectl delete -f k8s/backend/configmap.yaml
kubectl delete -f k8s/backend/secret.yaml
kubectl delete -f k8s/backend/deployment.yaml
kubectl delete -f k8s/backend/service.yaml
kubectl delete -f k8s/frontend/deployment.yaml
kubectl delete -f k8s/frontend/service.yaml