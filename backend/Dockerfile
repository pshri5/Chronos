# ---------- Build stage ----------
FROM node:20-alpine AS builder

# Enable corepack for pnpm
RUN corepack enable

WORKDIR /app

# Copy lockfile and package.json to install dependencies first
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Compile TypeScript to JavaScript
RUN pnpm exec tsc

# Remove development dependencies to keep the final image small
RUN pnpm prune --prod

# ---------- Runtime stage ----------
FROM node:20-alpine AS runtime

# Set environment to production
ENV NODE_ENV=production
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Expose the internal backend port
EXPOSE 8000

# Run the app as a non-root user for security
USER node

CMD ["node", "dist/index.js"]
