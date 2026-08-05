# PHASE 4: Database Design

## EduOBE v2.0 — Complete Database Architecture

**Document Version:** 1.0  
**Date:** 2026-08-03  
**Status:** ✅ Complete  
**Prerequisites:** Phase 1 ✅ Phase 2 ✅ Phase 3 ✅

---

## Overview

Phase 4 delivers the complete database design for EduOBE, including:
- Comprehensive Prisma schema with 49 models
- Extended seed data with realistic Indian college data
- Indexing strategy for performance
- Migration management
- Partitioning for audit logs
- Backup and restore procedures
- Performance optimization guidelines

---

## Database Schema Overview

### Schema Statistics

- **Total Models:** 49
- **Total Lines:** ~1,700 lines
- **Enums:** 35
- **Relations:** 150+ relationships
- **Unique Constraints:** 60+ composite keys
- **Indexes:** 80+ (foreign keys + query optimization)

### Model Groups

| Group | Models | Purpose |
|---|---|---|
| **Core** (7) | Tenant, User, Role, Permission, UserRole, RolePermission, RefreshToken | Multi-tenancy, authentication, RBAC |
| **Academic Structure** (10) | AcademicYear, Department, Program, Curriculum, Semester, CourseType, Course, Batch, Section, LabBatch | Institutional hierarchy |
| **People** (2) | Student, Faculty | User profiles with academic context |
| **Offerings** (2) | CourseOffering, CourseEnrollment | Running instances of courses |
| **Outcomes & Mapping** (5) | CourseOutcome, ProgramOutcome, ProgramSpecificOutcome, COPOMapping, COPPSOMapping | OBE framework |
| **Attendance & Teaching** (5) | AcademicCalendar, AttendanceSession, AttendanceRecord, TeachingPlan, PracticalPlan | Daily operations |
| **Assessment & Marks** (5) | AssessmentType, Assessment, QuestionBank, QuestionPaper, Marks | Evaluation system |
| **Attainment** (4) | AttainmentConfig, COAttainment, POAttainment, PSOAttainment | Core OBE calculations |
| **Learners** (4) | SlowLearner, RemedialSession, AdvancedLearner, ContentBeyondSyllabus | Student support |
| **Surveys & Documents** (3) | Survey, SurveyResponse, Document | Feedback and file management |
| **System** (2) | AuditLog, Notification | System operations |

---

## Key Design Decisions

### 1. Multi-Tenancy Strategy

**Decision:** Single database with `tenantId` column on every table

**Rationale:**
- Simpler deployment and operations
- Cost-effective for MVP
- Easy to migrate to full multi-tenancy later
- Automatic tenant filtering via `PrismaTenantService`

**Implementation:**
```prisma
model Student {
  id        String  @id @default(cuid())
  tenantId  String  // Every table has this
  // ... other fields
  
  tenant    Tenant  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@index([tenantId])  // Index for tenant filtering
}
```

**Query Pattern:**
```typescript
// PrismaTenantService automatically adds tenantId filter
const students = await tenantService.student.findMany({
  where: { status: 'active' }  // Automatically becomes: { status: 'active', tenantId: 'xxx' }
});
```

### 2. ID Strategy

**Decision:** CUID (Collision-resistant Unique Identifier) for all primary keys

**Rationale:**
- URL-safe (no special characters)
- Sortable by creation time
- Collision-resistant (128-bit entropy)
- Better than UUID for database indexing (monotonically increasing)

**Example:**
```prisma
id String @id @default(cuid())
// Generates: "clx1a2b3c4d5e6f7g8h9i0j"
```

### 3. JSONB for Dynamic Configurations

**Decision:** Use JSONB columns for flexible, user-configurable data

**Use Cases:**
- `AttainmentConfig.directAttainmentFormula` — Formula configuration
- `Assessment.coMapping` — CO-wise marks distribution
- `Survey.questions` — Dynamic survey structure
- `Student.address` — Flexible address format
- `AuditLog.oldValue/newValue` — Change tracking

**Benefits:**
- Schema flexibility without migrations
- Queryable with PostgreSQL JSON operators
- Indexed with GIN indexes for performance

