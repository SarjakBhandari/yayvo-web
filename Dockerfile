# Multi-stage Dockerfile for Next.js production build
# Build stage
FROM node:24.13.0 AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install --production=false --silent

# Copy source and build
COPY . .
RUN npm run build

# Runtime stage
FROM node:24.13.0 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE ${PORT}

# Use a non-root user for safety
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["npm", "start"]
