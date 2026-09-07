# ============================================================================
# EduOBE Web (Next.js 14) - monorepo-aware multi-stage build
# ============================================================================
FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

# Dependencies layer
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/database/package.json packages/database/
COPY packages/shared/package.json packages/shared/
COPY packages/config/package.json packages/config/
COPY packages/ui/package.json packages/ui/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter @eduobe/web... --filter @eduobe/shared...

FROM deps AS build
COPY packages/shared packages/shared
COPY packages/config packages/config
COPY packages/ui packages/ui
COPY apps/web apps/web
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @eduobe/web build

# Runtime (Next standalone output is not configured; run via next start)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=build --chown=nextjs:nodejs /app ./
RUN rm -rf apps/web/src && chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
CMD ["pnpm", "--filter", "@eduobe/web", "start"]
