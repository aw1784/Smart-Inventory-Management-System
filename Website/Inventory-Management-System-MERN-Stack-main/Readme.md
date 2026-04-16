# Inventory Management System (IMS)

An Inventory Management System built with Vite, React.js for the frontend, and Node.js, Express, and MongoDB for the backend.

## Table of Contents

- [Features](#features)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Option 1: Pull from Docker Hub (Fastest)](#option-1-pull-from-docker-hub-fastest)
  - [Option 2: Run with Docker Compose (Recommended)](#option-2-run-with-docker-compose-recommended)
  - [Option 3: Deploy with Kubernetes](#option-3-deploy-with-kubernetes)
  - [Option 4: Run Manually](#option-4-run-manually)
- [CI/CD Pipeline (Jenkins)](#cicd-pipeline-jenkins)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User authentication and authorization
- Manage products, companies, locations, and brands
- Track product history
- Dashboard with analytics
- Responsive design with Tailwind CSS

---

## Folder Structure

```plaintext
Inventory-Management-System-MERN-Stack-main/
├── Backend
│   ├── Dockerfile
│   ├── README.md
│   ├── app.js
│   ├── .env
│   ├── config.npmrc
│   ├── controllers
│   │   ├── product_controller.js
│   │   └── user_controllers.js
│   ├── db
│   │   └── user_db.js
│   ├── middlewares
│   │   └── user_auth.js
│   ├── models
│   │   ├── company_model.js
│   │   ├── history_model.js
│   │   ├── locations_models.js
│   │   ├── product_model.js
│   │   └── user_model.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── analyticsRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── historyRoutes.js
│   │   ├── locationRoutes.js
│   │   ├── productRoutes.js
│   │   └── user_routes.js
│   └── utils
│       └── user_utils.js
├── Frontend
│   ├── README.md
│   ├── Dockerfile
│   ├── dockerfile.dev
│   ├── .env
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   └── vite.svg
│   ├── src
│   │   ├── App.jsx
│   │   ├── assets
│   │   ├── components
│   │   │   ├── HeaderBar.jsx
│   │   │   ├── LoadingIndicator.jsx
│   │   │   ├── LogoutButton.jsx
│   │   │   ├── PopUpComponenet.jsx
│   │   │   ├── ShowErrorMessage.jsx
│   │   │   ├── ShowSuccessMesasge.jsx
│   │   │   ├── SideNavbar.jsx
│   │   │   └── WarrantyExpiringProductsTableComponent.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── router.jsx
│   │   └── screens
│   │       ├── InventoryFormScreen.jsx
│   │       ├── brands/
│   │       ├── dashboard/
│   │       ├── locations/
│   │       ├── login/
│   │       ├── product/
│   │       └── users/
│   ├── tailwind.config.js
│   └── vite.config.js
├── k8s
│   ├── K8s_run.sh
│   ├── K8s_Stop.sh
│   ├── README.md
│   ├── backend
│   │   ├── configmap.yaml
│   │   ├── deployment.yaml
│   │   ├── namespace.yaml
│   │   ├── secret.yaml
│   │   └── service.yaml
│   ├── frontend
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   ├── ingress.yaml
│   ├── port-forward-backend.sh
│   └── port-forward-frontend.sh
├── Jenkinsfile
├── Readme.md
└── docker-compose.yml
```

---

## Prerequisites

### For Docker (Recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- A [MongoDB Atlas](https://mongodb.com/atlas) account (free tier)

### For Kubernetes
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed
- A running Kubernetes cluster (e.g. [Minikube](https://minikube.sigs.k8s.io/docs/start/) or Docker Desktop with Kubernetes enabled)
- A [MongoDB Atlas](https://mongodb.com/atlas) account (free tier)

### For CI/CD Pipeline
- Jenkins server with Docker installed
- Docker Hub account
- GitHub webhook configured

### For Manual Setup
- Node.js
- npm or yarn
- MongoDB

---

## Installation

### Environment Setup (do this ONCE, applies to all options)

**1. Set up MongoDB Atlas:**
- Visit [MongoDB Atlas](https://mongodb.com/atlas) and create a free account
- Create a new project and deploy a free M0 cluster
- In **Database Access**, add a database user with a simple password (letters and numbers only)
- In **Network Access**, add IP address `0.0.0.0/0` to allow access from anywhere
- In **Clusters**, click **Connect → Connect your application** and copy the connection string

**2. Create environment files:**

`Backend/.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ims?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
SECRET_KEY=your_secret_key_here
NODE_ENV=development
ORIGIN=http://localhost:5173
```

`Frontend/.env`:
```env
VITE_SERVER=https://inventory-management-backend-hsaf.onrender.com
VITE_MODE=DEV
VITE_LOCAL=http://localhost:3000
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `SECRET_KEY` | Secret key for JWT tokens — keep it secure |
| `VITE_MODE=DEV` | Uses `VITE_LOCAL` → your local backend |
| `VITE_MODE=PROD` | Uses `VITE_SERVER` → hosted Render backend |

> **Security Note:** Never commit `.env` files to version control. Add them to `.gitignore`.

---

### Option 1: Pull from Docker Hub (Fastest)

Pre-built images are available on Docker Hub and are automatically updated by the Jenkins CI/CD pipeline on every push.

| Image | Docker Hub |
|-------|-----------|
| Frontend | [`ahmedwalid1410/ims-frontend`](https://hub.docker.com/r/ahmedwalid1410/ims-frontend) |
| Backend | [`ahmedwalid1410/ims-backend`](https://hub.docker.com/r/ahmedwalid1410/ims-backend) |

**Pull the images:**
```bash
docker pull ahmedwalid1410/ims-frontend:latest
docker pull ahmedwalid1410/ims-backend:latest
```

**Run using Docker Compose with pre-built images:**

Create a `docker-compose.prod.yml`:
```yaml
services:
  backend:
    image: ahmedwalid1410/ims-backend:latest
    ports:
      - "3000:3000"
    env_file:
      - ./Backend/.env

  frontend:
    image: ahmedwalid1410/ims-frontend:latest
    ports:
      - "5173:5173"
    env_file:
      - ./Frontend/.env
    depends_on:
      - backend
```

Then run:
```bash
docker compose -f docker-compose.prod.yml up -d
```

---

### Option 2: Run with Docker Compose (Recommended)

This builds and runs the entire application from source with a single command.

**1. Clone the repository:**
```bash
git clone https://github.com/aw1784/Smart-Inventory-Management-System.git
cd Smart-Inventory-Management-System/Website/Inventory-Management-System-MERN-Stack-main
```

**2. Build and run:**
```bash
docker compose up --build
```

**3. Open the app:**
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000](http://localhost:3000)

**Useful Docker commands:**
```bash
# Run in background
docker compose up --build -d

# View logs
docker compose logs -f

# View logs for one service
docker compose logs -f backend
docker compose logs -f frontend

# Stop everything
docker compose down

# Rebuild after code changes
docker compose up --build
```

---

### Option 3: Deploy with Kubernetes

This deploys the application on a Kubernetes cluster using pre-built production images from Docker Hub.

**Docker Hub images used:**

| Image | Docker Hub |
|-------|-----------|
| Frontend | [`ahmedwalid1410/ims-frontend-k8s`](https://hub.docker.com/r/ahmedwalid1410/ims-frontend-k8s) |
| Backend | [`ahmedwalid1410/ims-backend-k8s`](https://hub.docker.com/r/ahmedwalid1410/ims-backend-k8s) |

> These images are built by the Jenkins CI/CD pipeline and are production-ready (frontend served by Nginx on port 80).

**1. Clone the repository:**
```bash
git clone https://github.com/aw1784/Smart-Inventory-Management-System.git
cd Smart-Inventory-Management-System/Website/Inventory-Management-System-MERN-Stack-main
```

**2. Update the secret with your MongoDB credentials:**

Edit `k8s/backend/secret.yaml` and replace the placeholder values:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ims-backend-secret
  namespace: ims
type: Opaque
stringData:
  MONGODB_URI: "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ims?retryWrites=true&w=majority"
  SECRET_KEY: "your-long-random-secret-key"
```

**3. Deploy everything:**
```bash
bash k8s/K8s_run.sh
```

This script applies all manifests in order:
```
namespace → configmap → secret → backend deployment → backend service → frontend deployment → frontend service
```

**4. Verify pods are running:**
```bash
kubectl get all -n ims
```

You should see:
```
pod/ims-backend-xxx    1/1   Running   ✅
pod/ims-frontend-xxx   1/1   Running   ✅
```

**5. Access the app via port-forwarding:**

Open **two separate terminals:**

Terminal 1 — Backend:
```bash
bash k8s/port-forward-backend.sh
```

Terminal 2 — Frontend:
```bash
bash k8s/port-forward-frontend.sh
```

Then open:
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000](http://localhost:3000)

**6. Stop the deployment:**
```bash
bash k8s/K8s_Stop.sh
```

**Useful kubectl commands:**
```bash
# Watch pods starting up
kubectl get pods -n ims -w

# View backend logs
kubectl logs deployment/ims-backend -n ims

# View frontend logs
kubectl logs deployment/ims-frontend -n ims

# Describe a pod for debugging
kubectl describe pod <pod-name> -n ims

# Delete and redeploy everything
bash k8s/K8s_Stop.sh
bash k8s/K8s_run.sh
```

---

### Option 4: Run Manually

**1. Clone the repository:**
```bash
git clone https://github.com/aw1784/Smart-Inventory-Management-System.git
cd Smart-Inventory-Management-System/Website/Inventory-Management-System-MERN-Stack-main
```

**2. Backend setup:**
```bash
cd Backend
npm install
npm start
```

**3. Frontend setup (new terminal):**
```bash
cd Frontend
npm install
npm run dev
```

---

## CI/CD Pipeline (Jenkins)

Every push to any branch automatically triggers the Jenkins pipeline which builds and pushes updated Docker images to Docker Hub.

### Pipeline Stages

```
Checkout → Build Images (parallel) → Push to Docker Hub
                ↓               ↓
          ims-backend     ims-frontend
```

| Stage | Description |
|-------|-------------|
| **Checkout** | Pulls latest code from GitHub |
| **Build Backend Image** | Builds `ahmedwalid1410/ims-backend` tagged with build number and `latest` |
| **Build Frontend Image** | Builds `ahmedwalid1410/ims-frontend` tagged with build number and `latest` |
| **Push to Docker Hub** | Pushes all tags to Docker Hub |

### Docker Hub Images

| Image | Tags | Link |
|-------|------|------|
| `ahmedwalid1410/ims-backend` | `latest`, `<build-number>` | [View on Docker Hub](https://hub.docker.com/r/ahmedwalid1410/ims-backend) |
| `ahmedwalid1410/ims-frontend` | `latest`, `<build-number>` | [View on Docker Hub](https://hub.docker.com/r/ahmedwalid1410/ims-frontend) |
| `ahmedwalid1410/ims-backend-k8s` | `latest`, `<build-number>` | [View on Docker Hub](https://hub.docker.com/r/ahmedwalid1410/ims-backend-k8s) |
| `ahmedwalid1410/ims-frontend-k8s` | `latest`, `<build-number>` | [View on Docker Hub](https://hub.docker.com/r/ahmedwalid1410/ims-frontend-k8s) |

### Jenkins Setup Requirements

**1. Add Docker Hub credentials in Jenkins:**
- Manage Jenkins → Credentials → Global → Add Credentials
- Kind: `Username with password`
- ID: `dockerhub-credentials`
- Username: your Docker Hub username
- Password: your Docker Hub password or access token

**2. Required Jenkins plugins:**
- Docker Pipeline
- GitHub Integration
- Pipeline

**3. Configure the pipeline job:**
- New Item → Pipeline
- Pipeline → Pipeline script from SCM
- SCM: Git → `https://github.com/aw1784/Smart-Inventory-Management-System.git`
- Script Path: `Website/Inventory-Management-System-MERN-Stack-main/Jenkinsfile`
- Branch Specifier: `**`

**4. GitHub webhook** (for automatic triggers):
- GitHub repo → Settings → Webhooks → Add webhook
- Payload URL: `http://YOUR_JENKINS_IP:8080/github-webhook/`
- Content type: `application/json`
- Trigger: `Just the push event`

---

## Environment Variables

### Backend `.env`
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
SECRET_KEY=your_secret_key
NODE_ENV=development
ORIGIN=http://localhost:5173
```

### Frontend `.env`
```env
VITE_SERVER=https://inventory-management-backend-hsaf.onrender.com
VITE_MODE=DEV
VITE_LOCAL=http://localhost:3000
```

| `VITE_MODE` value | Backend used |
|---|---|
| `DEV` | `VITE_LOCAL` → your local backend container |
| `PROD` | `VITE_SERVER` → hosted Render backend |

---

## API Endpoints

### User Routes
- **POST** `/api/v1/users/signup` - Sign up a new user
- **POST** `/api/v1/users/login` - Log in a user
- **GET** `/api/v1/users/logout` - Log out a user

### Product Routes
- **GET** `/api/v1/products` - Get all products
- **POST** `/api/v1/products` - Add a new product
- **PUT** `/api/v1/products/:id` - Update a product
- **DELETE** `/api/v1/products/:id` - Delete a product

### History Routes
- **GET** `/api/v1/history/:productId` - Get product history

### Company Routes
- **GET** `/api/v1/companies` - Get all companies
- **POST** `/api/v1/companies` - Add a new company

### Location Routes
- **GET** `/api/v1/locations` - Get all locations
- **POST** `/api/v1/locations` - Add a new location

### Analytics Routes
- **GET** `/api/v1/analytics` - Get analytics data

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.