# PHASE 5: NestJS Base App

## EduOBE v2.0 — Complete Backend Infrastructure

**Document Version:** 1.0  
**Date:** 2026-08-03  
**Status:** ✅ Complete  
**Prerequisites:** Phase 1 ✅ Phase 2 ✅ Phase 3 ✅ Phase 4 ✅

---

## Overview

Phase 5 delivers the complete NestJS backend infrastructure including:
- Application structure with modular architecture
- Common layer (guards, interceptors, filters, pipes, decorators)
- Configuration management
- Infrastructure services (Prisma, Redis, Queue, Storage, Email, Events)
- Health checks and monitoring
- Swagger/OpenAPI documentation
- Logging with Pino
- Rate limiting and security

---

## Application Structure

```
apps/api/
├── src/
│   ├── main.ts                              # Application entry point
│   ├── app.module.ts                        # Root module
│   │
│   ├── config/                              # Configuration
│   │   ├── index.ts                         # Config loader
│   │   ├── app.config.ts                    # App settings
│   │   ├── database.config.ts               # Database connection
│   │   ├── jwt.config.ts                    # JWT settings
│   │   ├── redis.config.ts                  # Redis connection
│   │   ├── storage.config.ts                # R2/S3 storage
│   │   ├── mail.config.ts                   # Email settings
│   │   └── ai.config.ts                     # AI/OpenAI settings
│   │
│   ├── common/                              # Shared utilities
│   │   ├── decorators/
│   │   │   ├── public.decorator.ts          # Mark routes as public
│   │   │   ├── permissions.decorator.ts     # Permission-based access
│   │   │   ├── roles.decorator.ts           # Role-based access
│   │   │   ├── current-user.decorator.ts    # Get current user
│   │   │   └── tenant-id.decorator.ts       # Get tenant ID
│   │   │
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts            # JWT authentication
│   │   │   ├── permissions.guard.ts         # Permission checking
│   │   │   ├── roles.guard.ts               # Role checking
│   │   │   └── tenant.guard.ts              # Tenant isolation
│   │   │
│   │   ├── interceptors/
│   │   │   ├── response-transform.interceptor.ts  # Wrap responses
│   │   │   └── audit-log.interceptor.ts            # Log mutations
│   │   │
│   │   ├── filters/
│   │   │   ├── all-exceptions.filter.ts     # Global error handler
│   │   │   └── prisma-exception.filter.ts   # Prisma error handler
│   │   │
│   │   ├── dto/
│   │   │   └── pagination.dto.ts            # Pagination parameters
│   │   │
│   │   ├── interfaces/
│   │   │   └── request-with-user.interface.ts
│   │   │
│   │   └── utils/
│   │       └── password.util.ts             # Password hashing
│   │
│   └── modules/
│       ├── prisma/                          # Database service
│       │   ├── prisma.module.ts
│       │   └── prisma.service.ts
│       │
│       ├── redis/                           # Cache service
│       │   ├── redis.module.ts
│       │   └── redis.service.ts
│       │
│       ├── queue/                           # Background jobs
│       │   ├── queue.module.ts
│       │   └── queue.service.ts
│       │
│       ├── storage/                         # File storage (R2)
│       │   ├── storage.module.ts
│       │   └── storage.service.ts
│       │
│       ├── email/                           # Email service
│       │   ├── email.module.ts
│       │   └── email.service.ts
│       │
│       ├── event/                           # Domain events
│       │   ├── event.module.ts
│       │   └── event.service.ts
│       │
│       ├── health/                          # Health checks
│       │   ├── health.module.ts
│       │   ├── health.controller.ts
│       │   ├── prisma.health.ts
│       │   └── redis.health.ts
│       │
│       └── auth/                            # Authentication (placeholder)
│           └── auth.module.ts
│
├── test/                                    # E2E tests
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── nest-cli.json
```

---

## Key Components

### 1. Configuration Management

**7 Configuration Modules:**
- `app.config.ts` — Application settings (name, version, port, frontend URL)
- `database.config.ts` — Database connection (URL, pool size, logging)
- `jwt.config.ts` — JWT settings (secrets, expiry, audience, issuer)
- `redis.config.ts` — Redis connection (host, port, password, URL)
- `storage.config.ts` — R2/S3 storage (endpoint, keys, bucket, region)
- `mail.config.ts` — Email settings (provider, API key, from address)
- `ai.config.ts` — AI/OpenAI settings (API key, model, temperature)

**Usage:**
```typescript
constructor(private configService: ConfigService) {
  const port = this.configService.get<number>('app.port');
  const dbUrl = this.configService.get<string>('database.url');
}
```

### 2. Infrastructure Services

**PrismaService:**
- Wraps PrismaClient for NestJS lifecycle
- Automatic connection management
- Query logging in development
- Database cleanup for testing