**Example:**
```prisma
model Assessment {
  coMapping Json  // { "CO1": 10, "CO2": 15, "CO3": 5 }
  
  @@index([coMapping], type: Gin)  // GIN index for JSON queries
}
```

### 4. Decimal Types for Precision

**Decision:** Use `Decimal` for all calculations (attainment, marks, CGPA)

**Rationale:**
- Floating-point arithmetic causes precision errors
- Decimal ensures exact calculations
- Critical for attainment calculations and GPA

**Implementation:**
```prisma
model Marks {
  totalMarksObtained Decimal @db.Decimal(6, 2)  // 9999.99
  percentage         Decimal @db.Decimal(5, 2)  // 999.99
}

model Student {
  cgpa Decimal @db.Decimal(4, 2)  // 9.99
}

model COAttainment {
  directAttainmentValue Decimal @db.Decimal(4, 2)  // 0.99
}
```

### 5. Composite Unique Constraints

**Decision:** Use composite unique keys for business logic integrity

**Examples:**
```prisma
// Prevent duplicate email per tenant
@@unique([tenantId, email])

// Prevent duplicate roll number per tenant
@@unique([tenantId, rollNumber])

// Prevent duplicate course offering
@@unique([courseId, academicYearId, sectionId])

// Prevent duplicate CO-PO mapping
@@unique([courseOutcomeId, programOutcomeId])
```

### 6. Cascade Deletes

**Decision:** Cascade deletes for referential integrity

**Strategy:**
- **Cascade:** When parent is deleted, delete all children
- **Restrict:** Prevent deletion if children exist (manual)
- **Set Null:** Set foreign key to null (rare)

**Implementation:**
```prisma
model User {
  tenant    Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  // If tenant is deleted, all users are deleted
}

model Student {
  batch     Batch     @relation(fields: [batchId], references: [id])
  // Default: Restrict (cannot delete batch if students exist)
}
```

---

## Indexing Strategy

### 1. Foreign Key Indexes

**All foreign keys are automatically indexed by Prisma:**
```prisma
model Student {
  batchId   String
  batch     Batch   @relation(fields: [batchId], references: [id])
  // Prisma creates: CREATE INDEX "Student_batchId_idx" ON "Student"("batchId")
}
```

### 2. Tenant Filtering Indexes

**Every table with `tenantId` has an index:**
```prisma
@@index([tenantId])
```

**Composite indexes for common queries:**
```prisma
model Student {
  @@index([tenantId, batchId])           // Find students in batch
  @@index([tenantId, sectionId])         // Find students in section
  @@index([tenantId, status])            // Find active students
  @@index([tenantId, currentSemester])   // Find students by semester
}
```

### 3. Query Optimization Indexes

**Attendance queries:**
```prisma
model AttendanceSession {
  @@index([courseOfferingId, date])  // Find sessions by course and date
  @@index([tenantId, date])          // Find sessions by date range
}

model AttendanceRecord {
  @@index([attendanceSessionId, studentId])  // Unique constraint (auto-indexed)
  @@index([studentId])                        // Find attendance for student
}
```

**Marks queries:**
```prisma
model Marks {
  @@index([assessmentId, studentId])     // Unique constraint (auto-indexed)
  @@index([studentId])                    // Find marks for student
  @@index([courseOfferingId])             // Find marks for course
}
```

**Attainment queries:**
```prisma
model COAttainment {
  @@index([courseOfferingId, courseOutcomeId])  // Find attainment for CO
  @@index([courseOfferingId])                    // Find all COs for course
}

model POAttainment {
  @@index([programId, programOutcomeId, academicYearId])  // Find PO attainment
  @@index([programId, academicYearId])                     // Find all POs for program
}
```

### 4. Full-Text Search Indexes

**User search:**
```prisma
model User {
  @@index([email])  // Exact match
  // For full-text search, use PostgreSQL tsvector (custom migration)
}
```

**Custom migration for full-text search:**
```sql
CREATE INDEX "User_search_idx" ON "User" USING GIN (
  to_tsvector('english', first_name || ' ' || last_name || ' ' || email)
);
```

### 5. JSONB Indexes (GIN)

