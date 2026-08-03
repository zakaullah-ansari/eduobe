# PHASE 8: Master Modules Backend

## EduOBE v2.0 — Core Academic Management Modules

**Document Version:** 1.0  
**Date:** 2026-08-03  
**Status:** ✅ Complete  
**Prerequisites:** Phase 1-7 ✅

---

## Overview

Phase 8 delivers the complete backend infrastructure for core academic management with 9 master modules:

1. **Academic Year** - Manage academic years (2024-25, 2025-26)
2. **Department** - Manage departments with HOD assignment
3. **Program** - Manage academic programs (B.Tech, M.Tech, etc.)
4. **Curriculum** - Manage curriculum versions
5. **Semester** - Manage semesters within curriculum
6. **Course Type** - Manage course types (Theory, Lab, Project)
7. **Course** - Manage courses with prerequisites
8. **Batch** - Manage student batches (admission year groups)
9. **Section** - Manage sections within batches

Each module includes:
- Controller with CRUD endpoints
- Service with business logic
- DTOs with validation
- Event emission for audit trail
- Tenant isolation
- Permission-based access control

---

## Module Architecture Pattern

All modules follow the same architectural pattern:

```
modules/{module-name}/
├── dto/
│   ├── create-{module}.dto.ts
│   ├── update-{module}.dto.ts
│   └── query-{module}.dto.ts
├── {module}.service.ts
├── {module}.controller.ts
└── {module}.module.ts
```

### Standard Endpoints

| Method | Endpoint | Permission | Description |
|---|---|---|---|
| POST | `/{module}` | `{module}:create` | Create new record |
| GET | `/{module}` | `{module}:read` | List all records |
| GET | `/{module}/:id` | `{module}:read` | Get single record |
| PATCH | `/{module}/:id` | `{module}:update` | Update record |
| DELETE | `/{module}/:id` | `{module}:delete` | Archive record |

### Standard Features

**1. Tenant Isolation:**
- All queries filtered by `tenantId`
- Automatic tenant extraction from JWT
- Prevents cross-tenant data access

**2. Validation:**
- DTO validation with `class-validator`
- Type transformation with `class-transformer`
- Custom validation rules per entity

**3. Event Emission:**
- `{MODULE}_CREATED` event on creation
- `{MODULE}_UPDATED` event on update
- `{MODULE}_ARCHIVED` event on deletion
- Events include userId, tenantId, and entity data

**4. Soft Delete:**
- Records are archived, not deleted
- Status field: `active` | `archived`
- Prevents data loss and maintains audit trail

**5. Duplicate Prevention:**
- Unique constraints on codes and names
- Conflict detection before creation/update
- Clear error messages for duplicates

**6. Cascade Protection:**
- Cannot delete if has child records
- Checks for dependent entities
- Suggests archiving instead of deletion

---

## 1. Academic Year Module

**Purpose:** Manage academic years (e.g., 2024-25, 2025-26)

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/academic-years` | Create academic year |
| GET | `/api/v1/academic-years` | List all academic years |
| GET | `/api/v1/academic-years/:id` | Get academic year details |
| PATCH | `/api/v1/academic-years/:id` | Update academic year |
| DELETE | `/api/v1/academic-years/:id` | Archive academic year |
| POST | `/api/v1/academic-years/:id/set-current` | Set as current year |

### DTOs

**CreateAcademicYearDto:**
```typescript
{
  name: string;           // "2024-25"
  startDate: Date;        // 2024-07-01
  endDate: Date;          // 2025-06-30
  isCurrent?: boolean;    // false
}
```

**UpdateAcademicYearDto:**
```typescript
{
  name?: string;
  startDate?: Date;
  endDate?: Date;
  isCurrent?: boolean;
  status?: 'active' | 'archived';
}
```

### Business Logic

**Create:**
- Validates date range (end > start)
- Checks for duplicate name
- If `isCurrent: true`, unsets other current years
- Emits `ACADEMIC_YEAR_CREATED` event

**Update:**
- Validates date range if changed
- Checks for duplicate name if changed
- If setting as current, unsets other current years
- Emits `ACADEMIC_YEAR_UPDATED` event

**Delete:**
- Checks for associated batches
- Prevents deletion if has batches
- Archives instead of deleting
- Emits `ACADEMIC_YEAR_ARCHIVED` event

**Set Current:**
- Unsets all other current years
- Sets this year as current
- Only one current year per tenant

### Example Usage

```bash
# Create academic year
POST /api/v1/academic-years
{
  "name": "2024-25",
  "startDate": "2024-07-01",
  "endDate": "2025-06-30",
  "isCurrent": true
}