**RedisService:**
- String, hash, and JSON operations
- Caching with TTL
- Pattern-based invalidation
- Connection management

**QueueService:**
- BullMQ integration for background jobs
- 5 queues: reports, emails, bulk-import, attainment, attendance-alert
- Job management (add, get, counts)
- Retry strategies with exponential backoff

**StorageService:**
- Cloudflare R2 (S3-compatible) integration
- File upload with UUID naming
- Pre-signed URLs for secure access
- File deletion and existence checks

**EmailService:**
- Resend integration
- Welcome email templates
- Password reset emails
- Graceful degradation when not configured

**EventService:**
- Domain event emitter
- 20+ predefined events (user, student, attendance, marks, attainment, etc.)
- Async event handling
- Type-safe event names

### 3. Common Layer

**Guards (4):**
- `JwtAuthGuard` — JWT token validation, user extraction
- `PermissionsGuard` — Permission-based access control
- `RolesGuard` — Role-based access control
- `TenantGuard` — Tenant isolation and extraction

**Interceptors (2):**
- `ResponseTransformInterceptor` — Wraps all responses in `{ success, data, meta }`
- `AuditLogInterceptor` — Logs all mutations with sanitized body

**Filters (2):**
- `AllExceptionsFilter` — Global error handler with request ID
- `PrismaExceptionFilter` — Prisma-specific error handling (P2002, P2025, etc.)

**Decorators (5):**
- `@Public()` — Mark routes as public (no auth required)
- `@Permissions('student:read')` — Require specific permissions
- `@Roles('faculty', 'hod')` — Require specific roles
- `@CurrentUser()` — Get current user from request
- `@TenantId()` — Get tenant ID from request

**DTOs:**
- `PaginationDto` — Standard pagination (page, limit, search, sortBy, sortOrder)

**Utilities:**
- `hashPassword()` — Argon2id password hashing
- `verifyPassword()` — Password verification

### 4. Health Checks

**3 Health Indicators:**
- Database (Prisma) — Connection check
- Redis — Ping check
- HTTP — External service checks

**Endpoint:** `GET /api/v1/health`

**Response:**
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "redis": { "status": "up" }
  },
  "error": {},
  "details": {
    "database": { "status": "up" },
    "redis": { "status": "up" }
  }
}
```

### 5. Security Features

**Helmet.js:**
- Security headers (HSTS, CSP, X-Frame, etc.)
- XSS protection
- Content type sniffing prevention

**Rate Limiting:**
- 3 tiers: short (10 req/s), medium (50 req/10s), long (200 req/min)
- Global throttling via ThrottlerGuard
- Customizable per route

**CORS:**
- Configurable origin (frontend URL)
- Credentials enabled
- Secure cookie support

**Compression:**
- Gzip compression for responses
- Reduced bandwidth usage

### 6. Logging

**Pino Logger:**
- Structured JSON logging
- Pretty printing in development
- Request/response logging
- Custom serializers (sanitize sensitive data)

**Log Levels:**
- Production: `info`
- Development: `debug`

**Example Log:**
```json
{
  "level": 30,
  "time": 1691049600000,
  "req": {
    "id": "req_123",
    "method": "GET",
    "url": "/api/v1/students",
    "headers": {
      "user-agent": "Mozilla/5.0",
      "x-tenant-id": "vjti"
    }
  },
  "res": {
    "statusCode": 200
  },
  "responseTime": 45
}
```

### 7. API Documentation

**Swagger/OpenAPI:**
- Auto-generated from decorators
- Bearer auth support
- API key support (X-Tenant-ID header)
- Tagged endpoints (auth, users, academic, students, etc.)
- Persistent authorization in UI

**Endpoint:** `GET /api/docs` (development only)

**Features:**
- Try it out functionality
- Request/response schemas
- Error documentation
- Authentication testing

---

## Usage Examples

### Protecting Routes

```typescript
@Controller('students')
@UseGuards(JwtAuthGuard, TenantGuard)
export class StudentsController {
  @Get()
  @Permissions('student:read')
  findAll(@TenantId() tenantId: string) {
    return this.studentsService.findAll(tenantId);
  }

  @Post()
  @Roles('admin', 'hod')
  create(@Body() dto: CreateStudentDto, @CurrentUser() user: any) {
    return this.studentsService.create(dto, user.id);
  }

