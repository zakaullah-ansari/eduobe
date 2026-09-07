# ============================================================================
# EduOBE API (NestJS) - monorepo-aware multi-stage build
# ============================================================================
FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

# Dependencies layer (pnpm workspace)
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/database/package.json packages/database/
COPY packages/shared/package.json packages/shared/
COPY packages/config/package.json packages/config/
COPY packages/ui/package.json packages/ui/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile --filter @eduobe/api... --filter @eduobe/database...

# Prisma generation (needs schema + client generator)
FROM deps AS prisma
COPY packages/database/prisma packages/database/prisma
COPY packages/database/src packages/database/src
COPY packages/database/tsconfig.json packages/database/
COPY packages/shared packages/shared
COPY packages/config packages/config
COPY packages/ui packages/ui
RUN pnpm --filter @eduobe/database db:generate

# Build API
FROM prisma AS build
COPY apps/api apps/api
COPY packages/shared packages/shared
COPY packages/config packages/config
COPY packages/ui packages/ui
RUN pnpm --filter @eduobe/api build

# Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S nodejs && adduser -S nestjs -G nodejs

COPY --from=build --chown=nestjs:nodejs /app ./
RUN rm -rf apps/api/src && chown -R nestjs:nodejs /app

USER nestjs
EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
