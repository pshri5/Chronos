# ---------- Build stage ----------
FROM node:20-alpine AS builder

# Enable pnpm via corepack (matches "packageManager" in package.json)
RUN corepack enable

WORKDIR /app

# Install deps (cache-friendly: copy lockfiles first)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy source and compile TypeScript
COPY tsconfig.json ./
COPY src ./src
RUN pnpm exec tsc

# Prune devDependencies for the runtime image
RUN pnpm prune --prod

# ---------- Runtime stage ----------
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Copy only what we need to run
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Drop privileges
USER node

EXPOSE 8001
CMD ["node", "dist/index.js"]
