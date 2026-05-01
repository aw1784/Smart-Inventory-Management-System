# Inventory Management MERN

A MERN-stack order and inventory management system built with a **microservices architecture**, fully containerized with Docker and ready for CI/CD via Jenkins.

## Architecture

```
                                ┌────────────┐
   Browser  ──►  Frontend ──►   │ API Gateway│  :4000
   (nginx :3000)                └─────┬──────┘
            ┌────────────┬────────────┼────────────┬────────────┐
            ▼            ▼            ▼            ▼            ▼
       auth-service  product-svc  order-svc   inventory-svc  statistics-svc
         :4001        :4002        :4003        :4004           :4005
            └────────────┴────────────┴────────────┴────────────┘
                                     │
                                     ▼
                                 MongoDB :27017
```

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, cors
- **Frontend:** React, Vite, Tailwind CSS, Redux Toolkit, React Router
- **Tests:** Jest + Supertest + mongodb-memory-server (no real Mongo required)
- **DevOps:** Docker, Docker Compose, Jenkins, DockerHub

---

## Ports Used

| Service              | Container Port | Host Port | Purpose                          |
|----------------------|---------------:|----------:|----------------------------------|
| frontend (nginx)     | 80             | **3000**  | Web UI                           |
| api-gateway          | 4000           | **4000**  | Single entry for all REST calls  |
| auth-service         | 4001           | 4001      | Sign-up / sign-in / roles        |
| product-service      | 4002           | 4002      | Product CRUD                     |
| order-service        | 4003           | 4003      | Order placement / status         |
| inventory-service    | 4004           | 4004      | Stock management                 |
| statistics-service   | 4005           | 4005      | Aggregated metrics               |
| mongo                | 27017          | 27017     | Shared database (one DB/service) |

> Open the app at **http://localhost:3000** after `docker compose up`.

---

## `.env` File — what it is and what goes in it

Docker Compose reads `inventory-management-MERN/.env` automatically. It must
exist next to `docker-compose.yml`. **Never commit it** — it is already in `.gitignore`.

Copy the template and fill it in:

```bash
cp .env.example .env
```

Required variables:

| Variable          | Used by                          | Notes                                          |
|-------------------|----------------------------------|------------------------------------------------|
| `JWT_SECRET`      | auth-service, api-gateway        | **Must be the same value in both.** Use a long random string. |
| `JWT_EXPIRES_IN`  | auth-service                     | Token lifetime, e.g. `1d`, `12h`, `7d`         |

The other variables in `.env.example` (ports, Mongo URIs, service URLs) are
already wired into `docker-compose.yml` with sensible defaults, so you only
*have* to set `JWT_SECRET` for Docker. The full list is there in case you run
the services outside Docker (`npm start`).

Generate a strong secret:
```bash
openssl rand -hex 64
```

---

## Run the whole app with Docker

```bash
cd inventory-management-MERN
cp .env.example .env       # then set JWT_SECRET to a strong value
docker compose build       # build all 7 images
docker compose up -d       # start mongo + 5 services + gateway + frontend
docker compose ps          # see status
docker compose logs -f     # follow logs
```

Then open **http://localhost:3000**.

Stop everything:
```bash
docker compose down            # keeps the mongo volume
docker compose down -v         # also wipes the database
```

---

## Run the tests with Docker

The test compose file builds each service with its `Dockerfile.test` (which
installs devDependencies) and runs the Jest suite. Tests use
`mongodb-memory-server`, so **no real Mongo container is needed**.

Run all suites in sequence:
```bash
docker compose -f docker-compose.test.yml build
docker compose -f docker-compose.test.yml run --rm auth-test
docker compose -f docker-compose.test.yml run --rm product-test
docker compose -f docker-compose.test.yml run --rm order-test
docker compose -f docker-compose.test.yml run --rm inventory-test
docker compose -f docker-compose.test.yml run --rm statistics-test
docker compose -f docker-compose.test.yml run --rm gateway-test
docker compose -f docker-compose.test.yml down --remove-orphans
```

