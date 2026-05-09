# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps with yarn (matches the local lockfile in the repo)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the static SPA. VITE_API_URL is baked at build time and is relative
# so the SPA will hit /api/v1 on whatever host serves it (nginx proxies it).
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN yarn build

# ---------- Runtime stage ----------
FROM nginx:alpine AS runtime

# Custom nginx: SPA fallback + /api reverse proxy to the backend service
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
