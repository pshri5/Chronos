# Chronos
A job scheduler — Express + TypeScript backend, React + Vite frontend, MongoDB.

---

## Run with Docker (recommended for demo / submission)

Everything (Mongo + backend + frontend + nginx reverse-proxy) is wrapped in a single Compose stack. One command, one URL.

### Prerequisites
- Docker 24+ and Docker Compose v2 (bundled with Docker Desktop).

### Start
```bash
cp .env.example .env          # edit JWT secrets if you want
docker compose up -d --build
```

Open http://localhost — frontend is served by nginx, and any request to `/api/*` is reverse-proxied to the backend container, so there is **no CORS to configure** and **only one port** to expose.

### Stop / clean up
```bash
docker compose down           # stop containers
docker compose down -v        # also delete the Mongo volume
```

### Custom port
```bash
HOST_PORT=8080 docker compose up -d --build
# now available on http://localhost:8080
```

### Service map
| Service    | Image base       | Port (host) | Role                              |
|------------|------------------|-------------|-----------------------------------|
| `frontend` | `nginx:alpine`   | `80`        | Static SPA + reverse proxy `/api` |
| `backend`  | `node:20-alpine` | (internal)  | Express API on `:8000`            |
| `mongo`    | `mongo:7`        | (internal)  | Database (named volume)           |

### Demo credentials
After `docker compose up`, register a new user from the UI, or:
```bash
curl -X POST http://localhost/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo","email":"demo@example.com","password":"Password123"}'
```

---

## Local development (without Docker)

### Backend
```bash
cd Backend
pnpm install
cp .env.sample .env           # set MONGODB_URI, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET
pnpm dev                      # tsx watch on http://localhost:8000
```

### Frontend
```bash
cd frontend
yarn install
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
yarn dev                      # http://localhost:3000
```