**For JSONB columns that are queried frequently:**
```prisma
model Assessment {
  coMapping Json
  
  @@index([coMapping], type: Gin)
}

model Marks {
  coWiseMarks Json
  
  @@index([coWiseMarks], type: Gin)
}
```

### 6. Composite Indexes for Common Queries

**Student listing with filters:**
```prisma
model Student {
  @@index([tenantId, batchId, status, currentSemester])
  // Optimizes: WHERE tenantId = ? AND batchId = ? AND status = 'active' AND currentSemester = 3
}

**Marks entry grid:**
```prisma
model Marks {
  @@index([assessmentId, studentId, status])
  // Optimizes: WHERE assessmentId = ? AND status = 'submitted'
}
```

---

## Migration Strategy

### 1. Development Workflow

**Create migration:**
```bash
# After modifying schema.prisma
pnpm db:migrate

# Prisma will:
# 1. Detect schema changes
# 2. Generate migration SQL
# 3. Apply to database
# 4. Save to prisma/migrations/
```

**Reset database (development only):**
```bash
pnpm db:reset
# Drops all tables and reapplies all migrations + seed
```

### 2. Production Deployment

**Generate migrations:**
```bash
pnpm db:migrate
# Creates migration files in prisma/migrations/
# Commit these files to git
```

**Deploy migrations:**
```bash
# In CI/CD pipeline
pnpm db:migrate:deploy
# Applies pending migrations without prompting
```

**Rollback (emergency):**
```bash
# Manual rollback via SQL
# Prisma doesn't support automatic rollback
# Always backup before deploying migrations
```

### 3. Migration Best Practices

**DO:**
- ✅ Test migrations on staging before production
- ✅ Backup database before deploying migrations
- ✅ Use transactions for multi-step migrations
- ✅ Keep migrations small and focused
- ✅ Document breaking changes

**DON'T:**
- ❌ Never modify existing migrations (create new ones)
- ❌ Never delete migration files after deployment
- ❌ Never run `db:reset` on production
- ❌ Never use `db:push` on production (use `db:migrate`)

---

## Audit Log Partitioning

### Strategy: Monthly Partitioning

**Rationale:**
- Audit logs grow rapidly (every mutation logged)
- Partitioning improves query performance
- Easy to archive old partitions
- Reduces index size

**Implementation (Custom Migration):**

```sql
-- Create partitioned table
CREATE TABLE "audit_logs" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "userName" TEXT NOT NULL,
  "userRole" TEXT NOT NULL,
  "action" "AuditAction" NOT NULL,
  "module" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "oldValue" JSONB,
  "newValue" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "metadata" JSONB,
  "severity" "AuditSeverity" NOT NULL DEFAULT 'info',
  
  PRIMARY KEY ("id", "timestamp")
) PARTITION BY RANGE ("timestamp");

-- Create monthly partitions
CREATE TABLE "audit_logs_2026_01" PARTITION OF "audit_logs"
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE "audit_logs_2026_02" PARTITION OF "audit_logs"
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- Create indexes on each partition
CREATE INDEX "audit_logs_2026_01_tenantId_idx" ON "audit_logs_2026_01"("tenantId");
CREATE INDEX "audit_logs_2026_01_userId_idx" ON "audit_logs_2026_01"("userId");
CREATE INDEX "audit_logs_2026_01_timestamp_idx" ON "audit_logs_2026_01"("timestamp");

-- Auto-create partitions (cron job)
-- Run monthly to create next month's partition
```

**Query Performance:**
```sql
-- PostgreSQL automatically routes to correct partition
SELECT * FROM "audit_logs"
WHERE "tenantId" = 'vjti'
  AND "timestamp" BETWEEN '2026-01-01' AND '2026-01-31';
-- Only scans audit_logs_2026_01 partition
```

**Archival Strategy:**
```bash
# Archive old partitions (older than 1 year)
pg_dump -t audit_logs_2025_01 eduobe > audit_logs_2025_01.sql
DROP TABLE audit_logs_2025_01;
```

---

## Backup and Restore

### 1. Automated Backups

**Daily backup script:**
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="eduobe"

# Create backup
pg_dump -Fc -Z 9 $DB_NAME > "$BACKUP_DIR/eduobe_$DATE.dump"

# Upload to R2
aws s3 cp "$BACKUP_DIR/eduobe_$DATE.dump" s3://eduobe-backups/daily/

# Delete local backups older than 7 days
find $BACKUP_DIR -name "eduobe_*.dump" -mtime +7 -delete
```