  @Get('public-stats')
  @Public()
  getPublicStats() {
    return this.studentsService.getPublicStats();
  }
}
```

### Using Services

```typescript
@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private queue: QueueService,
    private storage: StorageService,
    private email: EmailService,
    private event: EventService,
  ) {}

  async findAll(tenantId: string) {
    // Use Redis cache
    return this.redis.cache(
      `students:${tenantId}`,
      () => this.prisma.student.findMany({ where: { tenantId } }),
      300, // 5 minutes TTL
    );
  }

  async create(dto: CreateStudentDto, userId: string) {
    const student = await this.prisma.student.create({ data: dto });

    // Emit event
    this.event.emit(DomainEvent.STUDENT_CREATED, { student, userId });

    // Queue welcome email
    await this.queue.addJob(QueueName.EMAILS, 'send-welcome', {
      email: dto.email,
      firstName: dto.firstName,
    });

    return student;
  }

  async uploadDocument(studentId: string, file: Buffer, fileName: string) {
    const { key, url } = await this.storage.uploadFile(
      file,
      fileName,
      'application/pdf',
      `students/${studentId}/documents`,
    );

    return { key, url };
  }
}
```

### Pagination

```typescript
@Get()
async findAll(@Query() pagination: PaginationDto, @TenantId() tenantId: string) {
  const { skip, take, search, sortBy, sortOrder } = pagination;

  const [data, total] = await Promise.all([
    this.prisma.student.findMany({
      where: {
        tenantId,
        ...(search && {
          OR: [
            { rollNumber: { contains: search, mode: 'insensitive' } },
            { user: { firstName: { contains: search, mode: 'insensitive' } } },
          ],
        }),
      },
      skip,
      take,
      orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
    }),
    this.prisma.student.count({ where: { tenantId } }),
  ]);

  return {
    data,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
}
```

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (watch mode)
pnpm dev

# Start production server
pnpm start:prod

# Build for production
pnpm build

# Run tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run tests with coverage
pnpm test:cov

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check
```

---

## API Endpoints

### Health Check
```
GET /api/v1/health
```

### Swagger Documentation (Development Only)
```
GET /api/docs
```

### API Versioning
All endpoints are prefixed with `/api/v1/` by default.

---

## Environment Variables

```bash
# Application
NODE_ENV=development
PORT=4000
API_PREFIX=api/v1
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://eduobe:eduobe@localhost:5432/eduobe

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Storage (R2)
R2_ENDPOINT=https://account.r2.cloudflarestorage.com
R2_ACCESS_KEY=your-access-key
R2_SECRET_KEY=your-secret-key
R2_BUCKET=eduobe-files-dev

# Email (Resend)
RESEND_API_KEY=re_your_api_key

# AI (OpenAI) - Optional
OPENAI_API_KEY=sk-your-key
```

---

## Testing the Setup

### 1. Start Services
```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Start API server
pnpm dev
```

### 2. Test Health Check
```bash
curl http://localhost:4000/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "redis": { "status": "up" }
  }
}
```

### 3. View Swagger Documentation
Open browser: `http://localhost:4000/api/docs`

---

## Phase 5 Checklist

- [x] NestJS application structure with modular architecture
- [x] Main entry point with security middleware (Helmet, CORS, compression)
- [x] App module with all imports
- [x] 7 configuration modules (app, database, JWT, Redis, storage, mail, AI)
- [x] Prisma module with lifecycle management
- [x] Redis module with caching utilities
- [x] Queue module with BullMQ (5 queues)
- [x] Storage module with R2 integration
- [x] Email module with Resend
- [x] Event module with domain events
- [x] Health module with database and Redis checks
- [x] 4 guards (JWT, permissions, roles, tenant)
- [x] 2 interceptors (response transform, audit log)
- [x] 2 filters (all exceptions, Prisma exceptions)
- [x] 5 decorators (public, permissions, roles, current user, tenant ID)
- [x] Pagination DTO
- [x] Password utilities (Argon2id)
- [x] Swagger/OpenAPI documentation
- [x] Pino logger with structured logging
- [x] Rate limiting (3 tiers)
- [x] API versioning
- [x] Global validation pipe
- [x] TypeScript strict mode
- [x] ESLint and Prettier configuration

---

## Next Steps

**Phase 5 is complete.** The backend infrastructure is fully set up and ready for feature development.

**To continue development, say:**
```
PROCEED TO PHASE 6
```

**Phase 6 will generate the Next.js Base App:**
- Next.js 14 application with App Router
- Layout components (sidebar, header, breadcrumb)
- shadcn/ui components
- Theme system (light/dark/system)
- Command palette (Cmd+K)
- API client with Axios
- Auth store with Zustand
- TanStack Query setup

---

## Quick Reference

### Guard Usage
```typescript
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Permissions('student:read')
```

### Cache Usage
```typescript
await this.redis.cache('key', () => this.fetchData(), 300);
```

### Queue Usage
```typescript
await this.queue.addJob(QueueName.EMAILS, 'send-welcome', { email });
```

### Event Usage
```typescript
this.event.emit(DomainEvent.USER_CREATED, { user });
```

### Storage Usage
```typescript
const { key, url } = await this.storage.uploadFile(buffer, fileName, contentType);
```
