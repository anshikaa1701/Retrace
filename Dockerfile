# =============================================================================
# STAGE 1: Build Stage (Compiles TypeScript & Vite Production Bundle)
# =============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install libc6-compat for native dependency compatibility if needed
RUN apk add --no-cache libc6-compat

# Leverage Docker layer caching for dependencies
COPY package.json package-lock.json ./

# Clean deterministic dependency installation
RUN npm ci

# Copy application source code (secrets excluded via .dockerignore)
COPY . .

# Compile TypeScript and build production assets into /app/dist
RUN npm run build

# =============================================================================
# STAGE 2: Production Runtime Stage (Lightweight Secure Node.js Server)
# =============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Production environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Ensure wget is available for health check
RUN apk add --no-cache wget

# Create dedicated non-root system user and group for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 retrace

# Copy compiled frontend assets from builder stage
COPY --from=builder --chown=retrace:nodejs /app/dist ./dist

# Copy production server and backend middleware
COPY --chown=retrace:nodejs server.js package.json ./
COPY --chown=retrace:nodejs src/server ./src/server

# Switch to unprivileged non-root user
USER retrace

# Expose internal production server port
EXPOSE 3000

# Automated healthcheck testing the /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

# Launch production server
CMD ["node", "server.js"]