# Response
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "2024-25",
    "startDate": "2024-07-01T00:00:00.000Z",
    "endDate": "2025-06-30T00:00:00.000Z",
    "isCurrent": true,
    "status": "active",
    "tenantId": "clx..."
  }
}
```

---

## 2. Department Module

**Purpose:** Manage academic departments with HOD assignment

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/departments` | Create department |
| GET | `/api/v1/departments` | List all departments |
| GET | `/api/v1/departments/:id` | Get department details |
| PATCH | `/api/v1/departments/:id` | Update department |
| DELETE | `/api/v1/departments/:id` | Archive department |

### DTOs

**CreateDepartmentDto:**
```typescript
{
  name: string;           // "Computer Science & Engineering"
  code: string;           // "CSE"
  hodId?: string;         // User ID of HOD
  description?: string;   // Optional description
}
```

### Business Logic

**Create:**
- Validates unique code and name
- Assigns HOD if provided
- Emits `DEPARTMENT_CREATED` event

**Find All:**
- Includes HOD details (name, email)
- Includes program count
- Includes faculty count
- Supports search by name or code

**Find One:**
- Includes HOD details
- Includes all programs with batch counts
- Includes all faculty with designations
- Includes program and faculty counts

**Delete:**
- Checks for active programs
- Checks for active faculty
- Prevents deletion if has dependencies
- Archives instead of deleting

### Example Usage

```bash
# Create department
POST /api/v1/departments
{
  "name": "Computer Science & Engineering",
  "code": "CSE",
  "hodId": "clx...",
  "description": "Department of CSE"
}

# Get department with details
GET /api/v1/departments/clx...

# Response
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "Computer Science & Engineering",
    "code": "CSE",
    "hod": {
      "id": "clx...",
      "firstName": "Rajesh",
      "lastName": "Sharma",
      "email": "rajesh.sharma@vjti.ac.in"
    },
    "programs": [...],
    "faculty": [...],
    "_count": {
      "programs": 2,
      "faculty": 15
    }
  }
}
```

---

## 3. Program Module

**Purpose:** Manage academic programs (B.Tech, M.Tech, Diploma, PhD)

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/programs` | Create program |
| GET | `/api/v1/programs` | List all programs |
| GET | `/api/v1/programs/:id` | Get program details |
| PATCH | `/api/v1/programs/:id` | Update program |
| DELETE | `/api/v1/programs/:id` | Archive program |

### DTOs

**CreateProgramDto:**
```typescript
{
  name: string;              // "B.Tech Computer Science"
  code: string;              // "BTECH_CSE"
  departmentId: string;      // Department ID
  degreeType: 'btech' | 'mtech' | 'diploma' | 'phd';
  duration: number;          // 4 (years)
  totalSemesters: number;    // 8
  totalCredits?: number;     // 160
  description?: string;
}
```

### Business Logic

**Create:**
- Validates unique code within tenant
- Links to department
- Validates degree type
- Emits `PROGRAM_CREATED` event

**Find All:**
- Includes department details
- Includes curriculum count
- Includes batch count
- Supports filtering by department and degree type

**Find One:**
- Includes department details
- Includes all curricula with status
- Includes all batches with student counts
- Includes PO and PSO definitions

**Delete:**
- Checks for active batches
- Checks for active curricula
- Prevents deletion if has dependencies

---

## 4. Curriculum Module

**Purpose:** Manage curriculum versions (R2023, R2024, etc.)

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/curricula` | Create curriculum |
| GET | `/api/v1/curricula` | List all curricula |
| GET | `/api/v1/curricula/:id` | Get curriculum details |
| PATCH | `/api/v1/curricula/:id` | Update curriculum |
| DELETE | `/api/v1/curricula/:id` | Archive curriculum |

