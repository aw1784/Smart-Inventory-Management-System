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
  - [Option 3: Run Manually](#option-3-run-manually)
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
├── Jenkinsfile
├── Readme.md
└── docker-compose.yml
```

---

## Prerequisites

### For Docker (Recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
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

1. **Set up MongoDB Atlas:**
   - Visit [MongoDB Atlas](https://mongodb.com/atlas) and create a free account.
   - Create a new project and deploy a free M0 cluster.
   - In **Database Access**, add a database user with a strong password (include letters, numbers, and symbols for security).
   - In **Network Access**, add IP address `0.0.0.0/0` to allow access from anywhere (for development only; restrict in production).
   - In **Clusters**, click **Connect**, select **Connect your application**, and copy the connection string. Replace `<username>` and `<password>` with your database user credentials.

2. **Create environment files:**

   Create the following files in their respective directories:

   `Backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ims?retryWrites=true&w=majority&appName=Cluster0
   PORT=3000
   SECRET_KEY=your_secret_key_here  # Generate a strong, random secret key
   NODE_ENV=development
   ORIGIN=http://localhost:5173
   ```

   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `PORT`: Port for the backend server.
   - `SECRET_KEY`: A secret key for JWT tokens; keep it secure and unique.
   - `NODE_ENV`: Environment mode (development/production).
   - `ORIGIN`: Allowed origin for CORS (frontend URL).

   `Frontend/.env`:
   ```env
   VITE_SERVER=https://inventory-management-backend-hsaf.onrender.com
   VITE_MODE=DEV
   VITE_LOCAL=http://localhost:3000
   ```

   - `VITE_SERVER`: URL of the production backend.
   - `VITE_MODE`: Set to `DEV` for local development (uses `VITE_LOCAL`), or `PROD` for production (uses `VITE_SERVER`).
   - `VITE_LOCAL`: URL of the local backend.

   > **Security Note:** Never commit `.env` files to version control. Add them to `.gitignore`. Use strong, unique secrets in production.


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

**5. Open the app:**
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

### Option 3: Run Manually

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