# ---------- Build stage ----------
FROM node:20-alpine AS builder

# Enable pnpm via corepack
RUN corepack enable

WORKDIR /app

# Install deps (cache-friendly)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm run build

# ---------- Runtime stage ----------
FROM nginx:alpine AS runtime

# Custom nginx: SPA fallback + /api reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