Or run a single suite:
```bash
docker compose -f docker-compose.test.yml run --rm product-test
```

---

## Run without Docker (native Node)

### Prerequisites
- Node.js 18+
- A running MongoDB instance for `npm start`. Tests use in-memory Mongo.

```bash
# Backend
cd backend
npm install
npm run install:all
npm start                  # runs all 6 services concurrently

# Frontend (in another terminal)
cd frontend
npm install
npm start                  # http://localhost:3000
```

Per-service tests:
```bash
cd backend && npm test
# or just one
cd backend/auth-service && npm test
```

---

## Jenkins Pipeline (build → test → push to DockerHub)

A `Jenkinsfile` is included at the project root. It will:

1. Check out the repository.
2. Run every microservice's tests inside Docker (`docker-compose.test.yml`).
3. In parallel, build production images for all 7 services.
4. Push every image to DockerHub with both a `:${BUILD_NUMBER}` tag and `:latest`.

### One-time Jenkins setup

1. Install plugins: **Docker Pipeline**, **Pipeline**, **GitHub**.
2. In Jenkins → *Manage Credentials* add a **Username with password** credential
   with id **`dockerhub-credentials`** (your DockerHub username + access token).
3. Make sure the Jenkins agent has Docker installed and the Jenkins user is in
   the `docker` group.
4. Create a Pipeline job pointing to your Git repo; set *Script Path* to
   `inventory-management-MERN/Jenkinsfile`.
5. (Optional) Enable the **GitHub hook trigger for GITScm polling** — the
   `triggers { githubPush() }` block will then start builds on push.

Images pushed (replace `<your-dockerhub-user>`):

| Image                                              |
|----------------------------------------------------|
| `<your-dockerhub-user>/ims-auth-service`           |
| `<your-dockerhub-user>/ims-product-service`        |
| `<your-dockerhub-user>/ims-order-service`          |
| `<your-dockerhub-user>/ims-inventory-service`      |
| `<your-dockerhub-user>/ims-statistics-service`     |
| `<your-dockerhub-user>/ims-api-gateway`            |
| `<your-dockerhub-user>/ims-frontend`               |

---

## Database Models

| Model       | Service             | Key fields                                              |
|-------------|---------------------|---------------------------------------------------------|
| User        | auth-service        | name, email, password (hashed), role                    |
| Product     | product-service     | name, description, price, category, sku                 |
| Order       | order-service       | userId, items[], totalAmount, status                    |
| Inventory   | inventory-service   | productId, productName, quantity, location, threshold   |
| Statistics  | statistics-service  | metric, value, period, breakdown, recordedAt           |

---

## REST API (via the gateway at `http://localhost:4000`)

### Auth (`/api/auth`)
- `POST   /signup`              create account, returns `{ user, token }`
- `POST   /signin`              login, returns `{ user, token }`
- `GET    /me`                  current user (requires JWT)
- `GET    /roles`               list roles (admin)
- `GET    /users`               list users (admin)
- `PUT    /roles`               assign role (admin) — body `{ userId, role }`

### Products (`/api/products`)
- `POST   /` · `GET /` (`?search=&category=`) · `GET /:id` · `PUT /:id` · `DELETE /:id`

### Orders (`/api/orders`)
- `POST   /` — body `{ userId, items: [{productId,name,quantity,price}] }`
- `GET    /` · `GET /user/:userId` · `GET /:id` · `PATCH /:id/status`

### Inventory (`/api/inventory`)
- `POST   /` · `GET /` · `GET /product/:productId` · `PUT /:id`
- `PATCH  /:id/adjust` — body `{ delta: 5 }` · `DELETE /:id`

### Statistics (`/api/statistics`)
- `POST   /` · `GET /summary` · `GET /orders` · `GET /users` · `GET /inventory`

All routes (except `/api/auth/signup` and `/api/auth/signin`) require an
`Authorization: Bearer <jwt>` header.

---

## License
MIT