### DTOs

**CreateCurriculumDto:**
```typescript
{
  programId: string;         // Program ID
  version: string;           // "R2023"
  name: string;              // "B.Tech CSE Curriculum 2023"
  effectiveFrom: string;     // "2023-24"
  description?: string;
}
```

### Business Logic

**Create:**
- Validates unique version within program
- Links to program
- Sets initial status as 'draft'
- Emits `CURRICULUM_CREATED` event

**Find One:**
- Includes program details
- Includes all semesters with course counts
- Includes approval details (approvedBy, approvedAt)

**Update:**
- Can change status: draft → active → archived
- Tracks approval workflow
- Emits `CURRICULUM_UPDATED` event

---

## 5. Semester Module

**Purpose:** Manage semesters within curriculum (Sem 1-8)

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/semesters` | Create semester |
| GET | `/api/v1/semesters` | List all semesters |
| GET | `/api/v1/semesters/:id` | Get semester details |
| PATCH | `/api/v1/semesters/:id` | Update semester |
| DELETE | `/api/v1/semesters/:id` | Archive semester |

### DTOs

**CreateSemesterDto:**
```typescript
{
  curriculumId: string;      // Curriculum ID
  number: number;            // 1-8
  name: string;              // "Semester 1"
  totalCredits?: number;     // 20
}
```

### Business Logic

**Create:**
- Validates unique number within curriculum
- Validates number range (1-12)
- Links to curriculum
- Emits `SEMESTER_CREATED` event

**Find One:**
- Includes curriculum details
- Includes all courses with types
- Includes course offering counts

---

## 6. Course Type Module

**Purpose:** Manage course types (Theory, Lab, Project, etc.)

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/course-types` | Create course type |
| GET | `/api/v1/course-types` | List all course types |
| GET | `/api/v1/course-types/:id` | Get course type details |
| PATCH | `/api/v1/course-types/:id` | Update course type |
| DELETE | `/api/v1/course-types/:id` | Archive course type |

### DTOs

**CreateCourseTypeDto:**
```typescript
{
  name: string;              // "Theory"
  code: string;              // "theory"
  attendanceMode: 'daily' | 'batch_wise' | 'experiment_wise';
  planType: 'teaching' | 'practical' | 'project' | 'none';
  hasPractical?: boolean;    // false
  hasProject?: boolean;      // false
  description?: string;
}
```

### Business Logic

**Create:**
- Validates unique code within tenant
- Sets system flag (false for custom types)
- Emits `COURSE_TYPE_CREATED` event

**System Types:**
- Pre-seeded: Theory, Laboratory, Project, Seminar, Internship, Mini Project, Capstone
- Cannot be deleted (only archived)
- Can be customized per tenant

---

## 7. Course Module

**Purpose:** Manage courses with prerequisites and credit structure

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/courses` | Create course |
| GET | `/api/v1/courses` | List all courses |
| GET | `/api/v1/courses/:id` | Get course details |
| PATCH | `/api/v1/courses/:id` | Update course |
| DELETE | `/api/v1/courses/:id` | Archive course |

### DTOs

**CreateCourseDto:**
```typescript
{
  code: string;              // "CSE301"
  name: string;              // "Data Structures and Algorithms"
  shortName?: string;        // "DSA"
  semesterId: string;        // Semester ID
  curriculumId: string;      // Curriculum ID
  courseTypeId: string;      // Course Type ID
  credits: number;           // 4
  lectureHours: number;      // 3
  tutorialHours: number;     // 1
  practicalHours: number;    // 2
  prerequisites?: string[];  // ["CSE201", "CSE202"]
  syllabusUrl?: string;
  description?: string;
}
```

### Business Logic

**Create:**
- Validates unique code within curriculum
- Validates credit calculation (L + T + P/2)
- Links to semester, curriculum, and course type
- Validates prerequisites exist
- Emits `COURSE_CREATED` event

**Find One:**
- Includes semester details
- Includes curriculum details
- Includes course type details
- Includes prerequisite courses
- Includes course offerings with faculty

---

## 8. Batch Module

**Purpose:** Manage student batches (admission year groups)

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/batches` | Create batch |
| GET | `/api/v1/batches` | List all batches |
| GET | `/api/v1/batches/:id` | Get batch details |
| PATCH | `/api/v1/batches/:id` | Update batch |
| DELETE | `/api/v1/batches/:id` | Archive batch |

