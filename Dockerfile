# ==============================================================================
# DOCKERFILE - EKOSISTEM PENDIDIKAN TERPADU AL-AFIYAH
# Yayasan Pendidikan Imam Bonjol Majalengka
# Optimized: standalone output, minimal image, faster cold-start
# ==============================================================================

# 1. Base Image — Alpine for minimal footprint
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2. Dependencies Stage — isolated for layer caching
FROM base AS deps
COPY package.json package-lock.json ./
# Use --omit=dev to skip devDependencies in production install check
RUN npm ci

# 3. Builder Stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma Client first
RUN npx prisma generate

# Build Next.js with standalone output (set in next.config.ts)
RUN npm run build

# 4. Production Runner Stage — only includes what's needed to run
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root system user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set up public upload directory with correct permissions
RUN mkdir -p /app/public/uploads/ppdb && chown -R nextjs:nodejs /app/public/uploads

# Copy ONLY what standalone needs — dramatically smaller image (~200MB vs ~600MB)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema + generated client for DB access at runtime
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

# Use node directly on the standalone server file — faster startup than npm start
CMD ["node", "server.js"]
