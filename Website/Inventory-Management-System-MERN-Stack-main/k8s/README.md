# Full Stack Kubernetes Guide

This guide shows how to run the whole project from zero.

## 1. Architecture

- `Frontend`: React + Vite
- `Backend`: Node + Express
- `Database`: MongoDB Atlas or another external MongoDB server

For local Kubernetes learning:

- the backend runs with `NODE_ENV=development`
- the frontend is served by Nginx
- Nginx proxies `/api` to the backend service inside the cluster

This makes the browser use one origin only, which keeps authentication simpler.

## 2. Create local environment files

Create [Backend/.env.example](/C:/Users/Galal/Documents/mat%20diff/GP/Smart-Inventory-Management-System-main/Website/Smart-Inventory-Management-System-main/Website/Inventory-Management-System-MERN-Stack-main/Backend/.env.example) as `Backend/.env` with your real values.

Create [Frontend/.env.example](/C:/Users/Galal/Documents/mat%20diff/GP/Smart-Inventory-Management-System-main/Website/Smart-Inventory-Management-System-main/Website/Inventory-Management-System-MERN-Stack-main/Frontend/.env.example) as `Frontend/.env`.

Recommended local values:

`Backend/.env`

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster-url/ims
SECRET_KEY=replace-with-a-long-random-secret
```

`Frontend/.env`

```env
VITE_MODE=DEV
VITE_LOCAL=http://localhost:3000
VITE_SERVER=
```

## 3. Fastest way to run the whole app locally with Docker

From the project root:

```bash
docker compose up --build
```

Open:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

Useful commands:

```bash
docker compose logs -f
docker compose down
docker compose up --build -d
```

## 4. Run the whole app manually without Docker

Backend:

```bash
cd Backend
npm install
npm start
```

Frontend in another terminal:

```bash
cd Frontend
npm install
npm run dev
```

## 5. Build images for Kubernetes

Default manifests in this repo are set up for local Minikube images:

```bash
minikube image build -t ims-backend:latest ./Backend
minikube image build -t ims-frontend:latest ./Frontend
```

The deployments use `imagePullPolicy: IfNotPresent`, so Kubernetes will use those locally built images.

If you want to use Docker Hub instead, build and push your own tags, then update the `image` lines in the deployment manifests.

Backend:

```bash
docker build -t <your-dockerhub-username>/ims-backend:latest ./Backend
docker push <your-dockerhub-username>/ims-backend:latest
```

Frontend:

```bash
docker build -t <your-dockerhub-username>/ims-frontend:latest ./Frontend
docker push <your-dockerhub-username>/ims-frontend:latest
```

Then update these image lines:

- [k8s/backend/deployment.yaml](/C:/Users/Galal/Documents/mat%20diff/GP/Smart-Inventory-Management-System-main/Website/Smart-Inventory-Management-System-main/Website/Inventory-Management-System-MERN-Stack-main/k8s/backend/deployment.yaml)
- [k8s/frontend/deployment.yaml](/C:/Users/Galal/Documents/mat%20diff/GP/Smart-Inventory-Management-System-main/Website/Smart-Inventory-Management-System-main/Website/Inventory-Management-System-MERN-Stack-main/k8s/frontend/deployment.yaml)

## 6. Prepare Kubernetes secret values

Edit [k8s/backend/secret.yaml](/C:/Users/Galal/Documents/mat%20diff/GP/Smart-Inventory-Management-System-main/Website/Smart-Inventory-Management-System-main/Website/Inventory-Management-System-MERN-Stack-main/k8s/backend/secret.yaml) and replace the placeholder values.

## 7. Check that Kubernetes is ready

Run:

```bash
kubectl get nodes
kubectl config current-context
```

If these commands fail, your cluster is not running yet.

## 8. Deploy the whole app to Kubernetes

Apply in this order:

```bash
kubectl apply -f k8s/backend/namespace.yaml
kubectl apply -f k8s/backend/configmap.yaml
kubectl apply -f k8s/backend/secret.yaml
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/service.yaml
kubectl apply -f k8s/frontend/deployment.yaml
kubectl apply -f k8s/frontend/service.yaml
```

## 9. Easiest way to open the app from Kubernetes

Port-forward the frontend service:

```bash
kubectl port-forward svc/ims-frontend-service 8080:80 -n ims
```

Then open:

- `http://localhost:8080`

The frontend will call `/api`, and Nginx inside the frontend pod will forward that traffic to the backend service.

## 10. Optional: Use Ingress

If your cluster has an Nginx ingress controller, also apply:

```bash
kubectl apply -f k8s/ingress.yaml
```

Then point `ims.local` to your ingress IP in `/etc/hosts`.

Example:

```text
127.0.0.1 ims.local
```

Or use your local cluster IP if needed.

Then open:

- `http://ims.local`

## 11. Verify your deployment

```bash
kubectl get all -n ims
kubectl get pods -n ims
kubectl logs deployment/ims-backend -n ims
kubectl logs deployment/ims-frontend -n ims
```

## 12. What each Kubernetes file teaches you

- `namespace.yaml`: groups your app resources
- `configmap.yaml`: normal env variables
- `secret.yaml`: sensitive env variables
- `backend/deployment.yaml`: backend pod definition
- `backend/service.yaml`: stable backend networking
- `frontend/deployment.yaml`: frontend pod definition
- `frontend/service.yaml`: stable frontend networking
- `ingress.yaml`: one external entry point for both frontend and backend

## 13. Important learning note

This project does not deploy MongoDB inside Kubernetes in this setup. Your app still needs an external MongoDB URI.