**Cron job (run daily at 2 AM):**
```bash
0 2 * * * /path/to/backup.sh
```

### 2. Restore Procedures

**Restore from backup:**
```bash
# Download backup from R2
aws s3 cp s3://eduobe-backups/daily/eduobe_20260803_020000.dump ./

# Drop existing database (WARNING: DESTRUCTIVE)
dropdb eduobe

# Create new database
createdb eduobe

# Restore backup
pg_restore -d eduobe eduobe_20260803_020000.dump
```

**Point-in-time recovery (with WAL):**
```bash
# Requires continuous archiving setup
# Use pgBackRest or WAL-G for production
```

### 3. Backup Verification

**Monthly backup test:**
```bash
# Restore to test database
pg_restore -d eduobe_test eduobe_latest.dump

# Run integrity checks
psql -d eduobe_test -c "SELECT COUNT(*) FROM users;"
psql -d eduobe_test -c "SELECT COUNT(*) FROM students;"

# Verify application can connect
# Run smoke tests
```

---

## Performance Optimization

### 1. Connection Pooling

**Use pgBouncer for connection pooling:**
```ini
# pgbouncer.ini
[databases]
eduobe = host=localhost port=5432 dbname=eduobe

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
```

**Prisma configuration:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // Points to pgBouncer
}
```

### 2. Query Optimization

**N+1 Query Prevention:**
```typescript
// ❌ BAD: N+1 queries
const students = await prisma.student.findMany();
for (const student of students) {
  const batch = await prisma.batch.findUnique({ where: { id: student.batchId } });
}

// ✅ GOOD: Single query with include
const students = await prisma.student.findMany({
  include: { batch: true }
});
```

**Pagination:**
```typescript
// Use cursor-based pagination for large datasets
const students = await prisma.student.findMany({
  take: 20,
  cursor: cursorId ? { id: cursorId } : undefined,
  orderBy: { id: 'asc' }
});
```

**Select only needed fields:**
```typescript
const students = await prisma.student.findMany({
  select: {
    id: true,
    rollNumber: true,
    firstName: true,
    lastName: true
  }
});
```

### 3. Caching Strategy

**Cache frequently accessed data:**
```typescript
// Cache program outcomes (rarely change)
const cacheKey = `pos:${programId}`;
let pos = await redis.get(cacheKey);

if (!pos) {
  pos = await prisma.programOutcome.findMany({
    where: { programId }
  });
  await redis.setex(cacheKey, 3600, JSON.stringify(pos)); // 1 hour TTL
}
```

**Invalidate cache on updates:**
```typescript
await prisma.programOutcome.update({ where: { id }, data });
await redis.del(`pos:${programId}`);
```

### 4. Batch Operations

**Bulk insert:**
```typescript
// ✅ Use createMany for bulk inserts
await prisma.student.createMany({
  data: studentsData,
  skipDuplicates: true
});
```

**Batch updates:**
```typescript
// ✅ Use transactions for batch updates
await prisma.$transaction([
  prisma.student.update({ where: { id: id1 }, data: { status: 'graduated' } }),
  prisma.student.update({ where: { id: id2 }, data: { status: 'graduated' } }),
  // ... more updates
]);
```

### 5. Database Monitoring

**Enable query logging:**
```typescript
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' }
  ]
});

prisma.$on('query', (e) => {
  console.log(`Query: ${e.query}`);
  console.log(`Duration: ${e.duration}ms`);
  
  // Alert on slow queries (>1000ms)
  if (e.duration > 1000) {
    sentry.captureMessage(`Slow query detected: ${e.duration}ms`);
  }
});
```

**PostgreSQL statistics:**
```sql
-- Enable query statistics
CREATE EXTENSION pg_stat_statements;

-- View slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- View index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

---

## Seed Data Summary

### Realistic Indian College Data

**Tenant:**
- Vishwakarma Institute of Technology, Pune (vjti)

