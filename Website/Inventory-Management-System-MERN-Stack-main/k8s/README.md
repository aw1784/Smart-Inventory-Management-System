# Kubernetes Deployment — Inventory Management MERN

This folder contains the Kubernetes manifests to deploy the entire
microservices stack (MongoDB + 5 services + API gateway + frontend) to any
Kubernetes cluster: **Minikube**, **Kind**, **Docker Desktop**, **k3s**, **EKS**,
**GKE**, **AKS**, etc.

---

## 1. File overview

| File | What it creates |
|---|---|
| `00-namespace.yaml` | A dedicated `inventory-management` namespace |
| `01-secret.yaml` | A `Secret` holding `JWT_SECRET` and `JWT_EXPIRES_IN` |
| `02-mongo.yaml` | MongoDB Deployment + 1Gi PersistentVolumeClaim + ClusterIP Service |
| `03-auth-service.yaml` | Auth microservice (Deployment + ClusterIP Service on port 4001) |
| `04-product-service.yaml` | Product microservice (port 4002) |
| `05-order-service.yaml` | Order microservice (port 4003) — calls inventory-service |
| `06-inventory-service.yaml` | Inventory microservice (port 4004) |
| `07-statistics-service.yaml` | Statistics microservice (port 4005) — aggregates from all others |
| `08-api-gateway.yaml` | API Gateway (port 4000) — single entry point for `/api/*` |
| `09-frontend.yaml` | React/Nginx frontend exposed via **NodePort 30080** |
| `10-ingress.yaml` | Optional Ingress (host `ims.local`) for nginx-ingress users |

All Deployments/Services use the **same DNS names as `docker-compose.yml`**
(`mongo`, `auth-service`, `product-service`, …) so the application code needs
**no changes**.

---

## 2. Prerequisites

1. A working Kubernetes cluster:
   - **Minikube**: `minikube start --memory=4096 --cpus=2`
   - **Kind**: `kind create cluster --name ims`
   - **Docker Desktop**: enable Kubernetes in settings
2. `kubectl` installed and pointing at the cluster (`kubectl get nodes` works)
3. Docker images of every service pushed to a container registry
   (Docker Hub by default — see step 3)

---

## 3. Build & push the Docker images

The manifests reference images named:

```
<DOCKERHUB_USER>/ims-auth-service:latest
<DOCKERHUB_USER>/ims-product-service:latest
<DOCKERHUB_USER>/ims-order-service:latest
<DOCKERHUB_USER>/ims-inventory-service:latest
<DOCKERHUB_USER>/ims-statistics-service:latest
<DOCKERHUB_USER>/ims-api-gateway:latest
<DOCKERHUB_USER>/ims-frontend:latest
```

You have **two options** to make those images available to the cluster:

### Option A — Push to Docker Hub (any cluster)

```bash
# from the repo root
export DOCKERHUB_USER=yourdockerhubname
docker login

cd inventory-management-MERN

docker build -t $DOCKERHUB_USER/ims-auth-service:latest       backend/auth-service
docker build -t $DOCKERHUB_USER/ims-product-service:latest    backend/product-service
docker build -t $DOCKERHUB_USER/ims-order-service:latest      backend/order-service
docker build -t $DOCKERHUB_USER/ims-inventory-service:latest  backend/inventory-service
docker build -t $DOCKERHUB_USER/ims-statistics-service:latest backend/statistics-service
docker build -t $DOCKERHUB_USER/ims-api-gateway:latest        backend/api-gateway
docker build -t $DOCKERHUB_USER/ims-frontend:latest           frontend

for s in auth-service product-service order-service inventory-service statistics-service api-gateway frontend; do
  docker push $DOCKERHUB_USER/ims-$s:latest
done
```

(The Jenkinsfile in the repo root automates exactly this if you have Jenkins.)

### Option B — Build directly into Minikube (no registry needed)

```bash
eval $(minikube docker-env)        # use the cluster's Docker daemon
export DOCKERHUB_USER=local        # any string — it's just a prefix

cd inventory-management-MERN
# Same docker build commands as Option A, but the images stay inside Minikube.
```

In this case the image pull policy is already `IfNotPresent`, so Kubernetes
will use the local image and never try to pull from a registry.

---

## 4. Replace the image placeholder

Every service manifest uses the placeholder `DOCKERHUB_USER`. Substitute it
with your real Docker Hub username (or `local` if you used Option B):

```bash
cd inventory-management-MERN/k8s

# Linux / Git Bash
sed -i "s|DOCKERHUB_USER|$DOCKERHUB_USER|g" *.yaml

# macOS
sed -i '' "s|DOCKERHUB_USER|$DOCKERHUB_USER|g" *.yaml
```

---

## 5. Set a real JWT secret (recommended)

