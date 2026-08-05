# PHASE 3: Monorepo Setup

## EduOBE v2.0 — Turborepo + pnpm Workspaces

**Document Version:** 1.0  
**Date:** 2026-08-03  
**Status:** ✅ Complete  
**Prerequisites:** Phase 1 ✅ Phase 2 ✅

---

## Overview

Phase 3 establishes the foundational monorepo structure using Turborepo and pnpm workspaces. This creates the skeleton for all subsequent phases with shared configurations, type-safe packages, and development tooling.

---

## Files Created

```
eduobe/
├── package.json                    # Root workspace config
├── pnpm-workspace.yaml             # Workspace definition
├── turbo.json                      # Turborepo task pipeline
├── .npmrc                          # pnpm configuration
├── .prettierrc                     # Prettier config
├── .prettierignore                 # Prettier ignore
├── .gitignore                      # Git ignore
├── .env                            # Environment variables
├── .env.example                    # Environment template
├── docker-compose.yml              # Local dev services (PostgreSQL, Redis)
│
├── packages/
│   ├── config/                     # Shared configurations
│   │   ├── package.json
│   │   ├── tsconfig.base.json      # Base TypeScript config
│   │   ├── tsconfig.nextjs.json    # Next.js TypeScript config
│   │   ├── tsconfig.nestjs.json    # NestJS TypeScript config
│   │   ├── tsconfig.react-library.json
│   │   ├── eslint-preset.js        # Shared ESLint config
│   │   └── tailwind-preset.js      # Shared Tailwind config
│   │
│   ├── shared/                     # Shared types, schemas, constants
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── schemas/
│   │       │   ├── index.ts
│   │       │   ├── common.schemas.ts    # Email, password, pagination
│   │       │   ├── auth.schemas.ts      # Login, register, 2FA
│   │       │   └── academic.schemas.ts  # Dept, program, course, etc.
│   │       ├── types/
│   │       │   └── index.ts             # Type definitions
│   │       └── constants/
│   │           └── index.ts             # System constants, POs, roles
│   │
│   ├── database/                   # Prisma schema, client, seeds
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Complete 40+ model schema
│   │   │   └── seed.ts             # Realistic Indian college data
│   │   └── src/
│   │       ├── index.ts
│   │       ├── client.ts
│   │       ├── types.ts
│   │       ├── prisma.service.ts
│   │       ├── prisma-tenant.service.ts
│   │       └── utils/
│   │           └── hash.ts         # Argon2id password hashing
│   │
│   └── ui/                         # Shared shadcn components (Phase 6)
│       └── (placeholder)
│
├── apps/
│   ├── web/                        # Next.js 14 frontend (Phase 6)
│   │   └── (placeholder)
│   └── api/                        # NestJS backend (Phase 5)
│       └── (placeholder)
│
└── docs/
    ├── phases/
    │   ├── PHASE-01-requirements-analysis.md
    │   ├── PHASE-02-system-architecture.md
    │   └── PHASE-03-monorepo-setup.md
    └── architecture/
```

---

## Package Details

### packages/config — Shared Configurations

| File | Purpose |
|---|---|
| `tsconfig.base.json` | Base TS config: strict mode, ES2022, bundler resolution |
| `tsconfig.nextjs.json` | Next.js: DOM libs, JSX preserve, path aliases |
| `tsconfig.nestjs.json` | NestJS: CommonJS, decorators, emit enabled |
| `tsconfig.react-library.json` | React libraries: JSX react-jsx |
| `eslint-preset.js` | ESLint: TypeScript, import ordering, unused imports |
| `tailwind-preset.js` | Tailwind: shadcn color system, animations, dark mode |

### packages/shared — Shared Schemas, Types, Constants

**Schemas (Zod):**
- `common.schemas.ts` — Email, password, phone, pagination, API responses, file upload
- `auth.schemas.ts` — Login, register, forgot/reset password, 2FA, user CRUD, roles
- `academic.schemas.ts` — AcademicYear, Department, Program, Curriculum, Semester, CourseType, Course, Batch, Section

**Types:**
- Entity statuses, Bloom levels, attendance statuses
- Assessment categories, question types, difficulty levels
- Audit actions, notification types, survey types
- PaginatedResult, ApiResponse, UserContext, Permission
- DashboardStats, AttainmentLevel, COAttainmentResult, POAttainmentResult

**Constants:**
- System constants (page sizes, file limits, JWT expiry, lockout settings)
- 12 default roles
- 6 Bloom's Taxonomy levels with colors
- 12 standard NBA Program Outcomes (PO1-PO12)
- 8 default assessment types (CIA, MSE, TEE, Quiz, etc.)
- 7 default course types (Theory, Lab, Project, etc.)
- Default attainment levels and mapping weights
- API route constants
- Allowed file types