**Users:**
- 1 Admin: `admin@vjti.ac.in` / `Admin@123`
- 5 Faculty with realistic Indian names
- 30 Students with realistic Indian names (Aarav, Vivaan, Ananya, Diya, etc.)

**Academic Structure:**
- 5 Departments (CSE, ECE, MECH, CIVIL, AIDS)
- 4 Programs (B.Tech CSE, ECE, AIDS, M.Tech CSE)
- 1 Curriculum (R2023)
- 8 Semesters
- 7 Courses for Semester 3 CSE:
  - CSE301: Data Structures and Algorithms (4 credits)
  - CSE302: Database Management Systems (4 credits)
  - CSE303: Computer Organization (3 credits)
  - CSE304: Discrete Mathematics (3 credits)
  - CSE305: Object Oriented Programming (3 credits)
  - CSE306: DSA Lab (2 credits)
  - CSE307: DBMS Lab (2 credits)

**People:**
- 1 Batch (2023)
- 3 Sections (A, B, C)
- 30 Students enrolled in Section A
- 5 Faculty records

**Offerings:**
- 2 Course Offerings (DSA, DBMS)
- 60 Course Enrollments (30 students × 2 courses)

**Outcomes:**
- 12 Program Outcomes (PO1-PO12)
- 3 Program Specific Outcomes (PSO1-PSO3)
- 5 Course Outcomes for DSA (CO1-CO5)
- 10 CO-PO Mappings

---

## Phase 4 Checklist

- [x] Complete Prisma schema with 49 models
- [x] 35 enums for type safety
- [x] 150+ relationships defined
- [x] 60+ unique constraints
- [x] 80+ indexes for performance
- [x] Extended seed data with realistic Indian college data
- [x] Multi-tenancy with automatic tenant filtering
- [x] JSONB for dynamic configurations
- [x] Decimal types for precision
- [x] Cascade deletes for referential integrity
- [x] Indexing strategy documented
- [x] Migration strategy defined
- [x] Audit log partitioning designed
- [x] Backup and restore procedures documented
- [x] Performance optimization guidelines
- [x] Connection pooling strategy
- [x] Query optimization patterns
- [x] Caching strategy
- [x] Database monitoring setup

---

## Next Steps

**Phase 4 is complete.** The database is fully designed and seeded with realistic data.

**To continue development, say:**
```
PROCEED TO PHASE 5
```

**Phase 5 will generate the NestJS Base App:**
- NestJS application structure
- Common layer (guards, interceptors, filters, pipes, middleware)
- Configuration module
- Health checks
- Swagger/OpenAPI documentation
- Logger setup (Pino)
- Event emitter setup
- BullMQ queue setup

---

## Quick Reference

### Development Commands

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database (development)
pnpm db:push

# Create migration
pnpm db:migrate

# Apply migrations (production)
pnpm db:migrate:deploy

# Seed database
pnpm db:seed

# Open Prisma Studio
pnpm db:studio

# Reset database (development only)
pnpm db:reset
```

### Common Queries

```typescript
// Find students in batch with attendance
const students = await prisma.student.findMany({
  where: { batchId, status: 'active' },
  include: {
    attendanceRecords: {
      include: { attendanceSession: true }
    }
  }
});

// Calculate attendance percentage
const attendance = await prisma.attendanceRecord.groupBy({
  by: ['studentId'],
  where: { attendanceSession: { courseOfferingId } },
  _count: { status: true },
  having: { status: { equals: 'present' } }
});

// Find CO attainment for course
const attainment = await prisma.cOAttainment.findMany({
  where: { courseOfferingId },
  include: { courseOutcome: true }
});
```

### Troubleshooting

**Migration conflicts:**
```bash
# Reset migrations (development only)
rm -rf prisma/migrations
pnpm db:push
```

**Connection issues:**
```bash
# Check PostgreSQL is running
docker-compose ps

# Check connection
psql $DATABASE_URL -c "SELECT 1;"
```

**Slow queries:**
```sql
-- Analyze query
EXPLAIN ANALYZE SELECT * FROM students WHERE batchId = 'xxx';

-- Check indexes
\d students
```