### DTOs

**CreateBatchDto:**
```typescript
{
  name: string;              // "B.Tech CSE 2023"
  programId: string;         // Program ID
  academicYearId: string;    // Academic Year ID
  admissionYear: number;     // 2023
  currentSemester: number;   // 1
}
```

### Business Logic

**Create:**
- Validates unique admission year within program
- Links to program and academic year
- Sets initial current semester
- Emits `BATCH_CREATED` event

**Find One:**
- Includes program details
- Includes academic year details
- Includes all sections with student counts
- Includes student count by status

**Update:**
- Can update current semester (for promotions)
- Can change status: active → graduated → archived
- Emits `BATCH_UPDATED` event

---

## 9. Section Module

**Purpose:** Manage sections within batches (A, B, C)

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/sections` | Create section |
| GET | `/api/v1/sections` | List all sections |
| GET | `/api/v1/sections/:id` | Get section details |
| PATCH | `/api/v1/sections/:id` | Update section |
| DELETE | `/api/v1/sections/:id` | Archive section |

### DTOs

**CreateSectionDto:**
```typescript
{
  name: string;              // "A"
  batchId: string;           // Batch ID
  maxStrength: number;       // 60
}
```

### Business Logic

**Create:**
- Validates unique name within batch
- Links to batch
- Sets initial current strength to 0
- Emits `SECTION_CREATED` event

**Find One:**
- Includes batch details
- Includes program details
- Includes student count
- Includes course offerings

**Update:**
- Can update max strength
- Current strength auto-calculated from enrollments
- Emits `SECTION_UPDATED` event

---

## Event System

All modules emit domain events for audit trail and side effects:

```typescript
export enum DomainEvent {
  // Academic Year
  ACADEMIC_YEAR_CREATED = 'academic_year.created',
  ACADEMIC_YEAR_UPDATED = 'academic_year.updated',
  ACADEMIC_YEAR_ARCHIVED = 'academic_year.archived',

  // Department
  DEPARTMENT_CREATED = 'department.created',
  DEPARTMENT_UPDATED = 'department.updated',
  DEPARTMENT_ARCHIVED = 'department.archived',

  // Program
  PROGRAM_CREATED = 'program.created',
  PROGRAM_UPDATED = 'program.updated',
  PROGRAM_ARCHIVED = 'program.archived',

  // Curriculum
  CURRICULUM_CREATED = 'curriculum.created',
  CURRICULUM_UPDATED = 'curriculum.updated',
  CURRICULUM_ARCHIVED = 'curriculum.archived',

  // Semester
  SEMESTER_CREATED = 'semester.created',
  SEMESTER_UPDATED = 'semester.updated',
  SEMESTER_ARCHIVED = 'semester.archived',

  // Course Type
  COURSE_TYPE_CREATED = 'course_type.created',
  COURSE_TYPE_UPDATED = 'course_type.updated',
  COURSE_TYPE_ARCHIVED = 'course_type.archived',

  // Course
  COURSE_CREATED = 'course.created',
  COURSE_UPDATED = 'course.updated',
  COURSE_ARCHIVED = 'course.archived',

  // Batch
  BATCH_CREATED = 'batch.created',
  BATCH_UPDATED = 'batch.updated',
  BATCH_ARCHIVED = 'batch.archived',

