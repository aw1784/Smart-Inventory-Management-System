# Inventory Management System (IMS)

An Inventory Management System built with Vite, React.js for the frontend, and Node.js, Express, and MongoDB for the backend.

## Table of Contents

- [Features](#features)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Option 1: Run with Docker Compose (Recommended)](#option-1-run-with-docker-compose-recommended)
  - [Option 2: Run Manually](#option-2-run-manually)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- Manage products, companies, locations, and brands
- Track product history
- Dashboard with analytics
- Responsive design with Tailwind CSS

## Folder Structure

```plaintext
Inventory-Management-System-MERN-Stack-main/
├── Backend
│   ├── Dockerfile
│   ├── README.md
│   ├── app.js
|   ├── .env
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
|   ├── .env
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
├── Readme.md
└── docker-compose.yml
```

## Prerequisites

### For Docker (Recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- A [MongoDB Atlas](https://mongodb.com/atlas) account (free tier)

### For Manual Setup
- Node.js
- npm or yarn
- MongoDB

## Installation

### Option 1: Run with Docker Compose (Recommended)

This runs the entire application (frontend + backend) with a single command.

**1. Clone the repository:**
```bash
git clone https://github.com/your-username/your-repo.git
cd Inventory-Management-System-MERN-Stack-main
```

**2. Set up MongoDB Atlas:**
- Create a free account at [mongodb.com/atlas](https://mongodb.com/atlas)
- Create a free M0 cluster
- Go to **Database Access** → add a user with a simple password (letters and numbers only)
- Go to **Network Access** → allow access from anywhere (`0.0.0.0/0`)
- Go to **Database → Connect → Drivers** → copy the connection string

**3. Create environment files:**

`Backend/.env`:
```env
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/ims?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
SECRET_KEY=your_secret_key
NODE_ENV=development
ORIGIN=http://localhost:5173
```

`Frontend/.env`:
```env
VITE_SERVER=https://inventory-management-backend-hsaf.onrender.com
VITE_MODE=DEV
VITE_LOCAL=http://localhost:3000
```

> **Note:** Set `VITE_MODE=DEV` to use your local backend. Set it to `PROD` to use the hosted Render backend instead.

**4. Build and run:**
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

### Option 2: Run Manually

**1. Clone the repository:**
```bash
git clone https://github.com/your-username/your-repo.git
cd Inventory-Management-System-MERN-Stack-main
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

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.