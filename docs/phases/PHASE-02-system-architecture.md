# PHASE 2: System Architecture Document

## EduOBE v2.0 — Complete System Architecture

**Document Version:** 1.0  
**Date:** 2026-08-03  
**Status:** ✅ Complete  
**Prerequisite:** Phase 1 (Requirements Analysis) ✅

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [C4 Model — Context Diagram](#2-c4-model--context-diagram)
3. [C4 Model — Container Diagram](#3-c4-model--container-diagram)
4. [C4 Model — Component Diagram](#4-c4-model--component-diagram)
5. [Deployment Architecture](#5-deployment-architecture)
6. [Data Architecture](#6-data-architecture)
7. [Security Architecture](#7-security-architecture)
8. [Authentication Flow](#8-authentication-flow)
9. [Module Interaction Diagrams](#9-module-interaction-diagrams)
10. [API Architecture](#10-api-architecture)
11. [Frontend Architecture](#11-frontend-architecture)
12. [Backend Architecture](#12-backend-architecture)
13. [Scalability Strategy](#13-scalability-strategy)
14. [Caching Strategy](#14-caching-strategy)
15. [Background Job Architecture](#15-background-job-architecture)
16. [File Storage Architecture](#16-file-storage-architecture)
17. [Real-time Communication](#17-real-time-communication)
18. [Monitoring & Observability](#18-monitoring--observability)
19. [Disaster Recovery Plan](#19-disaster-recovery-plan)
20. [Multi-Tenancy Strategy](#20-multi-tenancy-strategy)
21. [Architecture Decision Records (ADRs)](#21-architecture-decision-records-adrs)

---

## 1. Architecture Overview

### 1.1 Architecture Style

EduOBE follows a **Modular Monolith** architecture with clear module boundaries, event-driven communication, and preparation for future microservices extraction.

**Why Modular Monolith?**
- Simpler deployment (single process)
- Easier debugging (in-process calls)
- Lower operational overhead (solo developer)
- Can extract services later when needed
- Event-driven design enables future decomposition

### 1.2 Key Architectural Principles

1. **Separation of Concerns** — Clear boundaries between frontend, backend, database, cache
2. **Event-Driven Side Effects** — Decouple modules via domain events
3. **Configuration Over Code** — Dynamic assessment types, formulas, permissions
4. **Tenant Isolation by Default** — Every query filters by tenantId
5. **Type-Safe End-to-End** — Zod schemas shared between frontend and backend
6. **Performance First** — Caching, pagination, background jobs
7. **Security by Design** — RBAC, rate limiting, input validation
8. **Audit Everything** — All mutations logged with old/new values

### 1.3 Technology Stack Summary

```
PRESENTATION LAYER
  Next.js 14 (App Router, RSC, Server Actions)
  shadcn/ui + Radix + Tailwind CSS
  TanStack Query v5 + Zustand
  Recharts + Tremor
        |
        | HTTPS (REST API + WebSocket)
        |
APPLICATION LAYER
  NestJS 10 (Modules, Guards, Interceptors, Pipes)
  Prisma 5 (Type-safe ORM)
  Passport.js + JWT (Auth)
  BullMQ (Background Jobs)
  Socket.io (Real-time)
        |
        | TCP
        |
DATA LAYER
  PostgreSQL 16 (Primary Store, JSONB, Full-text Search)
  Redis 7 (Cache, Sessions, Rate Limits, Pub/Sub)
  Cloudflare R2 (File Storage, S3-compatible)
```

---

## 2. C4 Model — Context Diagram

### 2.1 System Context

```
                    +--------------------------+
                    |     EduOBE Platform       |
                    |  OBE + NBA Accreditation  |
                    +--------------------------+
                                |
    +-----------+-----------+---+---+-----------+-----------+
    |           |           |       |           |           |
    v           v           v       v           v           v
+--------+ +--------+ +--------+ +--------+ +--------+ +--------+
|Faculty | |Student | |  HOD   | |  NBA   | |Tenant  | |External|
|(Daily) | |(Daily) | |(Daily) | |Coord.  | |Admin   | |Auditor |
+--------+ +--------+ +--------+ +--------+ +--------+ +--------+

External Systems:
  - Resend (Email)     - Twilio (SMS)     - OpenAI API (AI/v3)
  - Cloudflare R2      - Sentry           - GitHub (CI/CD)
```

### 2.2 Context Description

| Element | Type | Description |
|---|---|---|
| **EduOBE Platform** | Software System | Core platform for OBE management and NBA accreditation |
| **Faculty** | Person | Teaching staff who manage courses, attendance, marks |
| **Student** | Person | Enrolled students viewing their academic progress |
| **HOD** | Person | Department head managing faculty and courses |
| **NBA Coordinator** | Person | Leads accreditation preparation |
| **Principal** | Person | Institutional head viewing analytics |
| **Tenant Admin** | Person | College IT administrator managing the platform |
| **Parent** | Person | Student's parent monitoring academic progress |
| **IQAC Coordinator** | Person | Quality assurance officer |
| **External Auditor** | Person | NBA/NAAC reviewer (read-only access) |

---

## 3. C4 Model — Container Diagram

### 3.1 Container Overview

```
+------------------+                    +------------------+
|   Web Browser    |<------ HTTPS ----->|   Next.js App    |
|   (SPA + SSR)    |                    |   (Frontend)     |
+------------------+                    +------------------+
                                                |
                                                | REST + WebSocket
                    +------------------+        |        +------------------+
                    |   Caddy Proxy    |<-------+------->|   NestJS API     |
                    |(Reverse Proxy +  |                  |   (Backend)      |
                    |  Auto HTTPS)     |                  +------------------+
                    +------------------+                          |
                                    +-----------------------------+-----------------------------+
                                    |                             |                             |
                                    v                             v                             v
                          +------------------+          +------------------+          +------------------+
                          |   PostgreSQL     |          |      Redis       |          |  Cloudflare R2   |
                          |   (Database)     |          |     (Cache)      |          |  (File Storage)  |
                          +------------------+          +------------------+          +------------------+
                                    |                             |
                                    v                             v
                          +------------------+          +------------------+
                          |   BullMQ Worker  |          |   Socket.io      |
                          |  (Background)    |          |   (Real-time)    |
                          +------------------+          +------------------+
```

### 3.2 Container Descriptions

| Container | Technology | Responsibility | Scaling |
|---|---|---|---|
| **Next.js App** | Next.js 14 (Node.js) | SSR, client interactivity, middleware | Horizontal (stateless) |
| **NestJS API** | NestJS 10 (Node.js) | Business logic, REST API, WebSocket, auth | Horizontal (stateless) |
| **PostgreSQL** | PostgreSQL 16 | Persistent data, transactions, full-text search | Vertical + Read replicas |
| **Redis** | Redis 7 | Caching, sessions, rate limiting, pub/sub, queues | Vertical + Redis Cluster |
| **Cloudflare R2** | S3-compatible | File storage (documents, reports, photos) | Managed (auto-scale) |
| **BullMQ Worker** | Node.js (BullMQ) | Background jobs (reports, calculations, imports) | Horizontal (multiple) |
| **Socket.io** | Socket.io | Real-time bidirectional communication | Horizontal (Redis adapter) |
| **Caddy** | Caddy 2 | Reverse proxy, auto HTTPS, load balancing | Vertical |

### 3.3 Container Interactions

```
1. User Request: Browser → Caddy → Next.js (SSR/CSR) → NestJS API → PostgreSQL/Redis/R2
2. Auth Flow:    Browser → NestJS (Login) → PostgreSQL (Verify) → Redis (Session) → Browser (JWT)
3. Real-time:    NestJS (Event) → Redis (Pub/Sub) → Socket.io → Browser
4. Background:   NestJS (Queue) → Redis (BullMQ) → Worker (Process) → PostgreSQL/R2 (Result)
5. File Upload:  Browser → NestJS (Validate) → R2 (Store) → PostgreSQL (Metadata) → Browser (URL)
6. Report Gen:   Browser → NestJS (Queue) → Worker (Generate) → R2 (Store) → Browser (Download)
```

---

## 4. C4 Model — Component Diagram

### 4.1 NestJS Backend Components

```
+--------------------------------------------------------------------+
|                    NestJS API (apps/api)                              |
+--------------------------------------------------------------------+

COMMON LAYER:
  Guards:        JwtAuthGuard, PermissionGuard, TenantGuard
  Interceptors:  ResponseTransformInterceptor, AuditLogInterceptor
  Filters:       HttpExceptionFilter, PrismaExceptionFilter
  Pipes:         ValidationPipe, ParseTenantPipe
  Middleware:    TenantResolverMiddleware, RequestIdMiddleware
  Decorators:    @CurrentUser, @Permissions, @Tenant, @Audit

MODULE LAYER:
  Auth, Tenant, User, Role
  AcademicYear, Department, Program, Curriculum, Semester
  CourseType, Course, Batch, Section, LabBatch
  CourseOffering, CourseEnrollment
  Student, Faculty
  CourseOutcome, ProgramOutcome, ProgramSpecificOutcome
  COPOMapping, CPSOMapping
  Attendance, TeachingPlan, PracticalPlan
  AssessmentType, Assessment, QuestionBank, QuestionPaper
  Marks, Attainment
  Report, Dashboard, Notification
  Survey, Document, AuditLog, AcademicCalendar

INFRASTRUCTURE LAYER:
  PrismaService    | Database ORM wrapper with tenant filtering
  RedisService     | Cache, sessions, pub/sub
  StorageService   | R2 file upload/download
  QueueService     | BullMQ job queue management
  EmailService     | Resend email sending
  EventService     | Domain event emitter
```

### 4.2 Module Dependency Graph

```
Auth → User, Tenant, Role

User/Tenant → Department → Program → Curriculum → Semester → Course
                                                          → Batch → Section
Course + Batch + Faculty + AcademicYear → CourseOffering
CourseOffering → Attendance, TeachingPlan, Assessment → Marks → Attainment
Attainment → Report, Dashboard, Notification
```

### 4.3 Next.js Frontend Components

```
APP ROUTER LAYER:
  /app/(auth)      → Login, Register, Forgot Password
  /app/(dashboard) → Role-based dashboards, academic modules
  /app/(public)    → Landing page, pricing, public surveys

COMPONENT LAYER:
  UI Components (shadcn):   Button, Input, Table, Dialog, Sheet, Command, Toast
  Layout Components:        Sidebar, Header, Breadcrumb, UserMenu, NotificationBell
  Shared Components:        DataTable, FileUpload, BulkImport, ExportDialog, EmptyState
  Chart Components:         AttainmentRadar, AttendanceTrend, MarksDistribution
  Feature Components:       AttendanceMarking, TeachingPlanEditor, MarksEntryGrid

STATE MANAGEMENT:
  Zustand Stores:    authStore, tenantStore, uiStore
  TanStack Query:    Server state cache, auto-refetch
  React Hook Form:   Form state with Zod validation

SERVICE LAYER:
  API Client:        Axios instance with interceptors
  Auth Service:      Login, logout, refresh, 2FA
  Module Services:   TanStack Query hooks per module
  Socket Service:    Real-time event handling
```

---

## 5. Deployment Architecture

### 5.1 Production Deployment

```
INTERNET
    |
    | HTTPS (443)
    v
+--------------------------------------------------------------------+
|                    CADDY REVERSE PROXY                                |
|  - TLS termination (Let's Encrypt)                                  |
|  - HTTP/2 + HTTP/3, Gzip/Brotli                                    |
|  - Security headers (HSTS, CSP, X-Frame)                           |
|  - Route: /* → Next.js (3000)                                       |
|  - Route: /api/* → NestJS (4000)                                    |
|  - Route: /socket.io/* → Socket.io (4000)                           |
+--------------------------------------------------------------------+
    |
    +-----------------+-----------------+
    |                 |                 |
    v                 v                 v
+-----------+  +-----------+  +-----------+
| Next.js   |  | NestJS    |  | BullMQ    |
| (Port 3000)|  | (Port 4000)|  | Worker    |
+-----------+  +-----------+  +-----------+
    |                 |                 |
    +-----------------+-----------------+
    |
    +-----------------+-----------------+
    |                 |                 |
    v                 v                 v
+-----------+  +-----------+  +-----------+
|PostgreSQL |  |   Redis   |  |Cloudflare |
|(Port 5432)|  |(Port 6379)|  |   R2      |
+-----------+  +-----------+  +-----------+
```

### 5.2 Docker Compose

```yaml
version: '3.9'
services:
  caddy:
    image: caddy:2-alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    depends_on: [web, api]

  web:
    build: { context: ./apps/web, dockerfile: Dockerfile }
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.eduobe.com

  api:
    build: { context: ./apps/api, dockerfile: Dockerfile }
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/eduobe
      - REDIS_URL=redis://redis:6379
    depends_on: [postgres, redis]

  worker:
    build: { context: ./apps/api, dockerfile: Dockerfile }
    command: npm run start:worker
    depends_on: [postgres, redis]

  postgres:
    image: postgres:16-alpine
    volumes: [postgres_data:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes

volumes:
  postgres_data:
  redis_data:
  caddy_data:
```

### 5.3 Environment Variables

```bash
# Application
NODE_ENV=production
PORT=4000
API_PREFIX=/api/v1

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/eduobe
DATABASE_POOL_SIZE=20

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-256-bit-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Storage (Cloudflare R2)
R2_ENDPOINT=https://account.r2.cloudflarestorage.com
R2_ACCESS_KEY=your-access-key
R2_SECRET_KEY=your-secret-key
R2_BUCKET=eduobe-files

# Email (Resend)
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=noreply@eduobe.com

# Monitoring
SENTRY_DSN=https://your-dsn@sentry.io/project

# Frontend
NEXT_PUBLIC_API_URL=https://api.eduobe.com
NEXT_PUBLIC_WS_URL=wss://api.eduobe.com
```

---

## 6. Data Architecture

### 6.1 Database Schema Groups

| Group | Tables |
|---|---|
| **Core** | Tenant, User, Role, Permission, UserRole, RolePermission, RefreshToken |
| **Academic Structure** | AcademicYear, Department, Program, Curriculum, Semester, CourseType, Course, Batch, Section, LabBatch, CourseOffering, CourseEnrollment |
| **People** | Student, Faculty |
| **Outcomes & Mapping** | CourseOutcome, ProgramOutcome, ProgramSpecificOutcome, COPOMapping, CPSOMapping |
| **Attendance & Teaching** | AttendanceSession, AttendanceRecord, TeachingPlan, PracticalPlan, AcademicCalendar |
| **Assessment & Marks** | AssessmentType, Assessment, QuestionBank, QuestionPaper, Marks |
| **Attainment** | AttainmentConfig, COAttainment, POAttainment, PSOAttainment |
| **Learners** | SlowLearner, RemedialSession, AdvancedLearner, ContentBeyondSyllabus |
| **Surveys & Documents** | Survey, SurveyResponse, Document |
| **System** | AuditLog (partitioned), Notification |

### 6.2 Indexing Strategy

```sql
-- Tenant isolation (every query filters by tenantId)
CREATE INDEX idx_user_tenant ON "User"(tenant_id);
CREATE INDEX idx_student_tenant ON "Student"(tenant_id);
CREATE INDEX idx_course_offering_tenant ON "CourseOffering"(tenant_id);

-- Foreign key indexes
CREATE INDEX idx_student_user ON "Student"(user_id);
CREATE INDEX idx_student_batch ON "Student"(batch_id);
CREATE INDEX idx_marks_assessment ON "Marks"(assessment_id);
CREATE INDEX idx_marks_student ON "Marks"(student_id);

-- Query optimization
CREATE INDEX idx_attendance_session_date ON "AttendanceSession"(course_offering_id, date);
CREATE INDEX idx_marks_co_wise ON "Marks" USING GIN (co_wise_marks);

-- Full-text search
CREATE INDEX idx_user_search ON "User" USING GIN (
  to_tsvector('english', first_name || ' ' || last_name || ' ' || email)
);

-- Audit log partitioning (monthly)
CREATE TABLE audit_log (...) PARTITION BY RANGE (timestamp);
```

### 6.3 Redis Data Structure

```
SESSIONS:     session:{userId}              → { accessToken, refreshToken, expiresAt }  TTL: 7 days
RATE LIMITS:  ratelimit:{ip}:{endpoint}     → request_count                             TTL: 15 min
CACHE:        cache:{tenantId}:{module}:{hash} → JSON data                              TTL: 5 min - 1 hr
QUEUES:       bull:reports:wait|active|completed|failed → Job data (JSON)
PUB/SUB:      notifications:{userId}, attendance:{courseOfferingId}
COMPUTED:     attainment:{courseOfferingId} → { co1: 0.75, co2: 0.62 }                  TTL: 1 hr
QR CODES:     qr:{sessionId}:{code}         → { courseOfferingId, date, period }        TTL: 5 min
```

---

## 7. Security Architecture

### 7.1 Security Layers

```
Layer 1: Network Security
  - HTTPS only (TLS 1.3)
  - HSTS, CORS whitelist, connection-level rate limiting (Caddy)

Layer 2: Application Security
  - Helmet.js (CSP, X-Frame, X-Content-Type)
  - Rate limiting (100 req/15min general, 10 req/15min auth)
  - Input validation (Zod + class-validator)
  - SQL injection prevention (Prisma parameterized queries)
  - XSS prevention (React auto-escaping + CSP)
  - CSRF protection (httpOnly cookies + sameSite)

Layer 3: Authentication Security
  - Argon2id password hashing (OWASP 2024)
  - JWT RS256 (access: 15 min, refresh: 7 days)
  - Refresh token rotation with family-based reuse detection
  - Account lockout (5 attempts → 15 min cooldown)
  - 2FA (TOTP, Google Authenticator compatible)

Layer 4: Authorization Security
  - RBAC (12 default roles, custom roles)
  - Permission-based access (resource:action:scope)
  - Tenant isolation (every query filters by tenantId)
  - Guards on every endpoint

Layer 5: Data Security
  - Encryption at rest (PostgreSQL TDE, R2 SSE)
  - Encryption in transit (TLS 1.3)
  - Audit logging (all mutations with old/new values)
  - File upload validation (type whitelist, 50MB limit)

Layer 6: Operational Security
  - Environment variable management
  - Dependency vulnerability scanning
  - Regular security updates
  - Penetration testing (quarterly)
```

### 7.2 JWT Token Strategy

```
ACCESS TOKEN:
  Algorithm: RS256
  Expiry: 15 minutes
  Payload: { userId, tenantId, roles[], permissions[] }
  Storage: In-memory (Zustand) on client
  Sent via: Authorization: Bearer <token> header

REFRESH TOKEN:
  Algorithm: RS256
  Expiry: 7 days
  Payload: { userId, tokenFamily }
  Storage: httpOnly secure cookie (sameSite=strict)
  Rotation: New token on every refresh
  Reuse Detection: If old token used again → revoke entire family
```

---

## 8. Authentication Flow

### 8.1 Login Flow

```
Client                    NestJS                     PostgreSQL     Redis
  |                          |                          |              |
  | POST /auth/login         |                          |              |
  | {email, password}        |                          |              |
  |------------------------->|                          |              |
  |                          | Check rate limit         |              |
  |                          |-------------------------------------->|
  |                          |                          |              |
  |                          | Find user by email       |              |
  |                          |------------------------->|              |
  |                          |<-------------------------|              |
  |                          |                          |              |
  |                          | Verify password (Argon2id)|             |
  |                          | Check 2FA enabled        |              |
  |                          |                          |              |
  |                          | Generate JWT (access + refresh)         |
  |                          | Store refresh token      |              |
  |                          |------------------------->|              |
  |                          |                          |              |
  |                          | Update lastLoginAt       |              |
  |                          |------------------------->|              |
  |                          |                          |              |
  |                          | Emit LOGIN event (audit) |              |
  |                          |                          |              |
  | {accessToken, user,      |                          |              |
  |  permissions}            |                          |              |
  | Set-Cookie: refreshToken |                          |              |
  |<-------------------------|                          |              |
```

### 8.2 RBAC Authorization Flow

```
Client                    Guards Pipeline             Service
  |                          |                          |
  | GET /students            |                          |
  | Authorization: Bearer    |                          |
  |------------------------->|                          |
  |                          |                          |
  |                          | 1. JwtAuthGuard          |
  |                          |    - Verify token        |
  |                          |    - Decode payload      |
  |                          |    - Attach user         |
  |                          |                          |
  |                          | 2. TenantGuard           |
  |                          |    - Extract tenantId    |
  |                          |    - Verify active       |
  |                          |                          |
  |                          | 3. PermissionGuard       |
  |                          |    - Check permission    |
  |                          |    - Get user roles      |
  |                          |    - Check scope         |
  |                          |                          |
  |                          | Controller Handler       |
  |                          |------------------------->|
  |                          |                          | Apply scope filter
  |                          |                          | (own/course/dept/all)
  |                          |<-------------------------|
  | {students: [...]}        |                          |
  |<-------------------------|                          |
```

### 8.3 Token Refresh Flow

```
1. Client sends POST /auth/refresh (with refreshToken cookie)
2. Server verifies refresh token signature
3. Server finds token in DB, checks if revoked/expired
4. Server generates new access token
5. Server generates new refresh token (rotation)
6. Server marks old refresh token as revoked
7. Server stores new refresh token with same family
8. Server sets new refresh token as httpOnly cookie
9. Server returns { accessToken }

REUSE DETECTION:
  If old token is already revoked AND same family exists:
  → Revoke ALL tokens in family (token theft detected)
  → Force re-login
```

---

## 9. Module Interaction Diagrams

### 9.1 Marks → Attainment Pipeline

```
Faculty enters marks
    |
    v
MarksService → Validate → Save → Emit MARKS_UPDATED
    |
    v
Event Listeners:
  1. AuditLogListener → Log with old/new values
  2. NotificationListener → Notify student
  3. AttainmentListener → Check if all locked → Queue job
    |
    v
BullMQ Job: CALCULATE_ATTAINMENT
    |
    v
AttainmentWorker:
  1. Get all COs for course
  2. Get all assessments with marks
  3. Get attainment config (formula, weights, threshold)
  4. For each CO:
     a. Per assessment: count students >= threshold%
     b. Map % to attainment level (0-3)
     c. Weighted average = Direct CO Attainment
     d. Survey responses = Indirect CO Attainment
     e. Final = (alpha × Direct) + (beta × Indirect)
  5. Save CO attainment
  6. Emit CO_ATTAINMENT_CALCULATED
    |
    v
POAttainmentWorker:
  1. For each PO: collect all mapped COs across courses
  2. Weighted average using mapping levels (L3>L2>L1)
  3. Save PO attainment
  4. Same for PSO
    |
    v
CacheInvalidationListener:
  - Invalidate Redis cache
  - Notify dashboard via WebSocket
```

### 9.2 Attendance Session Flow

```
Faculty creates session
    |
    v
AttendanceService:
  1. Validate (no duplicate date+period+course)
  2. Create AttendanceSession
  3. Create AttendanceRecord per student (default: absent)
  4. Generate QR code (5 min TTL, stored in Redis)
  5. Return session + QR URL
    |
    v
Faculty marks attendance (manual) OR Student scans QR
    |
    v
AttendanceService:
  1. Update records
  2. Recalculate % (async)
  3. Emit ATTENDANCE_MARKED
    |
    v
AnalyticsListener:
  1. Check for defaulters (<75%)
  2. Emit DEFAULTER_IDENTIFIED
    |
    v
NotificationListener:
  - Alert student, parent, faculty advisor
```

### 9.3 Bulk Import Flow

```
Admin uploads Excel
    |
    v
ImportService:
  1. Validate file type/size
  2. Parse Excel
  3. Validate each row (required fields, duplicates, FK existence)
  4. Return preview: { validCount, errorCount, errors, preview }
    |
    v
Admin reviews and confirms
    |
    v
ImportService:
  1. Queue BullMQ job: BULK_IMPORT_STUDENTS
  2. Return jobId
    |
    v
BulkImportWorker:
  1. For each valid row: create User + Student + assign role
  2. Queue SEND_WELCOME_EMAIL per student
  3. Update progress (45/55)
  4. Emit BULK_IMPORT_COMPLETED
    |
    v
Client sees progress via WebSocket: "Importing... 45/55"
```

---

## 10. API Architecture

### 10.1 Design Principles

1. **RESTful** — Resource-based URLs, proper HTTP methods
2. **Consistent Format** — `{ success, message, data, meta? }` for success, `{ success: false, message, error, statusCode, details }` for errors
3. **Pagination** — Default: page=1, limit=20, max: 100
4. **Filtering** — Query params: `?status=active&department=cse&search=aarav`
5. **Sorting** — `?sort=createdAt:desc,name:asc`
6. **Versioning** — URL-based: `/api/v1/`
7. **Rate Limiting** — Headers: X-RateLimit-Limit, X-RateLimit-Remaining
8. **CORS** — Frontend origin whitelist only

### 10.2 Response Examples

**Success:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
      "id": "clx789ghi",
      "rollNumber": "CSE23001",
      "firstName": "Aarav",
      "lastName": "Mehta",
      "batch": { "name": "2023 Batch", "program": "B.Tech CSE" },
      "section": { "name": "A" },
      "attendance": { "percentage": 84.71 }
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 60, "totalPages": 3 }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "VALIDATION_ERROR",
  "statusCode": 400,
  "details": [
    { "field": "email", "message": "Invalid email format" }
  ],
  "timestamp": "2026-08-03T10:30:00Z",
  "path": "/api/v1/students",
  "requestId": "req_abc123"
}
```

### 10.3 Complete API Endpoint Catalog

See [Phase 1 API section](./PHASE-01-requirements-analysis.md) for the complete list of 100+ endpoints organized by module.

---

## 11. Frontend Architecture

### 11.1 App Router Structure

```
apps/web/src/app/
├── layout.tsx                    # Root layout (providers, theme)
├── (auth)/                       # Auth group (no sidebar)
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   └── reset-password/[token]/page.tsx
├── (dashboard)/                  # Dashboard group (with sidebar)
│   ├── layout.tsx                # Sidebar + Header
│   ├── dashboard/{faculty,hod,student,nba,admin}/page.tsx
│   ├── academic/{years,departments,programs,curriculum,...}/page.tsx
│   ├── courses/[id]/{outcomes,mappings,attendance,assessments,...}/page.tsx
│   ├── students/{list,import,promotion,[id]}/page.tsx
│   ├── faculty/{list,allocation,workload,[id]}/page.tsx
│   ├── attainment/{overview,config,co,po,pso,gap-analysis,trends}/page.tsx
│   ├── learners/{slow,advanced}/page.tsx
│   ├── surveys/{list,builder,[id]}/page.tsx
│   ├── documents/{manager,course-file}/page.tsx
│   ├── reports/{center,generate}/page.tsx
│   ├── calendar/page.tsx
│   ├── notifications/page.tsx
│   ├── audit-log/page.tsx
│   └── settings/{profile,security,tenant,roles}/page.tsx
└── (public)/                     # Public routes
    ├── page.tsx                  # Landing
    ├── pricing/page.tsx
    └── survey/[token]/page.tsx   # Public survey
```

### 11.2 State Management

| State Type | Tool | Examples |
|---|---|---|
| Server State | TanStack Query v5 | API data, auto-refetch, pagination |
| Client State | Zustand | Auth (user, token), UI (sidebar, theme) |
| Form State | React Hook Form + Zod | Form values, validation, dirty state |
| Real-time | Socket.io | Live notifications, attendance updates |

### 11.3 Component Patterns

Every **list page** includes:
- Search bar + faceted filters + column sort + pagination + bulk actions + export

Every **form** includes:
- Step wizard for complex forms, inline validation, auto-save draft, confirmation

Every **detail page** includes:
- Tabs for sub-sections, related data, action buttons

Every **state** includes:
- Loading: skeleton loaders (not spinners)
- Empty: illustration + message + CTA
- Error: retry button + helpful message

---

## 12. Backend Architecture

### 12.1 Module Structure

Each NestJS module follows this pattern:
```
modules/{name}/
├── {name}.module.ts           # Module definition, imports, exports
├── {name}.controller.ts       # Route handlers, Guards, decorators
├── {name}.service.ts          # Business logic, Prisma queries
├── dto/                       # Request/Response DTOs
│   ├── create-{name}.dto.ts
│   ├── update-{name}.dto.ts
│   └── {name}-filter.dto.ts
└── (optional)                 # Sub-services for complex modules
    ├── import.service.ts
    ├── approval.service.ts
    └── analytics.service.ts
```

### 12.2 Request Processing Pipeline

```
HTTP Request
    |
    v
Middleware: RequestId, Logger, TenantResolver
    |
    v
Guards: JwtAuth → Tenant → Permission
    |
    v
Interceptors: Timeout, Cache
    |
    v
Pipes: Validation (class-validator)
    |
    v
Controller Handler
    |
    v
Service (business logic + Prisma)
    |
    v
Interceptors: ResponseTransform, AuditLog
    |
    v
Filters: HttpException, PrismaException, AllExceptions
    |
    v
HTTP Response: { success, message, data, meta? }
```

### 12.3 Event System

```
Domain Events (via @nestjs/event-emitter):
  student.created      → Welcome email, audit log
  student.updated      → Audit log with old/new values
  marks.updated        → Audit log, notification, attainment check
  attendance.marked    → Analytics, defaulter check, notifications
  attainment.calculated → Cache invalidation, dashboard refresh
  report.completed     → Notification, download URL
  assessment.published → Student notification
  defaulter.identified → Student + parent + advisor notification
```

---

## 13. Scalability Strategy

### 13.1 Horizontal Scaling

```
Stateless App Layer:
  - Next.js + NestJS are stateless (sessions in Redis)
  - Multiple instances behind Caddy load balancer
  - Round-robin or least-connections

Database Scaling:
  - Primary: Writes
  - Read Replicas: Dashboard/report queries
  - Connection pooling (pgBouncer)
  - Partitioned tables (audit log by month)

Redis Scaling:
  - Redis Cluster for HA
  - Separate instances for cache vs queues (optional)

Background Jobs:
  - Multiple BullMQ workers
  - Separate queues per job type
  - Concurrency control per queue

File Storage:
  - Cloudflare R2 (managed, auto-scaling)
  - CDN for static assets
```

### 13.2 Performance Targets

| Metric | Target |
|---|---|
| Page load (initial) | < 2 seconds |
| API response (p95) | < 500ms |
| Attainment calc (500 students) | < 10 seconds |
| Bulk import (1000 students) | < 30 seconds |
| Report generation (PDF) | < 15 seconds |
| Concurrent users per tenant | 500+ |
| Total platform users | 100,000+ |

---

## 14. Caching Strategy

```
Layer 1: Browser Cache
  - Static assets: 1 year (immutable)
  - HTML: no-cache (always validate)

Layer 2: CDN Cache (Cloudflare)
  - Static assets: Edge caching
  - Public pages: Short TTL

Layer 3: Application Cache (Redis)
  - Sessions: 7 days
  - Permissions: 1 hour (invalidated on role change)
  - Attainment: 1 hour (invalidated on marks update)
  - Dashboard: 5 minutes (auto-refresh)
  - Static data: 1 hour

Cache Invalidation:
  - Event-driven: Marks updated → invalidate attainment cache
  - TTL-based: Dashboard expires after 5 minutes
  - Manual: Admin can clear cache from UI
```

---

## 15. Background Job Architecture

### BullMQ Job Queues

| Queue | Purpose | Concurrency | Retry |
|---|---|---|---|
| reports | PDF/Excel generation | 2 | 2 retries, 5m delay |
| emails | Welcome, alerts, notifications | 10 | 3 retries, exponential |
| bulk-import | Excel imports | 3 | 1 retry, immediate |
| attainment | CO/PO/PSO calculation | 5 | 2 retries, exponential |
| attendance-alert | Defaulter detection | 10 | 2 retries |

### Job Lifecycle

```
Queued → Waiting → Active → Completed/Failed
                              |
                              v
                         Retry (if configured)
                              |
                              v
                         Dead Letter (after max retries)
```

---

## 16. File Storage Architecture

### Cloudflare R2

```
Bucket Structure:
  eduobe-files/
  └── {tenantId}/
      ├── documents/
      │   ├── course-files/{courseOfferingId}.pdf
      │   ├── audit/{documentId}.pdf
      │   └── student/{studentId}/{documentId}.pdf
      ├── reports/
      │   ├── attainment/{reportId}.pdf
      │   ├── attendance/{reportId}.xlsx
      │   └── course-files/{reportId}.pdf
      ├── photos/
      │   ├── students/{studentId}.jpg
      │   └── faculty/{facultyId}.jpg
      └── uploads/{userId}/{fileId}.pdf

Upload Flow:
  Client → NestJS (validate) → R2 (store) → PostgreSQL (metadata) → Client (URL)

Download Flow:
  Client → NestJS (check permission) → Pre-signed URL (15 min) → Client downloads from R2

Security:
  - Type whitelist (pdf, jpg, png, xlsx, docx)
  - Size limit (50MB default, 100MB for reports)
  - Pre-signed URLs (time-limited)
  - Access control (public, department, program, private)
```

---

## 17. Real-time Communication

### Socket.io with Redis Adapter

```
Use Cases:
  1. Notifications    → New notification emitted to user's socket
  2. Live Attendance  → QR scan updates faculty's live count
  3. Marks Updates    → Students see updated marks in real-time
  4. Job Progress     → "Importing... 45/60" progress bar
  5. Collaborative    → Future: real-time document editing

Authentication:
  - JWT in handshake → verified → user attached to socket
  - Rooms: user:{userId}, tenant:{tenantId}, course:{courseOfferingId}

Flow:
  NestJS Event → Socket.io Gateway → Redis Pub/Sub → All instances → Client socket
```

---

## 18. Monitoring & Observability

```
Error Tracking:    Sentry (unhandled exceptions, source maps, performance)
Metrics:           Prometheus + Grafana (request rate, latency, errors)
Logging:           Pino (structured JSON) + Loki (aggregation, search)
Uptime:            Better Stack (HTTP checks every 1 min, SSL monitoring)
APM:               Slow query detection, bottleneck identification

Key Metrics:
  - Request rate (req/s)
  - Response time (p50, p95, p99)
  - Error rate (%)
  - Database query time (p95)
  - Cache hit rate (%)
  - Queue job duration
  - Active users

Alerts:
  - Error rate > 1%
  - Response time p95 > 1s
  - Database query time p95 > 500ms
  - Cache hit rate < 80%
  - Queue job failures > 5%
  - Uptime < 99.9%
```

---

## 19. Disaster Recovery Plan

```
Database Backups:
  - Automated pg_dump (daily at 2 AM)
  - Stored in R2 (separate bucket: eduobe-backups)
  - Retention: 30 days daily, 12 months monthly
  - Encrypted at rest (AES-256)
  - Tested restoration (quarterly)

File Backups:
  - R2 versioning enabled (30 days)
  - Cross-region replication (optional)

Recovery Targets:
  - RTO (Recovery Time Objective): 4 hours
  - RPO (Recovery Point Objective): 24 hours

High Availability (Future v2.0):
  - Multiple VPS instances (different data centers)
  - Load balancer (Caddy or HAProxy)
  - Database replication (primary + read replicas)
  - Redis Sentinel
  - Zero-downtime deployments

Uptime Target: 99.9% (8.7 hours downtime/year max)
```

---

## 20. Multi-Tenancy Strategy

### 20.1 Current: Single-Tenant with Multi-Tenant Columns

```
Strategy:
  - Every table has tenantId column from Day 1
  - Every query includes WHERE tenantId = :tenantId
  - MVP: Single tenant, no subdomain routing
  - v2.0: Activate multi-tenant (subdomain, tenant management UI)

Implementation:
  PrismaTenantService:
    - Wraps Prisma client
    - Auto-injects tenantId in every query
    - Validates tenant access on every request

Tenant Resolution:
  1. JWT token (tenantId in payload)
  2. X-Tenant-ID header (fallback)
  3. Subdomain (v2.0: vjti.eduobe.com → tenantId = vjti)

Benefits:
  - Zero refactoring when scaling to multi-tenant
  - Data isolation from Day 1
  - Simple to test (single tenant in dev)
```

### 20.2 Future: Multi-Tenant (v2.0)

```
Activation Steps:
  1. Enable subdomain routing (vjti.eduobe.com)
  2. Tenant management UI (create, configure, billing)
  3. Tenant-specific branding (logo, colors)
  4. Row-Level Security (RLS) in PostgreSQL
  5. Tenant isolation tests
  6. Billing integration (Stripe)

RLS Policy Example:
  CREATE POLICY tenant_isolation ON "Student"
    USING (tenant_id = current_setting('app.tenant_id')::text);
```

---

## 21. Architecture Decision Records (ADRs)

### ADR-001: Modular Monolith over Microservices

**Context:** Solo developer building an enterprise SaaS platform.
**Decision:** Use modular monolith with clear module boundaries.
**Rationale:** Simpler deployment, easier debugging, lower operational overhead. Can extract services later when team grows.
**Consequences:** Single deployable unit, shared database, event-driven module communication.

### ADR-002: PostgreSQL over MySQL

**Context:** Need a relational database with flexible schema support.
**Decision:** PostgreSQL 16 with JSONB, full-text search, pgvector.
**Rationale:** JSONB for dynamic configs (formulas, assessment types), pg_trgm for search, pgvector for future AI embeddings, better indexing options.
**Consequences:** Slightly higher learning curve, excellent feature set.

### ADR-003: Prisma over TypeORM/Drizzle

**Context:** Need a type-safe ORM for a large schema (40+ models).
**Decision:** Prisma 5 with declarative schema.
**Rationale:** Auto-generated types, great DX, migration management, type-safe queries. Schema-as-code approach.
**Consequences:** Some query limitations vs raw SQL, but sufficient for our use cases.

### ADR-004: Argon2id over bcrypt

**Context:** Need secure password hashing.
**Decision:** Argon2id (OWASP 2024 recommended).
**Rationale:** Memory-hard (resistant to GPU attacks), configurable parameters, winner of Password Hashing Competition.
**Consequences:** Slightly slower than bcrypt (intentional), requires argon2 npm package.

### ADR-005: BullMQ over Bull/Agenda

**Context:** Need background job processing for reports, imports, calculations.
**Decision:** BullMQ with Redis backend.
**Rationale:** Modern TypeScript-first library, great monitoring dashboard, priority queues, delayed jobs, retry strategies.
**Consequences:** Requires Redis (already in stack), learning curve for advanced features.

### ADR-006: Cloudflare R2 over AWS S3

**Context:** Need S3-compatible file storage.
**Decision:** Cloudflare R2.
**Rationale:** Zero egress fees (critical for report downloads), S3-compatible API, global CDN, 10GB free tier.
**Consequences:** Newer service, fewer features than S3, but sufficient for our needs.

### ADR-007: Caddy over Nginx

**Context:** Need a reverse proxy with HTTPS.
**Decision:** Caddy 2.
**Rationale:** Automatic HTTPS (Let's Encrypt), simple configuration (Caddyfile), HTTP/3 support, modern defaults.
**Consequences:** Less ecosystem than Nginx, but simpler for our use case.

### ADR-008: shadcn/ui over MUI/Ant Design

**Context:** Need a component library for the frontend.
**Decision:** shadcn/ui (copy-paste components built on Radix UI).
**Rationale:** Full control over code, beautiful defaults, accessible, Tailwind-native, no runtime overhead.
**Consequences:** Manual updates (no npm package), but complete customization.

### ADR-009: TanStack Query over Redux/SWR

**Context:** Need server state management.
**Decision:** TanStack Query v5.
**Rationale:** Auto-refetch, background updates, cache invalidation, pagination, infinite scroll, optimistic updates. Purpose-built for server state.
**Consequences:** Learning curve for cache key management, but excellent DX.

### ADR-010: Zustand over Redux/Jotai

**Context:** Need client state management (auth, UI).
**Decision:** Zustand.
**Rationale:** Minimal boilerplate, TypeScript-first, no providers needed, devtools support. Perfect for small client state.
**Consequences:** Less ecosystem than Redux, but sufficient for our needs.

---

## Phase 2 Checklist

- [x] Architecture style defined (Modular Monolith)
- [x] C4 Context diagram with all stakeholders and external systems
- [x] C4 Container diagram with all containers and interactions
- [x] C4 Component diagram for backend and frontend
- [x] Module dependency graph
- [x] Deployment architecture (Docker Compose, Caddy, VPS)
- [x] Environment configuration documented
- [x] Data architecture (schema groups, indexing, Redis structure)
- [x] Security architecture (6 layers, JWT strategy, RBAC flow)
- [x] Authentication flow (login, 2FA, refresh, reuse detection)
- [x] Authorization flow (Guards pipeline, scope filtering)
- [x] Rate limiting strategy
- [x] Module interaction diagrams (marks→attainment, attendance, bulk import)
- [x] API architecture (design principles, response format, endpoint catalog)
- [x] Frontend architecture (App Router, state management, component patterns)
- [x] Backend architecture (module structure, request pipeline, events)
- [x] Scalability strategy (horizontal scaling, performance targets)
- [x] Caching strategy (4 layers, invalidation)
- [x] Background job architecture (5 queues, lifecycle, retry)
- [x] File storage architecture (R2, bucket structure, upload/download flow)
- [x] Real-time communication (Socket.io, rooms, authentication)
- [x] Monitoring & observability (Sentry, Prometheus, Pino, Better Stack)
- [x] Disaster recovery plan (backups, RTO/RPO, HA strategy)
- [x] Multi-tenancy strategy (current + future activation plan)
- [x] 10 Architecture Decision Records (ADRs) with rationale

---

## Next Steps

**Phase 2 is complete.** Say **"PROCEED TO PHASE 3"** to generate the Monorepo Setup covering:
- Turborepo + pnpm workspace configuration
- Shared TypeScript, ESLint, Tailwind configs
- Package structure (shared, database, ui, config)
- Development scripts and tooling
- CI/CD pipeline setup
