# Backend Kubernetes Guide

This folder contains the first Kubernetes setup for the backend only.

For the full project flow with frontend + backend, use [k8s/README.md](/C:/Users/Galal/Documents/mat%20diff/GP/Smart-Inventory-Management-System-main/Website/Smart-Inventory-Management-System-main/Website/Inventory-Management-System-MERN-Stack-main/k8s/README.md).

## 1. What we are deploying

- `Namespace`: keeps the project resources grouped together
- `ConfigMap`: stores normal environment values like `PORT`
- `Secret`: stores sensitive values like `MONGODB_URI` and `SECRET_KEY`
- `Deployment`: runs the backend container and keeps it alive
- `Service`: gives the backend a stable internal network name inside Kubernetes

## 2. Before you deploy

The backend needs these environment values:

- `PORT`
- `NODE_ENV`
- `MONGODB_URI`
- `SECRET_KEY`

You can see the same values in [Backend/.env.example](/C:/Users/Galal/Documents/mat%20diff/GP/Smart-Inventory-Management-System-main/Website/Smart-Inventory-Management-System-main/Website/Inventory-Management-System-MERN-Stack-main/Backend/.env.example).

## 3. Build and push the backend image

From the project root, run:

```powershell
docker build -t <your-dockerhub-username>/ims-backend:latest ./Backend
docker push <your-dockerhub-username>/ims-backend:latest
```

Then update the `image` line in [k8s/backend/deployment.yaml](/C:/Users/Galal/Documents/mat%20diff/GP/Smart-Inventory-Management-System-main/Website/Smart-Inventory-Management-System-main/Website/Inventory-Management-System-MERN-Stack-main/k8s/backend/deployment.yaml) so it matches your Docker Hub username.

## 4. Edit the secret values

Open [k8s/backend/secret.yaml](/C:/Users/Galal/Documents/mat%20diff/GP/Smart-Inventory-Management-System-main/Website/Smart-Inventory-Management-System-main/Website/Inventory-Management-System-MERN-Stack-main/k8s/backend/secret.yaml) and replace the placeholder values with your real MongoDB URI and JWT secret.

## 5. Apply the manifests

Run these commands in order:

```powershell
kubectl apply -f k8s/backend/namespace.yaml
kubectl apply -f k8s/backend/configmap.yaml
kubectl apply -f k8s/backend/secret.yaml
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/service.yaml
```

## 6. Verify that the backend is running

```powershell
kubectl get all -n ims
kubectl get pods -n ims -w
kubectl logs deployment/ims-backend -n ims
```

If the pod starts correctly, you should see the app listening on port `3000` and a MongoDB connection message in the logs.

## 7. Test the backend from your machine

Because the service is `ClusterIP`, use port-forwarding for now:

```powershell
kubectl port-forward svc/ims-backend-service 3000:3000 -n ims
```

Then open:

- `http://localhost:3000/`

You should get the backend response: `working nicely`

## 8. What to learn from each file

- `namespace.yaml`: basic isolation between projects
- `configmap.yaml`: non-secret configuration
- `secret.yaml`: sensitive configuration
- `deployment.yaml`: pods, replicas, probes, resources
- `service.yaml`: stable networking inside the cluster

## 9. Important note

This setup deploys only the backend application. It does **not** deploy MongoDB inside Kubernetes yet. `MONGODB_URI` should point to a running MongoDB instance, such as MongoDB Atlas or another MongoDB server.