Edit `01-secret.yaml` and change `JWT_SECRET` to a long random string, **or**
create the secret imperatively:

```bash
kubectl create namespace inventory-management
kubectl -n inventory-management create secret generic ims-secrets \
  --from-literal=JWT_SECRET="$(openssl rand -hex 32)" \
  --from-literal=JWT_EXPIRES_IN=1d
```

If you create it imperatively, **skip** `01-secret.yaml` in step 6.

---

## 6. Deploy everything

Apply the manifests in order:

```bash
cd inventory-management-MERN/k8s
kubectl apply -f .
```

Watch them come up:

```bash
kubectl -n inventory-management get pods -w
```

You should see 8 pods reach `Running` status (mongo + 5 services + gateway + frontend).
Mongo takes the longest (≈ 30 s on first boot).

---

## 7. Access the application

### A) NodePort (works on every cluster)

```bash
kubectl -n inventory-management get svc frontend
```

Open **http://<node-ip>:30080** in your browser.

- **Minikube**: `minikube service -n inventory-management frontend --url`
- **Docker Desktop / Kind**: `http://localhost:30080`
- **Cloud cluster**: use any worker node's external IP

### B) Port-forward (easiest for dev)

```bash
kubectl -n inventory-management port-forward svc/frontend 3000:80
```

Then open **http://localhost:3000**.

### C) Ingress (production-style)

If you have an nginx-ingress controller installed:

```bash
kubectl apply -f 10-ingress.yaml
echo "127.0.0.1 ims.local" | sudo tee -a /etc/hosts   # or your ingress IP
```

Then open **http://ims.local**.

---

## 8. First admin user

The frontend signup form always creates `role: "user"`. To create your first
admin, port-forward the gateway and POST directly:

```bash
kubectl -n inventory-management port-forward svc/api-gateway 4000:4000

curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Ahmed","email":"ahmed@example.com","password":"ahmed123","role":"admin"}'
```

Or promote an existing user via the Mongo pod:

```bash
kubectl -n inventory-management exec -it deploy/mongo -- \
  mongosh inventory_auth --eval \
  'db.users.updateOne({email:"ahmed@example.com"},{$set:{role:"admin"}})'
```

---

## 9. Useful commands

```bash
# View logs of a service
kubectl -n inventory-management logs -f deploy/api-gateway
kubectl -n inventory-management logs -f deploy/auth-service

# Restart a service after pushing a new image
kubectl -n inventory-management rollout restart deploy/auth-service

# Scale a service horizontally
kubectl -n inventory-management scale deploy/product-service --replicas=3

# Open a shell in a pod
kubectl -n inventory-management exec -it deploy/order-service -- sh

# Inspect Mongo
kubectl -n inventory-management exec -it deploy/mongo -- mongosh

# Delete the whole stack
kubectl delete namespace inventory-management
```

---

## 10. How the pieces talk to each other

```
Browser ──▶ frontend (nginx, 80) ──▶ /api/* ──▶ api-gateway (4000)
                                                    │
                              ┌──────────┬──────────┼──────────┬──────────┐
                              ▼          ▼          ▼          ▼          ▼
                           auth (4001) product (4002) order (4003) inventory (4004) statistics (4005)
                              │           │           │            │              │
                              └───────────┴───────────┴────────────┴──────────────┘
                                                    │
                                                    ▼
                                              mongo (27017)
```

* The frontend container's nginx proxies all `/api/` requests to
  `api-gateway:4000` using its in-cluster DNS name.
* The api-gateway authenticates JWTs (except `/api/auth/signup` and
  `/api/auth/signin`) and proxies each `/api/<resource>` to the matching
  microservice.
* The order-service calls the inventory-service to decrement stock when an
  order is placed and to restore it when an order is cancelled.
* The statistics-service queries the other four services live on every
  request — there is no scheduled job.

---

## 11. Troubleshooting

| Symptom | Likely cause / Fix |
|---|---|
| `ImagePullBackOff` | Image not pushed, wrong tag, or `DOCKERHUB_USER` placeholder still in the manifest |
| Pods stuck in `Pending` | No PV available — Minikube/Kind have a default StorageClass; on bare clusters install one (e.g. `local-path-provisioner`) |
| `CrashLoopBackOff` on a service | `kubectl logs` it — usually means it can't reach Mongo. Verify `mongo` pod is `Running` and the Service exists |
| Frontend loads but `/api` returns 404 | Make sure `api-gateway` Service is named exactly `api-gateway` (the frontend's nginx.conf hard-codes that name) |
| Statistics page is empty for the **Users** card | The user stats endpoint requires an admin JWT — sign in as admin |
| Browser "Mixed Content" errors | If you expose via Ingress with TLS, also enable TLS for the API path |
