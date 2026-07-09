# How to use Build #33's Jenkins artifacts, step by step

These steps assume you've downloaded the files from the Jenkins build page
(click **view** → download, or SSH into the Jenkins server and copy them
from `/var/lib/jenkins/jobs/<job>/builds/33/archive/jenkins-artifacts/`).
You need Docker installed wherever you run these steps (your PC or any
server) — it does not need to be the Jenkins machine.

## 0. `build-manifest.txt` — read this first
```bash
cat build-manifest.txt
```
Shows the git commit, build number, and timestamp this whole set of files
came from. Keep it next to the other files so you always know exactly what
version you're running — check it before troubleshooting to confirm you're
looking at the build you think you are.

## 1. The 7 backend/frontend image files (`auth-33.tar.gz`, `product-33.tar.gz`, `order-33.tar.gz`, `inventory-33.tar.gz`, `statistics-33.tar.gz`, `gateway-33.tar.gz`, `frontend-33.tar.gz`)

### Step 1 — load each image into Docker
```bash
gunzip -c auth-33.tar.gz       | docker load
gunzip -c product-33.tar.gz    | docker load
gunzip -c order-33.tar.gz      | docker load
gunzip -c inventory-33.tar.gz  | docker load
gunzip -c statistics-33.tar.gz | docker load
gunzip -c gateway-33.tar.gz    | docker load
gunzip -c frontend-33.tar.gz   | docker load
```
Each `docker load` prints the image name it restored, e.g.
`Loaded image: ahmedwalid1410/ims-auth-service:33`. Run:
```bash
docker images | grep ims-
```
to confirm all 7 are now present locally.

### Step 2 — run them together as the full stack
Loading gets the images onto your machine; you still need Mongo + the
right environment variables + the right network so the services can reach
each other, exactly like `docker-compose.yml` already does. Easiest path:
copy the project's `docker-compose.yml`, but point each service's `image:`
at the loaded tag instead of `build:`. Example for one service:
```yaml
auth-service:
  image: ahmedwalid1410/ims-auth-service:33     # was: build: ./Backend/auth-service
  container_name: ims-auth
  environment:
    AUTH_SERVICE_PORT: 4001
    AUTH_MONGO_URI: mongodb://mongo:27017/inventory_auth
    JWT_SECRET: change-me-in-production
  depends_on:
    - mongo
  ports:
    - "4001:4001"
  networks:
    - ims-net
```
Repeat for the other 6 services (same ports as in the original
`docker-compose.yml`), keep the `mongo` service unchanged, then:
```bash
docker compose -f docker-compose.loaded.yml up -d
```
Open `http://localhost:3000` — this is build #33 running from the archived
artifacts, with no Docker Hub pull and no rebuild needed.

### When you'd actually do this
- **Rollback**: something in a newer build broke; load build #33's images
  and run them instead while you fix the issue.
- **Offline handoff**: give these 7 files to someone (client, teammate,
  air-gapped server) who can run the exact same build without Docker Hub
  access or a rebuild.
- **Debugging a specific build**: reproduce exactly what shipped at build
  #33 to compare against a bug report tied to that version.

## 2. `frontend-dist-33.tar.gz` — the compiled frontend only (no Docker)

### Step 1 — extract it
```bash
tar xzf frontend-dist-33.tar.gz
```
This creates a `frontend-dist/` folder containing the built React app —
plain HTML/CSS/JS files, the same output `Frontend/Dockerfile` produces
before it gets copied into Nginx.

### Step 2 — serve it with any static host
Pick whichever fits your case:
```bash
# Quick local preview
npx serve frontend-dist

# Or drop it straight into any Nginx docroot
cp -r frontend-dist/* /var/www/html/

# Or upload to any static hosting (S3 + CloudFront, Netlify, Vercel, etc.)
aws s3 sync frontend-dist/ s3://your-bucket-name/ --delete
```
Note: the app calls the API gateway via relative paths (see `nginx.conf`
in the original project) — if you serve these files without that Nginx
proxy config in front, you'll need your own reverse proxy or CORS setup so
`/api/...` calls still reach a running `api-gateway`.

### When you'd actually do this
- You only need the frontend deployed somewhere (a CDN, static host) that
  isn't running Docker at all.
- You want to preview a specific build's UI in isolation without spinning
  up the whole backend.

## Quick reference

| File | What it is | How to use it |
|---|---|---|
| `build-manifest.txt` | Metadata: commit, build #, timestamp | `cat` it to confirm what you're running |
| `<service>-33.tar.gz` (x7) | Full Docker image, exported | `docker load`, then run via compose |
| `frontend-dist-33.tar.gz` | Compiled static frontend | `tar xzf`, then serve with any static host |