### packages/database — Prisma Schema & Services

**Schema (40+ models):**
- Core: Tenant, User, Role, Permission, UserRole, RolePermission, RefreshToken
- Academic: AcademicYear, Department, Program, Curriculum, Semester, CourseType, Course, Batch, Section, LabBatch
- People: Student, Faculty
- Offerings: CourseOffering, CourseEnrollment
- Outcomes: CourseOutcome, ProgramOutcome, ProgramSpecificOutcome, COPOMapping, COPPSOMapping
- Attendance: AcademicCalendar, AttendanceSession, AttendanceRecord
- Teaching: TeachingPlan, PracticalPlan
- Assessment: AssessmentType, Assessment, QuestionBank, QuestionPaper, Marks
- Attainment: AttainmentConfig, COAttainment, POAttainment, PSOAttainment
- Learners: SlowLearner, RemedialSession, AdvancedLearner, ContentBeyondSyllabus
- Surveys: Survey, SurveyResponse
- Documents: Document
- System: AuditLog, Notification

**Services:**
- `PrismaService` — Base service with connection lifecycle
- `PrismaTenantService` — Tenant-scoped queries with automatic tenantId filtering
- `hash.ts` — Argon2id password hashing and verification

**Seed Data:**
- Tenant: Vishwakarma Institute of Technology, Pune (vjti)
- 19 permissions (user, student, marks, attendance, attainment)
- 12 default roles
- Admin user: admin@vjti.ac.in / Admin@123
- 5 faculty users with realistic Indian names
- 5 departments (CSE, ECE, MECH, CIVIL, AIDS)
- Academic year: 2024-25
- 7 course types
- 8 assessment types

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Start local services (PostgreSQL + Redis)
docker-compose up -d

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Run seed data
pnpm db:seed

# Open Prisma Studio
pnpm db:studio

# Start all apps in development
pnpm dev

# Start only frontend
pnpm dev:web

# Start only backend
pnpm dev:api

# Build all apps
pnpm build

# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Format code
pnpm format

# Clean all build artifacts
pnpm clean
```

---

## Key Configuration Decisions

### Turborepo Pipeline

```
build:
  dependsOn: [^build, ^db:generate]
  outputs: [.next/**, dist/**]

dev:
  cache: false
  persistent: true

db:generate:
  cache: false (always fresh)

type-check:
  dependsOn: [^build, ^db:generate]
```

### ESLint Rules

- `@typescript-eslint/consistent-type-imports` — Enforce type imports
- `unused-imports/no-unused-imports` — Remove unused imports
- `import/order` — Alphabetical import ordering with groups
- `no-console` — Warn on console.log (allow warn/error)

### TypeScript Strict Mode

- `strict: true` — All strict checks enabled
- `noUncheckedIndexedAccess: true` — Array/object access returns T | undefined
- `noImplicitOverride: true` — Require override keyword
- `noFallthroughCasesInSwitch: true` — Prevent switch fallthrough

### Tailwind Configuration

- Dark mode via `class` strategy (next-themes)
- CSS variables for all colors (shadcn pattern)
- Custom animations for accordions and collapsibles
- Inter font family
- 4px spacing grid, 8px border radius

---

## Phase 3 Checklist

- [x] Turborepo configuration with task pipeline
- [x] pnpm workspace definition
- [x] Root package.json with all scripts
- [x] Shared TypeScript configurations (base, Next.js, NestJS, React library)
- [x] Shared ESLint preset with import ordering
- [x] Shared Tailwind preset with shadcn color system
- [x] Prettier configuration
- [x] packages/shared with Zod schemas (common, auth, academic)
- [x] packages/shared with TypeScript types
- [x] packages/shared with constants (roles, POs, assessment types, etc.)
- [x] packages/database with complete Prisma schema (40+ models)
- [x] packages/database with PrismaService and PrismaTenantService
- [x] packages/database with Argon2id password hashing
- [x] packages/database with seed data (realistic Indian college)
- [x] Docker Compose for local development (PostgreSQL + Redis)
- [x] Environment variables (.env.example + .env)
- [x] .gitignore with comprehensive rules
- [x] Development commands documented

---

## Next Steps

**Phase 3 is complete.** Say **"PROCEED TO PHASE 4"** to generate:
- Complete Prisma schema validation and optimization
- Database migration setup
- Extended seed data (programs, curricula, courses, students, batches, sections)
- Database indexes and performance optimization
- Partition setup for audit logs
