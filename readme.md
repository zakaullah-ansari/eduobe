# EduOBE v2.0

> **Outcome-Based Education • NBA Accreditation • Academic Intelligence**  
> Enterprise-Grade Multi-Tenant SaaS Platform

## Overview

EduOBE automates the entire Outcome-Based Education lifecycle for engineering colleges in India — from CO-PO mapping to attainment calculation to NBA report generation.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, shadcn/ui, Tailwind CSS, TanStack Query, Zustand |
| **Backend** | NestJS 10, TypeScript, Prisma, BullMQ, Passport.js |
| **Database** | PostgreSQL 16, Redis 7 |
| **Storage** | Cloudflare R2 (S3-compatible) |
| **DevOps** | Docker, Caddy, GitHub Actions, Sentry, Grafana |
| **Monorepo** | Turborepo + pnpm workspaces |

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start local services (PostgreSQL + Redis)
docker-compose up -d

# 3. Generate Prisma client
pnpm db:generate

# 4. Push schema to database
pnpm db:push

# 5. Seed database with sample data
pnpm db:seed

# 6. Start development servers
pnpm dev
```

## Project Structure

```
eduobe/
├── apps/
│   ├── web/          # Next.js 14 frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── shared/       # Shared Zod schemas, types, constants
│   ├── database/     # Prisma schema, client, migrations, seeds
│   ├── ui/           # Shared shadcn-based components
│   └── config/       # Shared ESLint, TypeScript, Tailwind configs
└── docs/
    ├── phases/       # Phase-wise documentation
    └── architecture/ # Architecture diagrams and decisions
```

## Development Phases

| Phase | Name | Status |
|---|---|---|
| 01 | Requirements Analysis & User Stories | ✅ Complete |
| 02 | System Architecture Document | ✅ Complete |
| 03 | Monorepo Setup (Turborepo, pnpm, configs, shared packages) | ✅ Complete |
| 04 | Database Design (complete Prisma schema, migrations, seed) | ⬜ Pending |
| 05 | NestJS Base App | ⬜ Pending |
| 06 | Next.js Base App | ⬜ Pending |
| 07 | Authentication System | ⬜ Pending |
| 08-20 | MVP Modules | ⬜ Pending |
| 21-28 | Post-MVP Features | ⬜ Pending |

## Documentation

- [Phase 1: Requirements Analysis](docs/phases/PHASE-01-requirements-analysis.md)
- [Phase 2: System Architecture](docs/phases/PHASE-02-system-architecture.md)
- [Phase 3: Monorepo Setup](docs/phases/PHASE-03-monorepo-setup.md)

## Login Credentials (After Seed)

| Role | Email | Password |
|---|---|---|
| Admin | admin@vjti.ac.in | Admin@123 |
| Faculty | rajesh.sharma@vjti.ac.in | Faculty@123 |

## License

Proprietary — All rights reserved.