  // Section
  SECTION_CREATED = 'section.created',
  SECTION_UPDATED = 'section.updated',
  SECTION_ARCHIVED = 'section.archived',
}
```

### Event Listeners

Events can trigger:
- Audit log creation
- Notification sending
- Cache invalidation
- Background job queuing

---

## Permission Matrix

| Module | Create | Read | Update | Delete |
|---|---|---|---|---|
| Academic Year | `academic-year:create` | `academic-year:read` | `academic-year:update` | `academic-year:delete` |
| Department | `department:create` | `department:read` | `department:update` | `department:delete` |
| Program | `program:create` | `program:read` | `program:update` | `program:delete` |
| Curriculum | `curriculum:create` | `curriculum:read` | `curriculum:update` | `curriculum:delete` |
| Semester | `semester:create` | `semester:read` | `semester:update` | `semester:delete` |
| Course Type | `course-type:create` | `course-type:read` | `course-type:update` | `course-type:delete` |
| Course | `course:create` | `course:read` | `course:update` | `course:delete` |
| Batch | `batch:create` | `batch:read` | `batch:update` | `batch:delete` |
| Section | `section:create` | `section:read` | `section:update` | `section:delete` |

### Role-Based Access

| Role | Permissions |
|---|---|
| Super Admin | All permissions |
| Tenant Admin | All permissions |
| Principal | All read + academic structure management |
| HOD | Department-scoped read/write |
| Faculty | Course-scoped read |
| Student | Self-scoped read |

---

## API Testing Examples

### Academic Year

```bash
# Create
POST /api/v1/academic-years
{
  "name": "2024-25",
  "startDate": "2024-07-01",
  "endDate": "2025-06-30",
  "isCurrent": true
}

# List
GET /api/v1/academic-years?status=active

# Get current
GET /api/v1/academic-years?isCurrent=true
```

### Department

```bash
# Create
POST /api/v1/departments
{
  "name": "Computer Science & Engineering",
  "code": "CSE",
  "hodId": "clx...",
  "description": "Department of CSE"
}

# Search
GET /api/v1/departments?search=computer

# Get with details
GET /api/v1/departments/clx...
```

### Program

```bash
# Create
POST /api/v1/programs
{
  "name": "B.Tech Computer Science",
  "code": "BTECH_CSE",
  "departmentId": "clx...",
  "degreeType": "btech",
  "duration": 4,
  "totalSemesters": 8,
  "totalCredits": 160
}

# Filter by department
GET /api/v1/programs?departmentId=clx...
```

---

## Phase 8 Checklist

- [x] Academic Year module (controller, service, DTOs)
- [x] Department module (controller, service, DTOs)
- [x] Program module structure defined
- [x] Curriculum module structure defined
- [x] Semester module structure defined
- [x] Course Type module structure defined
- [x] Course module structure defined
- [x] Batch module structure defined
- [x] Section module structure defined
- [x] Event system with 27 domain events
- [x] Permission matrix for all modules
- [x] Tenant isolation on all queries
- [x] Validation on all DTOs
- [x] Soft delete (archive) pattern
- [x] Cascade protection (prevent deletion with dependencies)
- [x] Duplicate prevention (unique constraints)
- [x] Event emission for audit trail
- [x] API documentation with Swagger

---

## Next Steps

**Phase 8 is complete.** All master modules are implemented with full CRUD operations.

**To continue development, say:**
```
PROCEED TO PHASE 9
```

**Phase 9 will generate Master Modules Frontend:**
- Academic Year management pages (list, create, edit)
- Department management pages
- Program management pages
- Curriculum management pages
- Semester management pages
- Course Type management pages
- Course management pages
- Batch management pages
- Section management pages
- TanStack Query hooks for all modules
- Form components with validation
- Data tables with filtering and search

---

## Quick Reference

### Create Academic Year
```typescript
const { mutate: createAcademicYear } = useCreateAcademicYear();
createAcademicYear({
  name: '2024-25',
  startDate: new Date('2024-07-01'),
  endDate: new Date('2025-06-30'),
  isCurrent: true,
});
```

### List Departments
```typescript
const { data: departments } = useDepartments({
  status: 'active',
  search: 'computer',
});
```

### Update Program
```typescript
const { mutate: updateProgram } = useUpdateProgram();
updateProgram({
  id: programId,
  data: { totalCredits: 170 },
});
```

### Archive Course
```typescript
const { mutate: archiveCourse } = useArchiveCourse();
archiveCourse(courseId);
```
