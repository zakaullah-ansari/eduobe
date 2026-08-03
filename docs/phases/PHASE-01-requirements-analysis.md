# PHASE 1: Requirements Analysis & User Stories

## EduOBE v2.0 — Outcome-Based Education & NBA Accreditation Platform

**Document Version:** 1.0  
**Date:** 2026-08-03  
**Status:** ✅ Complete

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Stakeholder Analysis](#2-stakeholder-analysis)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [System Constraints & Assumptions](#5-system-constraints--assumptions)
6. [Compliance Requirements](#6-compliance-requirements)
7. [Data Flow Diagrams](#7-data-flow-diagrams)
8. [Risk Assessment Matrix](#8-risk-assessment-matrix)
9. [User Stories](#9-user-stories)
10. [Acceptance Criteria](#10-acceptance-criteria)
11. [Technical Decisions Log](#11-technical-decisions-log)
12. [MVP vs Post-MVP Scope](#12-mvp-vs-post-mvp-scope)
13. [Success Metrics](#13-success-metrics)

---

## 1. Executive Summary

### Problem Statement

Engineering colleges in India face a critical challenge: **40%+ of faculty time is consumed by manual OBE documentation** — maintaining spreadsheets for CO-PO mapping, performing manual attainment calculations, tracking paper-based attendance, and managing disconnected assessment records. NBA (National Board of Accreditation) accreditation preparation takes **6+ months of document compilation**, often leading to incomplete submissions and accreditation failures.

### Solution: EduOBE

EduOBE is a **next-generation, enterprise-grade, multi-tenant SaaS platform** that automates the entire Outcome-Based Education lifecycle:

- **Academic Management** — Departments, programs, curricula, batches, sections
- **OBE Automation** — CO-PO-PSO mapping, attainment calculation, gap analysis
- **Assessment Engine** — Dynamic assessment types, marks management, question banks
- **Attendance System** — Manual, QR-based, bulk import with analytics
- **NBA Accreditation** — Automated report generation, audit trails, compliance dashboards
- **Student Intelligence** — Slow learner detection, remedial tracking, advanced learner enrichment
- **Reporting** — 18+ report types (PDF + Excel) for all NBA criteria

### Value Proposition

| Stakeholder | Before EduOBE | After EduOBE |
|---|---|---|
| Faculty | 15+ hours/week on manual OBE docs | 2 hours/week (85% reduction) |
| HOD | Fragmented Excel-based tracking | Real-time department dashboard |
| NBA Coordinator | 6-month accreditation prep | 1-click NBA report generation |
| Principal | No visibility into institutional quality | Institutional analytics dashboard |
| Student | No transparency on performance | Real-time attainment & feedback |
| Parent | No academic visibility | Parent portal with alerts |

### Market Context

- **5,000+** engineering colleges in India (AICTE data)
- **2,500+** need NBA accreditation (mandatory for top rankings)
- **₹50,000–₹5,00,000/year** per institution SaaS pricing potential
- **TAM: ₹2,500+ Cr** (Indian EdTech academic management segment)

---

## 2. Stakeholder Analysis

### 2.1 Role Personas

#### R0: Super Admin (SaaS Operator)
**Name:** Vikram | **Age:** 35 | **Tech Level:** Expert  
**Context:** Manages the EduOBE platform, onboards new colleges, monitors system health.  
**Goals:** Maximize platform uptime, onboard 50+ colleges in Year 1, minimize support tickets.  
**Pain Points:** Manual tenant provisioning, no visibility into usage patterns.  
**Key Needs:** Tenant management, usage analytics, system monitoring, billing.

#### R1: Tenant Admin (College IT Administrator)
**Name:** Suresh | **Age:** 42 | **Tech Level:** Intermediate  
**Context:** IT head at a mid-size engineering college with 2,000 students.  
**Goals:** Set up the platform, manage users/roles, integrate with existing systems.  
**Pain Points:** Manual user creation for 200+ faculty, role confusion, data migration.  
**Key Needs:** Bulk user import, role management, tenant configuration, audit trail.

#### R2: Principal
**Name:** Dr. Meena Kulkarni | **Age:** 58 | **Tech Level:** Basic  
**Context:** Principal of an autonomous engineering college preparing for NAAC A++ grading.  
**Goals:** Institutional quality visibility, data-driven decisions, regulatory compliance.  
**Pain Points:** No single dashboard for institutional health, late reports from departments.  
**Key Needs:** Principal dashboard, department comparison, NAAC metrics, accreditation status.

#### R3: HOD (Head of Department)
**Name:** Dr. Rajesh Sharma | **Age:** 50 | **Tech Level:** Intermediate  
**Context:** HOD of Computer Science with 25 faculty and 600 students.  
**Goals:** Department-level OBE compliance, faculty workload optimization, student performance monitoring.  
**Pain Points:** Tracking 15+ course offerings per semester, manual CO-PO mapping review, slow student identification delays.  
**Key Needs:** Department dashboard, faculty allocation, attainment overview, approval workflows.

#### R4: IQAC Coordinator (Internal Quality Assurance Cell)
**Name:** Dr. Anita Desai | **Age:** 48 | **Tech Level:** Intermediate  
**Context:** Coordinates quality assurance across all departments for NAAC compliance.  
**Goals:** Centralized quality metrics, cross-department benchmarking, audit readiness.  
**Pain Points:** Collecting data from 8 departments manually, no historical trend analysis.  
**Key Needs:** IQAC dashboard, cross-department analytics, quality reports, trend analysis.

#### R5: NBA Coordinator
**Name:** Prof. Kavita Joshi | **Age:** 44 | **Tech Level:** Intermediate  
**Context:** Leads NBA accreditation preparation for B.Tech CSE program.  
**Goals:** Complete NBA documentation, attainment compliance, gap identification.  
**Pain Points:** 6-month manual compilation, inconsistent CO-PO mappings across courses, no gap visibility.  
**Key Needs:** NBA dashboard, attainment configuration, gap analysis, automated reports.

#### R6: Program Coordinator
**Name:** Prof. Sanjay Gupta | **Age:** 40 | **Tech Level:** Intermediate  
**Context:** Coordinates B.Tech CSE program across 8 semesters.  
**Goals:** Curriculum coherence, course scheduling, student progression tracking.  
**Pain Points:** Managing curriculum changes, tracking batch progress, coordinating faculty.  
**Key Needs:** Program overview, curriculum management, batch tracking, student progression.

#### R7: Faculty
**Name:** Prof. Amit Deshmukh | **Age:** 32 | **Tech Level:** Advanced  
**Context:** Assistant Professor teaching 3 courses per semester, each with 60 students.  
**Goals:** Efficient marks entry, attendance tracking, CO attainment monitoring.  
**Pain Points:** Manual CO-wise marks calculation, attendance tracking across theory + lab, student performance analysis.  
**Key Needs:** Faculty dashboard, attendance marking (QR + manual), marks entry grid, attainment view, slow learner alerts.

#### R8: Lab Instructor
**Name:** Ramesh Yadav | **Age:** 38 | **Tech Level:** Basic  
**Context:** Manages 4 lab batches per semester for DSA Lab and DBMS Lab.  
**Goals:** Experiment-wise attendance, practical marks entry, lab manual management.  
**Pain Points:** Tracking 20-student batches separately, experiment completion tracking.  
**Key Needs:** Batch-wise attendance, practical plan tracking, experiment marks entry.

#### R9: Student
**Name:** Aarav Mehta | **Age:** 19 | **Tech Level:** Advanced  
**Context:** 2nd year B.Tech CSE student.  
**Goals:** Track attendance, view marks, understand CO attainment, identify weak areas.  
**Pain Points:** No visibility into attainment levels, unclear on which COs need improvement.  
**Key Needs:** Student dashboard, attendance percentage, marks view, attainment status, remedial alerts.

#### R10: External Auditor (NBA/NAAC)
**Name:** Dr. P.R. Krishnan | **Age:** 60 | **Tech Level:** Basic  
**Context:** NBA peer evaluation team member, reviews 5+ colleges per year.  
**Goals:** Quick access to documentation, verify attainment calculations, audit trail review.  
**Pain Points:** Paper-based documentation, inconsistent formats across colleges, no digital audit trail.  
**Key Needs:** Read-only access to course files, attainment reports, audit logs, downloadable reports.

#### R11: Parent
**Name:** Sunita Mehta | **Age:** 45 | **Tech Level:** Basic  
**Context:** Parent of Aarav, wants to monitor academic progress.  
**Goals:** Track child's attendance, performance, and overall academic health.  
**Pain Points:** No academic visibility until result day, no early warning for poor performance.  
**Key Needs:** Child's attendance %, marks summary, performance alerts, teacher communication.

### 2.2 Stakeholder Priority Matrix

| Stakeholder | Frequency | Priority | Revenue Impact |
|---|---|---|---|
| Faculty (R7) | Daily | P0 | Core user — retention driver |
| HOD (R3) | Daily | P0 | Decision maker — buying authority |
| Student (R9) | Daily | P0 | Volume user — engagement metric |
| NBA Coordinator (R5) | Weekly | P0 | Value differentiator |
| Principal (R2) | Weekly | P1 | Executive sponsor |
| Tenant Admin (R1) | Monthly | P1 | Onboarding success |
| IQAC Coordinator (R4) | Weekly | P1 | Compliance driver |
| Program Coordinator (R6) | Weekly | P1 | Operational efficiency |
| Lab Instructor (R8) | Daily | P2 | Supporting user |
| External Auditor (R10) | Yearly | P2 | Validation value |
| Parent (R11) | Monthly | P2 | Engagement add-on |
| Super Admin (R0) | Daily | Internal | Platform operations |

---

## 3. Functional Requirements

### Module Priority Classification

- **P0 (Must Have for MVP):** Core functionality without which the platform has no value
- **P1 (Should Have for MVP):** Important features that significantly improve usability
- **P2 (Nice to Have / Post-MVP):** Features that add polish but aren't blockers

### 3.1 Authentication & Authorization (P0)

| ID | Requirement | Priority |
|---|---|---|
| AUTH-001 | Email/password login with Argon2id hashing | P0 |
| AUTH-002 | JWT access tokens (15 min) + refresh tokens (7 days, httpOnly cookie) | P0 |
| AUTH-003 | Token rotation with family-based reuse detection | P0 |
| AUTH-004 | TOTP-based 2FA (Google Authenticator compatible) | P0 |
| AUTH-005 | Role-Based Access Control (RBAC) with 12 default roles | P0 |
| AUTH-006 | Permission-based access (resource:action:scope) | P0 |
| AUTH-007 | Account lockout after 5 failed attempts (15 min cooldown) | P0 |
| AUTH-008 | Password reset via email | P0 |
| AUTH-009 | Email verification | P1 |
| AUTH-010 | Session management (view active sessions, revoke) | P1 |
| AUTH-011 | SSO integration (Google Workspace, Microsoft) | P2 |
| AUTH-012 | LDAP/AD integration for enterprise colleges | P2 |

### 3.2 Academic Structure (P0)

| ID | Requirement | Priority |
|---|---|---|
| ACAD-001 | Academic year CRUD with activation | P0 |
| ACAD-002 | Department management with HOD assignment | P0 |
| ACAD-003 | Program management (B.Tech, M.Tech, Diploma, PhD) | P0 |
| ACAD-004 | Curriculum versioning (R2023, R2024, etc.) | P0 |
| ACAD-005 | Semester management within curriculum | P0 |
| ACAD-006 | Dynamic course types (Theory, Lab, Project, Seminar, etc.) | P0 |
| ACAD-007 | Course CRUD with prerequisites, credits, hours | P0 |
| ACAD-008 | Batch management (admission year based) | P0 |
| ACAD-009 | Section management within batches | P0 |
| ACAD-010 | Course offering (running instance per semester) | P0 |
| ACAD-011 | Academic calendar with holidays, events, exams | P1 |
| ACAD-012 | Curriculum cloning for new versions | P1 |
| ACAD-013 | Working days calculation | P1 |
| ACAD-014 | Lab batch management within sections | P0 |

### 3.3 Student Management (P0)

| ID | Requirement | Priority |
|---|---|---|
| STU-001 | Student CRUD with comprehensive profile | P0 |
| STU-002 | Bulk import via Excel (with validation) | P0 |
| STU-003 | Student export to Excel | P0 |
| STU-004 | Semester promotion (batch-level) | P0 |
| STU-005 | Student profile with academic history | P0 |
| STU-006 | Course enrollment management | P0 |
| STU-007 | Student performance tracking | P1 |
| STU-008 | Guardian/parent information | P1 |
| STU-009 | Document attachment to student profile | P1 |
| STU-010 | Student search with filters (batch, section, category, status) | P0 |
| STU-011 | Student photo upload | P2 |
| STU-012 | Alumni tracking | P2 |

### 3.4 Faculty Management (P0)

| ID | Requirement | Priority |
|---|---|---|
| FAC-001 | Faculty CRUD with comprehensive profile | P0 |
| FAC-002 | Bulk import via Excel | P0 |
| FAC-003 | Course allocation (faculty to course offering) | P0 |
| FAC-004 | Workload calculation and view | P0 |
| FAC-005 | Faculty-wise course listing | P0 |
| FAC-006 | Publication and research tracking | P1 |
| FAC-007 | Faculty search with department filters | P0 |
| FAC-008 | Faculty appraisal data | P2 |

### 3.5 Course Outcomes (P0)

| ID | Requirement | Priority |
|---|---|---|
| CO-001 | Define COs per course offering (CO1-CO6 typical) | P0 |
| CO-002 | Bloom's Taxonomy level assignment (L1-L6) | P0 |
| CO-003 | Target attainment level setting per CO | P0 |
| CO-004 | CO approval workflow (Faculty → HOD → NBA Coordinator) | P1 |
| CO-005 | CO versioning and change tracking | P1 |
| CO-006 | AI-generated CO suggestions from syllabus | P2 |

### 3.6 Program Outcomes & PSOs (P0)

| ID | Requirement | Priority |
|---|---|---|
| PO-001 | Standard NBA PO1-PO12 per program | P0 |
| PO-002 | Custom PO addition per program | P0 |
| PO-003 | PSO definition per program (PSO1-PSO4 typical) | P0 |
| PO-004 | PO/PSO archival | P1 |

### 3.7 CO-PO-PSO Mapping (P0)

| ID | Requirement | Priority |
|---|---|---|
| MAP-001 | Interactive mapping matrix (COs × POs + PSOs) | P0 |
| MAP-002 | Three-level mapping (1=Low, 2=Medium, 3=High) | P0 |
| MAP-003 | Justification text per mapping | P1 |
| MAP-004 | Matrix export to Excel | P0 |
| MAP-005 | Matrix import from Excel | P1 |
| MAP-006 | Mapping approval workflow | P1 |
| MAP-007 | Visual heat map of mapping strength | P1 |

### 3.8 Attendance System (P0)

| ID | Requirement | Priority |
|---|---|---|
| ATT-001 | Create attendance session (date, period, type) | P0 |
| ATT-002 | Manual attendance marking (present/absent/late/excused) | P0 |
| ATT-003 | QR code-based attendance (student scans) | P1 |
| ATT-004 | Bulk import attendance from Excel | P1 |
| ATT-005 | Attendance analytics (% per student, trend charts) | P0 |
| ATT-006 | Defaulter identification (below 75%) | P0 |
| ATT-007 | Session locking (prevent changes after confirmation) | P0 |
| ATT-008 | Lab batch-wise attendance | P0 |
| ATT-009 | Topic/CO tracking per session | P1 |
| ATT-010 | Attendance alerts/notifications for defaulters | P1 |
| ATT-011 | Geo-fenced QR attendance | P2 |

### 3.9 Teaching Plan (P0)

| ID | Requirement | Priority |
|---|---|---|
| TP-001 | Unit-wise teaching plan creation | P0 |
| TP-002 | Topic and sub-topic management | P0 |
| TP-003 | CO mapping per topic | P0 |
| TP-004 | Planned vs actual date tracking | P0 |
| TP-005 | Drag-and-drop reordering | P1 |
| TP-006 | Coverage percentage calculation | P0 |
| TP-007 | ICT tools and teaching method tracking | P1 |
| TP-008 | Delay reason documentation | P1 |

### 3.10 Practical Plan (P0)

| ID | Requirement | Priority |
|---|---|---|
| PP-001 | Experiment-wise practical plan | P0 |
| PP-002 | CO mapping per experiment | P0 |
| PP-003 | Lab batch assignment | P0 |
| PP-004 | Planned vs actual date tracking | P0 |
| PP-005 | Lab manual URL attachment | P1 |
| PP-006 | Resource requirements tracking | P1 |

### 3.11 Assessment Engine (P0)

| ID | Requirement | Priority |
|---|---|---|
| ASS-001 | Dynamic assessment types (UI-configurable) | P0 |
| ASS-002 | Assessment creation per course offering | P0 |
| ASS-003 | CO-wise marks allocation in assessment | P0 |
| ASS-004 | Bloom's level distribution tracking | P1 |
| ASS-005 | Assessment publishing workflow | P0 |
| ASS-006 | Weightage configuration per assessment | P0 |
| ASS-007 | Question bank management | P2 |
| ASS-008 | Question paper generation (manual + AI) | P2 |

### 3.12 Marks Management (P0)

| ID | Requirement | Priority |
|---|---|---|
| MKS-001 | Marks entry grid (students × assessments) | P0 |
| MKS-002 | CO-wise marks entry per assessment | P0 |
| MKS-003 | Bulk import marks from Excel | P0 |
| MKS-004 | Marks locking (prevent changes after deadline) | P0 |
| MKS-005 | Marks modification with reason/audit trail | P0 |
| MKS-006 | Absentee/exemption marking | P0 |
| MKS-007 | Marks summary per student/course | P0 |
| MKS-008 | Auto-calculation of percentages | P0 |

### 3.13 Attainment Engine (P0 — Core Value)

| ID | Requirement | Priority |
|---|---|---|
| ATN-001 | Configurable attainment formula (per program/year) | P0 |
| ATN-002 | CO attainment calculation (direct) | P0 |
| ATN-003 | CO attainment calculation (indirect via surveys) | P1 |
| ATN-004 | PO attainment aggregation from COs | P0 |
| ATN-005 | PSO attainment aggregation from COs | P0 |
| ATN-006 | Gap analysis (attainment vs target) | P0 |
| ATN-007 | Trend analysis (year-over-year) | P1 |
| ATN-008 | Attainment level labels (High/Medium/Low) | P0 |
| ATN-009 | Assessment-wise breakdown per CO | P0 |
| ATN-010 | Direct/Indirect split configuration | P0 |
| ATN-011 | Mapping level weight configuration | P0 |
| ATN-012 | AI-predicted attainment | P2 |

### 3.14 Surveys (P1)

| ID | Requirement | Priority |
|---|---|---|
| SRV-001 | Survey builder (Likert, MCQ, text, rating) | P1 |
| SRV-002 | Course exit survey for indirect attainment | P1 |
| SRV-003 | Faculty feedback survey | P1 |
| SRV-004 | Alumni survey | P2 |
| SRV-005 | Employer survey | P2 |
| SRV-006 | Anonymous response support | P1 |
| SRV-007 | Survey analytics with CO mapping | P1 |
| SRV-008 | Survey response export | P1 |

### 3.15 Slow Learner & Advanced Learner (P1)

| ID | Requirement | Priority |
|---|---|---|
| SL-001 | Automatic slow learner detection (attendance + marks criteria) | P1 |
| SL-002 | Manual slow learner identification by faculty | P1 |
| SL-003 | Remedial session planning and tracking | P1 |
| SL-004 | Pre/post remedial performance comparison | P1 |
| SL-005 | Advanced learner identification | P1 |
| SL-006 | Advanced learner activity tracking | P2 |
| SL-007 | Mentor assignment | P2 |

### 3.16 Reports (P0 for core, P1 for extended)

| ID | Requirement | Priority |
|---|---|---|
| RPT-001 | Course File Report (NBA standard) | P0 |
| RPT-002 | Attendance Report | P0 |
| RPT-003 | CO Attainment Report | P0 |
| RPT-004 | PO/PSO Attainment Report | P0 |
| RPT-005 | Marks Report (CIA/MSE/TEE) | P0 |
| RPT-006 | Gap Analysis Report | P0 |
| RPT-007 | Teaching Plan Coverage Report | P1 |
| RPT-008 | Slow Learner Report | P1 |
| RPT-009 | Advanced Learner Report | P2 |
| RPT-010 | Beyond Syllabus Report | P2 |
| RPT-011 | Survey Report | P2 |
| RPT-012 | Audit Trail Report | P1 |
| RPT-013 | NBA Summary Report | P1 |
| RPT-014 | Student Performance Report | P1 |
| RPT-015 | Faculty Workload Report | P1 |
| RPT-016 | Department Summary Report | P2 |
| RPT-017 | Practical Plan Report | P1 |
| RPT-018 | PDF + Excel output for all reports | P0 |

### 3.17 Dashboards (P0 for basic, P1 for enhanced)

| ID | Requirement | Priority |
|---|---|---|
| DASH-001 | Faculty Dashboard (courses, attendance, marks, attainment) | P0 |
| DASH-002 | Student Dashboard (attendance, marks, attainment) | P0 |
| DASH-003 | HOD Dashboard (department overview) | P0 |
| DASH-004 | NBA Coordinator Dashboard (accreditation readiness) | P1 |
| DASH-005 | IQAC Dashboard (quality metrics) | P2 |
| DASH-006 | Principal Dashboard (institutional overview) | P2 |
| DASH-007 | Admin Dashboard (system metrics) | P1 |

### 3.18 Document Management (P1)

| ID | Requirement | Priority |
|---|---|---|
| DOC-001 | File upload to cloud storage (R2/S3) | P1 |
| DOC-002 | Document categorization (course, audit, student, admin) | P1 |
| DOC-003 | Document versioning | P2 |
| DOC-004 | Course file builder (auto-compile course documents) | P1 |
| DOC-005 | Access control per document | P1 |
| DOC-006 | Document search | P2 |

### 3.19 Notifications (P1)

| ID | Requirement | Priority |
|---|---|---|
| NOT-001 | In-app notifications | P1 |
| NOT-002 | Email notifications | P1 |
| NOT-003 | SMS notifications | P2 |
| NOT-004 | WebSocket real-time delivery | P1 |
| NOT-005 | Notification preferences per user | P1 |
| NOT-006 | Attendance default alerts | P1 |
| NOT-007 | Marks entry reminders | P1 |

### 3.20 Audit Trail (P1)

| ID | Requirement | Priority |
|---|---|---|
| AUD-001 | Log all CREATE/UPDATE/DELETE operations | P1 |
| AUD-002 | Log login/logout events | P1 |
| AUD-003 | Old value + new value storage (JSONB) | P1 |
| AUD-004 | Filter by user, action, module, date range | P1 |
| AUD-005 | Audit log export | P1 |
| AUD-006 | Monthly partitioned audit table | P1 |

### 3.21 Content Beyond Syllabus (P2)

| ID | Requirement | Priority |
|---|---|---|
| CBS-001 | Track workshops, seminars, expert talks | P2 |
| CBS-002 | Industrial visit documentation | P2 |
| CBS-003 | Hackathon/competition tracking | P2 |
| CBS-004 | MOOC certification tracking | P2 |
| CBS-005 | Evidence file upload | P2 |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement | Target |
|---|---|---|
| NFR-P01 | Page load time (initial) | < 2 seconds |
| NFR-P02 | API response time (p95) | < 500ms |
| NFR-P03 | Attainment calculation (500 students) | < 10 seconds |
| NFR-P04 | Bulk import (1000 students) | < 30 seconds |
| NFR-P05 | Report generation (PDF) | < 15 seconds |
| NFR-P06 | Dashboard load time | < 3 seconds |
| NFR-P07 | Concurrent users per tenant | 500+ |
| NFR-P08 | Total platform users | 100,000+ |
| NFR-P09 | Database query time (p95) | < 100ms |
| NFR-P10 | Table rendering (10,000 rows) | Virtual scroll, < 16ms/frame |

### 4.2 Security

| ID | Requirement | Standard |
|---|---|---|
| NFR-S01 | Password hashing | Argon2id (OWASP 2024) |
| NFR-S02 | JWT algorithm | RS256 |
| NFR-S03 | Refresh token rotation | Family-based reuse detection |
| NFR-S04 | Account lockout | 5 attempts → 15 min |
| NFR-S05 | Rate limiting (general) | 100 req/15min |
| NFR-S06 | Rate limiting (auth) | 10 req/15min |
| NFR-S07 | HTTP security headers | Helmet.js (HSTS, CSP, X-Frame) |
| NFR-S08 | Input validation | Zod + class-validator |
| NFR-S09 | File upload validation | Type whitelist + 50MB limit |
| NFR-S10 | CORS | Frontend origin whitelist only |
| NFR-S11 | SQL injection prevention | Prisma parameterized queries |
| NFR-S12 | XSS prevention | React auto-escaping + CSP |
| NFR-S13 | CSRF protection | httpOnly cookies + sameSite |
| NFR-S14 | Data encryption at rest | PostgreSQL TDE / R2 SSE |
| NFR-S15 | Data encryption in transit | TLS 1.3 |
| NFR-S16 | Tenant isolation | Row-level filtering on every query |

### 4.3 Scalability

| ID | Requirement | Target |
|---|---|---|
| NFR-SC01 | Multi-tenant support | 100+ institutions |
| NFR-SC02 | Database scaling | Read replicas, partitioned tables |
| NFR-SC03 | Background job processing | BullMQ with multiple workers |
| NFR-SC04 | Caching strategy | Redis for computed data |
| NFR-SC05 | File storage | S3-compatible (Cloudflare R2) |
| NFR-SC06 | Horizontal scaling | Stateless API, session in Redis |

### 4.4 Reliability

| ID | Requirement | Target |
|---|---|---|
| NFR-R01 | Uptime SLA | 99.9% (8.7 hours downtime/year max) |
| NFR-R02 | Automated backups | Daily pg_dump to S3/R2 |
| NFR-R03 | Health checks | Readiness/liveness probes |
| NFR-R04 | Error tracking | Sentry integration |
| NFR-R05 | Graceful degradation | Cache fallback, retry logic |
| NFR-R06 | Data consistency | Prisma transactions for multi-step ops |

### 4.5 Usability

| ID | Requirement | Target |
|---|---|---|
| NFR-U01 | Zero-training UX | Faculty can use without training |
| NFR-U02 | Dark mode | Full dark/light/system theme |
| NFR-U03 | Responsive design | Mobile, tablet, desktop |
| NFR-U04 | Accessibility | WCAG 2.1 AA |
| NFR-U05 | Keyboard navigation | All operations via keyboard |
| NFR-U06 | Command palette | Cmd+K global search |
| NFR-U07 | Loading states | Skeleton loaders (not spinners) |
| NFR-U08 | Error states | Retry + helpful messages |
| NFR-U09 | Empty states | Illustration + CTA |
| NFR-U10 | Toast notifications | Non-blocking feedback |

### 4.6 Maintainability

| ID | Requirement | Standard |
|---|---|---|
| NFR-M01 | TypeScript strict mode | No `any` types |
| NFR-M02 | Test coverage | 80%+ for business logic |
| NFR-M03 | API documentation | Swagger/OpenAPI |
| NFR-M04 | Code linting | ESLint + Prettier |
| NFR-M05 | Conventional commits | feat:, fix:, docs:, etc. |
| NFR-M06 | Monorepo | Turborepo + pnpm workspaces |

---

## 5. System Constraints & Assumptions

### 5.1 Constraints

1. **Solo Developer** — Initial development by a single developer; optimize for developer experience
2. **Budget** — Self-hosted on VPS (Hetzner/DigitalOcean), no expensive cloud services initially
3. **Timeline** — MVP in 6 months, full platform in 12 months
4. **Browser Support** — Chrome 90+, Firefox 90+, Edge 90+, Safari 14+
5. **Network** — Platform must work on 4G connections (common in Indian colleges)
6. **Device** — Must work on 1366×768 resolution (common college monitors)
7. **Language** — English only for MVP (Hindi/Marathi localization in v2)

### 5.2 Assumptions

1. **Internet** — All users have reliable internet access
2. **Devices** — Faculty and admin use desktops/laptops; students use mobile + desktop
3. **Digital Literacy** — Basic computer skills (browse web, fill forms, upload files)
4. **Data Migration** — Initial data provided in Excel format for bulk import
5. **Single Tenant MVP** — MVP serves one institution; multi-tenant activated in v2
6. **AI Features** — GPT-4o API available for AI features (v3.0)
7. **College IT Support** — Each institution has at least one IT person for admin tasks
8. **NBA Standards** — PO1-PO12 follow NBA standard definitions
9. **Academic Calendar** — Two semesters per year (even/odd), aligned with Indian university pattern

---

## 6. Compliance Requirements

### 6.1 NBA (National Board of Accreditation)

| Criteria | EduOBE Coverage |
|---|---|
| **Criterion 1:** Vision, Mission, PEOs | Program management, PO/PSO definitions |
| **Criterion 2:** Course Outcomes | CO management, Bloom's taxonomy, CO-PO mapping |
| **Criterion 3:** Program Outcomes | PO/PSO attainment, gap analysis |
| **Criterion 4:** Students Performance | Student tracking, slow learner identification |
| **Criterion 5:** Faculty Contributions | Workload, publications, allocation |
| **Criterion 6:** Facilities & Support | Document management, lab tracking |
| **Criterion 7:** Academic Details | Teaching plan, attendance, assessments |
| **Criterion 8:** Continuous Improvement | Attainment trends, gap analysis, remedial actions |
| **Criterion 9:** Student Support | Mentoring, remedial sessions, feedback |

### 6.2 NAAC (National Assessment and Accreditation Council)

| Criteria | EduOBE Coverage |
|---|---|
| Curricular Aspects | Curriculum management, teaching plan |
| Teaching-Learning | Attendance, content beyond syllabus |
| Research & Innovation | Faculty publications, research tracking |
| Infrastructure | Document management |
| Student Support | Slow learner, advanced learner tracking |
| Governance | Audit trail, role-based access |
| Institutional Values | Survey engine, feedback collection |

### 6.3 OBE (Outcome-Based Education) Principles

1. **Clarity of Focus** — Every assessment mapped to specific COs
2. **Designing Down** — COs → Assessments → Teaching plan (backward design)
3. **High Expectations** — Target attainment levels set per CO
4. **Expanded Opportunities** — Multiple assessment methods, remedial support

---

## 7. Data Flow Diagrams

### 7.1 Attainment Pipeline (Core Flow)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ATTAINMENT CALCULATION PIPELINE                    │
└─────────────────────────────────────────────────────────────────────┘

┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Faculty  │───→│ Define   │───→│ Map COs  │───→│ Create   │
│          │    │ COs      │    │ to POs/  │    │Assess-   │
│          │    │ (CO1-CO6)│    │ PSOs     │    │ ments    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                    │
                                                    ▼
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ View     │◄───│Attainment│◄───│ Calculate│◄───│ Enter    │
│ Reports  │    │ Engine   │    │ Attain-  │    │ CO-wise  │
│          │    │          │    │ ment     │    │ Marks    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │
                     ▼
         ┌───────────────────┐
         │  CO Attainment    │
         │  (per CO)         │
         ├───────────────────┤
         │  PO Attainment    │
         │  (aggregated)     │
         ├───────────────────┤
         │  PSO Attainment   │
         │  (aggregated)     │
         ├───────────────────┤
         │  Gap Analysis     │
         │  Trends           │
         └───────────────────┘
```

### 7.2 CO Attainment Calculation (Detail)

```
For each CO in a course offering:

┌─────────────────────────────────────────────────────┐
│ Step 1: Per-Assessment CO Marks                      │
│                                                      │
│  Assessment: CIA 1 (Max: 30, CO1 max: 10)           │
│  Student A: CO1 marks = 8/10 = 80%  ✅ (≥60%)      │
│  Student B: CO1 marks = 5/10 = 50%  ❌ (<60%)      │
│  Student C: CO1 marks = 7/10 = 70%  ✅ (≥60%)      │
│  ...                                                 │
│  Count above threshold: 42/60 = 70%                 │
│                                                      │
├─────────────────────────────────────────────────────┤
│ Step 2: Map % to Attainment Level                    │
│                                                      │
│  70% students above threshold                        │
│  → Attainment Level = 3 (if ≥70%)                   │
│  → Attainment Level = 2 (if 50-69%)                 │
│  → Attainment Level = 1 (if 30-49%)                 │
│  → Attainment Level = 0 (if <30%)                   │
│                                                      │
├─────────────────────────────────────────────────────┤
│ Step 3: Weighted Average Across Assessments          │
│                                                      │
│  CIA: 20% weight, Level = 3                          │
│  MSE: 30% weight, Level = 2                          │
│  TEE: 50% weight, Level = 2                          │
│                                                      │
│  Direct Attainment = (3×0.2 + 2×0.3 + 2×0.5)       │
│                    = (0.6 + 0.6 + 1.0) = 2.2/3.0    │
│                                                      │
├─────────────────────────────────────────────────────┤
│ Step 4: Combine Direct + Indirect                    │
│                                                      │
│  Direct = 2.2/3.0 = 0.73                            │
│  Indirect (Survey) = 2.5/3.0 = 0.83                │
│                                                      │
│  Final CO Attainment = (0.80 × 0.73) + (0.20 × 0.83)│
│                      = 0.584 + 0.166 = 0.75         │
│                                                      │
│  Target = 0.60 → ✅ ATTAINED                         │
└─────────────────────────────────────────────────────┘
```

### 7.3 PO Attainment Aggregation

```
For each PO (e.g., PO1: Engineering Knowledge):

┌─────────────────────────────────────────────────────┐
│ Collect all COs mapped to PO1 across all courses     │
│                                                      │
│  Course CSE-301 (DSA):                               │
│    CO1 → PO1 (Level 3), Attainment = 0.75           │
│    CO3 → PO1 (Level 2), Attainment = 0.62           │
│                                                      │
│  Course CSE-302 (DBMS):                              │
│    CO2 → PO1 (Level 3), Attainment = 0.80           │
│    CO5 → PO1 (Level 1), Attainment = 0.55           │
│                                                      │
│  Course CSE-303 (CO):                                │
│    CO1 → PO1 (Level 2), Attainment = 0.70           │
│                                                      │
├─────────────────────────────────────────────────────┤
│ Weighted Average (by mapping level):                 │
│                                                      │
│  Weight = CO_Attainment × Mapping_Level              │
│                                                      │
│  Sum of (Attainment × Level):                        │
│  = (0.75×3 + 0.62×2 + 0.80×3 + 0.55×1 + 0.70×2)  │
│  = (2.25 + 1.24 + 2.40 + 0.55 + 1.40) = 7.84      │
│                                                      │
│  Sum of Levels:                                      │
│  = (3 + 2 + 3 + 1 + 2) = 11                        │
│                                                      │
│  PO1 Attainment = 7.84 / 11 = 0.71                  │
│  Target = 0.60 → ✅ ATTAINED                         │
└─────────────────────────────────────────────────────┘
```

### 7.4 Attendance Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Faculty  │───→│ Create   │───→│ Mark     │
│ Creates  │    │ Session  │    │Attendance│
│ Session  │    │(Date,    │    │(Present/ │
│          │    │ Period)  │    │ Absent/  │
│          │    │          │    │ Late)    │
└──────────┘    └──────────┘    └──────────┘
                                     │
                  ┌──────────────────┼──────────────────┐
                  │                  │                  │
                  ▼                  ▼                  ▼
            ┌──────────┐    ┌──────────┐    ┌──────────┐
            │ QR Code  │    │ Bulk     │    │ Lock     │
            │ Generation│    │ Import   │    │ Session  │
            │ (Student │    │ (Excel)  │    │          │
            │  scans)  │    │          │    │          │
            └──────────┘    └──────────┘    └──────────┘
                                                │
                                                ▼
                                    ┌──────────────────┐
                                    │  Analytics        │
                                    │  - % per student  │
                                    │  - Trend charts   │
                                    │  - Defaulters     │
                                    │  - CO coverage    │
                                    └──────────────────┘
```

### 7.5 Marks Entry & CO-wise Flow

```
┌──────────┐    ┌──────────┐    ┌──────────────────────────────────┐
│ Faculty  │───→│ Select   │───→│ Marks Entry Grid                 │
│          │    │Assessment│    │                                  │
│          │    │          │    │ Student  | Q1(CO1)|Q2(CO1)|Q3(CO2)| Total │
│          │    │          │    │ ---------+--------+-------+-------+------- │
│          │    │          │    │ Aarav    |   8    |   7   |   9   |  24   │
│          │    │          │    │ Priya    |   6    |   9   |   8   |  23   │
│          │    │          │    │ Rohan    |   4    |   5   |   6   |  15   │
│          │    │          │    │ ...      |        |       |       |       │
│          │    │          │    └──────────────────────────────────┘
└──────────┘    └──────────┘                    │
                                                ▼
                                    ┌──────────────────┐
                                    │ CO-wise Marks     │
                                    │ Aggregation:      │
                                    │                   │
                                    │ Aarav: CO1=15/20  │
                                    │        CO2=9/10   │
                                    │ Priya: CO1=15/20  │
                                    │        CO2=8/10   │
                                    └──────────────────┘
                                                │
                                                ▼
                                    ┌──────────────────┐
                                    │ Feeds into        │
                                    │ Attainment Engine │
                                    └──────────────────┘
```

### 7.6 Event-Driven Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Marks     │────→│  Event Bus  │────→│  Attainment │
│   Updated   │     │ (EventEmit) │     │  Recalculate│
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
            ┌──────────┐  ┌──────────┐
            │  Audit   │  │ Notify   │
            │  Log     │  │ Student  │
            └──────────┘  └──────────┘
```

---

## 8. Risk Assessment Matrix

| # | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Scope creep delays MVP | High | High | Strict P0/P1/P2 prioritization, phase gates |
| R2 | NBA calculation errors | Medium | Critical | Unit tests for all formulas, validate against manual calculations |
| R3 | Data migration issues | High | Medium | Robust Excel import with validation, dry-run mode |
| R4 | Multi-tenant data leakage | Low | Critical | Tenant filter in every query, integration tests |
| R5 | Performance degradation with scale | Medium | High | Pagination, Redis caching, BullMQ for heavy ops |
| R6 | Faculty adoption resistance | High | High | Zero-training UX, video tutorials, champion program |
| R7 | Solo developer burnout | High | High | Phased delivery, prioritize MVP, automate repetitive tasks |
| R8 | Regulatory changes (NBA/NAAC) | Medium | Medium | Configurable formulas, not hardcoded |
| R9 | Security breach | Low | Critical | OWASP practices, penetration testing, rate limiting |
| R10 | Database migration failures | Low | High | Transaction-based migrations, backup before deploy |
| R11 | Third-party API downtime (AI, email) | Medium | Low | Fallback to manual, queue-based retry |
| R12 | Mobile browser incompatibility | Low | Medium | Responsive design, browser testing matrix |
| R13 | Concurrent marks editing conflicts | Medium | Medium | Optimistic locking, last-write-wins with notification |
| R14 | Large report generation timeouts | Medium | Medium | Background job processing (BullMQ), progress tracking |
| R15 | Academic year rollover data issues | Low | High | Dry-run promotion, data validation before commit |

---

## 9. User Stories

### 9.1 Authentication & Authorization

#### US-AUTH-001: Login
**As a** Faculty member  
**I want to** log in with my email and password  
**So that** I can access my academic dashboard  

**Given** I am on the login page  
**When** I enter valid credentials and submit  
**Then** I am redirected to my role-based dashboard  
**And** I see a welcome message with my name  
**And** I receive an access token and refresh cookie  

**Given** I am on the login page  
**When** I enter invalid credentials 5 times  
**Then** my account is locked for 15 minutes  
**And** I see a clear error message  

#### US-AUTH-002: Two-Factor Authentication
**As a** Tenant Admin  
**I want to** enable 2FA on my account  
**So that** my administrative access is more secure  

**Given** I am in security settings  
**When** I click "Enable 2FA"  
**Then** I see a QR code for Google Authenticator  
**When** I scan and enter the 6-digit code  
**Then** 2FA is enabled and I receive recovery codes  

#### US-AUTH-003: RBAC Permission Check
**As a** Faculty member  
**I want to** see only the actions I'm permitted to perform  
**So that** I don't attempt operations I'm not authorized for  

**Given** I have the "faculty" role with course-scoped permissions  
**When** I view the student list  
**Then** I only see students in my assigned courses  
**And** I don't see options to delete or promote students  

### 9.2 Academic Structure

#### US-ACAD-001: Create Academic Year
**As a** Tenant Admin  
**I want to** create a new academic year (e.g., "2025-26")  
**So that** courses and batches can be organized by year  

**Given** I am on the Academic Years page  
**When** I click "New Academic Year" and fill in name, start date, end date  
**Then** the year is created and appears in the list  
**And** I can set it as the current active year  

#### US-ACAD-002: Manage Department
**As a** Tenant Admin  
**I want to** create departments and assign HODs  
**So that** the organizational structure is defined  

**Given** I am on the Departments page  
**When** I create "Computer Science & Engineering" with code "CSE"  
**And** assign Dr. Rajesh Sharma as HOD  
**Then** the department is created with HOD visible in the list  

### 9.3 Student Management

#### US-STU-001: Add Student
**As a** Tenant Admin  
**I want to** add a student with complete profile information  
**So that** the student is enrolled in the system  

**Given** I am on the Students page  
**When** I click "Add Student" and fill in roll number, name, batch, section, category  
**Then** the student is created with a user account  
**And** the student receives a welcome email with login credentials  

#### US-STU-002: Bulk Import Students
**As a** Tenant Admin  
**I want to** import 60 students from an Excel file  
**So that** I don't have to create them one by one  

**Given** I have a formatted Excel file with student data  
**When** I upload it on the Students page  
**Then** the system validates all rows  
**And** shows me a preview with errors highlighted in red  
**When** I confirm the import  
**Then** valid students are created and I see a success summary  

#### US-STU-003: Promote Students
**As a** HOD  
**I want to** promote an entire batch to the next semester  
**So that** students advance to the next academic level  

**Given** Batch 2023 (B.Tech CSE) has completed Semester 2  
**When** I click "Promote Batch" on the batch detail page  
**Then** all active students in the batch have their currentSemester incremented  
**And** their course enrollments are updated for the new semester  
**And** a confirmation dialog shows the count of students being promoted  

### 9.4 Faculty Management

#### US-FAC-001: Add Faculty
**As a** Tenant Admin  
**I want to** add a faculty member with department and designation  
**So that** they can be assigned courses  

**Given** I am on the Faculty page  
**When** I fill in Prof. Amit Deshmukh's details (CSE dept, Assistant Professor)  
**Then** the faculty record is created with a user account  

#### US-FAC-002: View Workload
**As a** HOD  
**I want to** see each faculty member's teaching workload  
**So that** I can balance course allocations fairly  

**Given** I am on the Faculty Workload page  
**When** I view the semester overview  
**Then** I see a table with each faculty's courses, credit hours, and total contact hours  
**And** overloaded faculty are highlighted in red  
**And** under-loaded faculty in yellow  

### 9.5 Course Outcomes

#### US-CO-001: Define COs
**As a** Faculty member  
**I want to** define Course Outcomes for my course offering  
**So that** assessments and teaching can be mapped to outcomes  

**Given** I am on the Course Outcomes page for "Data Structures & Algorithms"  
**When** I add CO1: "Apply fundamental data structures to solve problems" with Bloom Level L3  
**And** set target attainment to 0.60  
**Then** CO1 is saved and visible in the CO list  
**And** I can add CO2 through CO6 similarly  

#### US-CO-002: Submit COs for Approval
**As a** Faculty member  
**I want to** submit my COs for HOD review  
**So that** they are validated before being used in attainment  

**Given** I have defined all 6 COs for my course  
**When** I click "Submit for Review"  
**Then** the COs status changes to "Under Review"  
**And** the HOD receives a notification  
**And** I cannot edit them until review is complete  

### 9.6 CO-PO Mapping

#### US-MAP-001: Map COs to POs
**As a** Faculty member  
**I want to** create CO-PO mappings using an interactive matrix  
**So that** the relationship between course and program outcomes is defined  

**Given** I am on the CO-PO Mapping page  
**When** I see a matrix with COs as rows and POs/PSOs as columns  
**And** I click a cell to set the mapping level (1, 2, or 3)  
**Then** the cell color changes to reflect the strength  
**And** the matrix auto-saves  

#### US-MAP-002: Export Mapping Matrix
**As a** NBA Coordinator  
**I want to** export the CO-PO mapping matrix as Excel  
**So that** I can include it in the NBA documentation  

**Given** I am viewing the mapping matrix  
**When** I click "Export to Excel"  
**Then** an Excel file is downloaded with the complete matrix  
**And** color-coded cells indicating mapping levels  

### 9.7 Attendance

#### US-ATT-001: Mark Attendance
**As a** Faculty member  
**I want to** mark attendance for a class session  
**So that** student attendance is tracked  

**Given** I select "Mark Attendance" for DSA theory, Period 3  
**When** I see the student list with Present/Absent/Late toggles  
**And** all students default to "Present"  
**When** I mark 3 students as absent and click "Save"  
**Then** the session is recorded  
**And** attendance percentages are updated for all students  

#### US-ATT-002: QR Attendance
**As a** Faculty member  
**I want to** generate a QR code for attendance  
**So that** students can mark their own attendance quickly  

**Given** I am in the classroom and start a session  
**When** I click "Generate QR"  
**Then** a time-limited QR code (5 min) is displayed  
**When** students scan and authenticate  
**Then** their attendance is marked as "Present"  
**And** I see a live count of students who have checked in  

#### US-ATT-003: View Defaulters
**As a** Faculty member  
**I want to** see students below 75% attendance  
**So that** I can counsel them or take action  

**Given** I am on the Attendance Analytics page  
**When** I view the "Defaulters" tab  
**Then** I see students with <75% attendance listed  
**And** their exact percentage, total sessions, and trend  
**And** I can send a notification to the student and parent  

### 9.8 Teaching Plan

#### US-TP-001: Create Teaching Plan
**As a** Faculty member  
**I want to** create a unit-wise teaching plan  
**So that** my course delivery is structured and trackable  

**Given** I am on the Teaching Plan page  
**When** I add Unit 1: "Introduction to Data Structures" with topics:  
  - Topic 1: Arrays and their operations (CO1, 2 hours)  
  - Topic 2: Linked Lists (CO1, 3 hours)  
  - Topic 3: Stacks and Queues (CO2, 4 hours)  
**Then** the plan is saved with CO mapping and hour allocation  
**And** I can drag-and-drop to reorder  

#### US-TP-002: Track Coverage
**As a** HOD  
**I want to** see teaching plan coverage for all courses  
**So that** I can identify courses falling behind schedule  

**Given** I am on the Teaching Plan Coverage report  
**When** I view the department overview  
**Then** I see each course's planned vs completed topics as a progress bar  
**And** courses below 60% coverage (mid-semester) are flagged  

### 9.9 Assessments & Marks

#### US-ASS-001: Create Assessment
**As a** Faculty member  
**I want to** create a CIA exam with CO-wise marks distribution  
**So that** student performance is measured against outcomes  

**Given** I am on the Assessments page for DSA  
**When** I create "CIA 1" with:  
  - Type: CIA (max 30 marks)  
  - CO1: 10 marks, CO2: 10 marks, CO3: 10 marks  
  - Exam date: 2024-09-15  
**Then** the assessment is created in draft status  
**And** I can publish it to notify students  

#### US-MKS-001: Enter Marks
**As a** Faculty member  
**I want to** enter CO-wise marks for all students in an assessment  
**So that** attainment can be calculated  

**Given** I open the marks entry for "CIA 1"  
**When** I see a grid with students as rows and COs as columns  
**When** I enter marks for each student per CO  
**Then** totals and percentages are auto-calculated  
**And** I can save as draft and submit when complete  
**And** marks are locked after submission (modifiable only with reason)  

#### US-MKS-002: Bulk Import Marks
**As a** Faculty member  
**I want to** import marks from an Excel file  
**So that** I don't have to enter 60 students × 5 COs manually  

**Given** I have a formatted Excel with student roll numbers and CO-wise marks  
**When** I upload the file  
**Then** the system validates and previews the data  
**When** I confirm  
**Then** marks are imported and I see a summary  

### 9.10 Attainment

#### US-ATN-001: Configure Formula
**As a** NBA Coordinator  
**I want to** configure the attainment calculation formula  
**So that** it matches our institution's policy  

**Given** I am on the Attainment Configuration page  
**When** I set:  
  - CIA weightage: 20%, MSE: 30%, TEE: 50%  
  - Threshold: 60%  
  - Direct/Indirect split: 80/20  
  - Mapping weights: L1=1, L2=2, L3=3  
**Then** the configuration is saved  
**And** can be applied to all course offerings in the program  

#### US-ATN-002: Calculate CO Attainment
**As a** Faculty member  
**I want to** trigger CO attainment calculation for my course  
**So that** I can see how well students achieved each outcome  

**Given** all assessment marks are entered and locked  
**When** I click "Calculate Attainment"  
**Then** the system computes attainment for each CO  
**And** shows me a detailed breakdown:  
  - Per CO: direct value, indirect value, final value  
  - Per assessment: contribution to each CO  
  - Attained/Not Attained status vs target  

#### US-ATN-003: View PO Attainment
**As a** NBA Coordinator  
**I want to** see PO attainment for the entire program  
**So that** I can identify gaps and prepare for accreditation  

**Given** CO attainment is calculated for all courses in the program  
**When** I view the PO Attainment page  
**Then** I see PO1 through PO12 with attainment values  
**And** a radar chart showing the PO attainment profile  
**And** color-coded status (High/Medium/Low/Not Attained)  
**And** contributing COs listed for each PO  

#### US-ATN-004: Gap Analysis
**As a** NBA Coordinator  
**I want to** identify POs that are below the target attainment level  
**So that** I can plan improvement actions  

**Given** PO attainment is calculated  
**When** I view the Gap Analysis page  
**Then** I see POs below target listed with:  
  - Current attainment vs target  
  - Gap magnitude  
  - Contributing courses and COs  
  - Suggested improvement actions  

### 9.11 Reports

#### US-RPT-001: Generate Course File
**As a** Faculty member  
**I want to** generate a complete NBA course file report  
**So that** I have all course documentation in one PDF  

**Given** I am on the Reports page for my course  
**When** I click "Generate Course File"  
**Then** a PDF is generated containing:  
  - Course details and syllabus  
  - COs with Bloom's levels  
  - CO-PO mapping matrix  
  - Teaching plan with coverage  
  - Assessment details and marks summary  
  - CO attainment results  
  - Attendance summary  
**And** the PDF is available for download  

#### US-RPT-002: Export Attendance Report
**As a** HOD  
**I want to** export attendance data for all courses in my department  
**So that** I can submit it for NBA documentation  

**Given** I am on the Attendance Reports page  
**When** I select department, semester, and date range  
**And** click "Export to Excel"  
**Then** an Excel file is generated with:  
  - Sheet per course  
  - Student-wise attendance percentage  
  - Defaulter list  
  - Summary statistics  

### 9.12 Dashboards

#### US-DASH-001: Faculty Dashboard
**As a** Faculty member  
**I want to** see a comprehensive dashboard when I log in  
**So that** I have a quick overview of my responsibilities  

**When** I log in, I see:  
  - My active courses (cards with key metrics)  
  - Today's classes  
  - Pending marks entry  
  - Attendance defaulters alert  
  - Recent notifications  
  - Quick links to common actions  

#### US-DASH-002: HOD Dashboard
**As a** HOD  
**I want to** see a department-level overview  
**So that** I can monitor all activities efficiently  

**When** I log in, I see:  
  - Department statistics (students, faculty, courses)  
  - Attainment overview (PO radar chart)  
  - Pending approvals  
  - Attendance overview per section  
  - Faculty workload summary  
  - Upcoming events  

#### US-DASH-003: Student Dashboard
**As a** Student  
**I want to** see my academic progress at a glance  
**So that** I know where I stand  

**When** I log in, I see:  
  - Current semester courses  
  - Attendance percentage per course (with warning if <75%)  
  - Latest marks and grades  
  - CO attainment status  
  - Upcoming assessments  
  - Remedial sessions if applicable  

### 9.13 Notifications

#### US-NOT-001: Attendance Alert
**As a** Student  
**I want to** receive an alert when my attendance drops below 75%  
**So that** I can take corrective action  

**Given** my attendance for DSA drops to 72%  
**When** the system detects this after a new session  
**Then** I receive an in-app notification  
**And** an email alert (if enabled)  
**And** my parent also receives a notification (if linked)  

### 9.14 Audit Trail

#### US-AUD-001: View Audit Log
**As a** Tenant Admin  
**I want to** see a log of all system changes  
**So that** I can track who did what and when  

**Given** I am on the Audit Log page  
**When** I filter by module "marks", date range, and user  
**Then** I see all marks-related changes with:  
  - Who made the change  
  - What was changed (old value → new value)  
  - When it was changed  
  - IP address of the change  

---

## 10. Acceptance Criteria

### 10.1 Per Module Acceptance Criteria

| Module | Key Acceptance Criteria |
|---|---|
| **Auth** | Login in <2s; lockout after 5 fails; 2FA works with Google Authenticator; RBAC blocks unauthorized access |
| **Academic Structure** | CRUD for all entities; bulk operations; data integrity (FK constraints); cascade rules correct |
| **Students** | Create/import/export; promotion updates all linked data; search/filter works on 1000+ students |
| **Faculty** | CRUD; workload calculated correctly; allocation visible on course offering |
| **COs** | CRUD with Bloom's levels; approval workflow functional; version tracked |
| **PO/PSO** | Standard POs pre-seeded; custom POs supported; per-program isolation |
| **CO-PO Mapping** | Interactive matrix works; 3-level mapping; export matches displayed data |
| **Attendance** | Mark/save in <5s for 60 students; QR valid for 5 min; analytics correct; defaulters identified |
| **Teaching Plan** | CRUD; drag-drop reorder; coverage % accurate; CO mapping preserved |
| **Assessments** | Dynamic types from DB; CO-wise marks allocation; publish/lock workflow |
| **Marks** | Grid entry for 60×5 in <10s; import validates; lock prevents further changes |
| **Attainment** | Calculation matches manual verification; <10s for 500 students; all COs/POs/PSOs computed |
| **Reports** | PDF/Excel generated in <15s; all sections populated; charts render correctly |
| **Dashboards** | Load in <3s; data refreshed; role-appropriate content |

### 10.2 Cross-Cutting Acceptance Criteria

- [ ] All API endpoints return consistent response format
- [ ] All endpoints validate input and return helpful error messages
- [ ] All queries filter by tenantId (zero cross-tenant data)
- [ ] All mutations create audit log entries
- [ ] All pages have loading skeletons
- [ ] All pages have empty states with CTAs
- [ ] All pages have error states with retry
- [ ] All tables have search, filter, sort, pagination
- [ ] All forms have inline validation
- [ ] All destructive actions have confirmation dialogs
- [ ] Responsive design works on 360px to 1920px
- [ ] Dark mode works on all pages
- [ ] Keyboard navigation works for all operations
- [ ] WCAG 2.1 AA compliance

---

## 11. Technical Decisions Log

| Decision | Chosen | Alternatives Considered | Rationale |
|---|---|---|---|
| **Monorepo** | Turborepo + pnpm | Nx, Lerna | Fast, lightweight, great DX, native pnpm workspace support |
| **Frontend** | Next.js 14 App Router | Remix, Vite+React | SSR + RSC for performance, great ecosystem, Vercel support |
| **UI** | shadcn/ui + Radix | MUI, Ant Design, Chakra | Copy-paste components, full control, beautiful default, accessible |
| **Backend** | NestJS | Express, Fastify, Hono | Enterprise patterns (DI, Guards, Pipes), scalable architecture |
| **ORM** | Prisma | TypeORM, Drizzle, Knex | Type-safe, great DX, auto-migrations, schema-as-code |
| **Database** | PostgreSQL 16 | MySQL, MongoDB | JSONB for flexible fields, full-text search, pgvector for AI |
| **Cache** | Redis 7 | Memcached | Rich data structures, pub/sub, persistence, BullMQ support |
| **Queue** | BullMQ | Bull, Agenda | Modern, TypeScript-first, great monitoring dashboard |
| **Auth** | Passport + JWT | NextAuth, Clerk | Full control, RBAC support, no vendor lock-in |
| **Password** | Argon2id | bcrypt, scrypt | OWASP 2024 recommended, memory-hard, resistant to GPU attacks |
| **Storage** | Cloudflare R2 | AWS S3, MinIO | S3-compatible, zero egress fees, fast CDN |
| **Email** | Resend | SendGrid, Mailgun | Modern API, great DX, reasonable pricing |
| **Validation** | Zod + class-validator | Joi, Yup | Type inference, composable, shared between frontend/backend |
| **State** | Zustand + TanStack Query | Redux, Jotai, Recoil | Zustand minimal for client state; TQ for server cache, auto-refetch |
| **Tables** | TanStack Table v8 | AG Grid, react-table | Headless, powerful, virtual scroll support |
| **Charts** | Recharts + Tremor | Chart.js, D3, Nivo | React-native, good defaults, Tremor for analytics cards |
| **Forms** | React Hook Form + Zod | Formik, Final Form | Performance (uncontrolled), Zod integration, less re-renders |
| **AI** | Vercel AI SDK + GPT-4o | LangChain, custom | Simple, streaming support, multi-provider |
| **PDF** | React-PDF + Puppeteer | jsPDF, PDFKit | React components → PDF; Puppeteer for complex HTML-to-PDF |
| **Excel** | ExcelJS + xlsx | SheetJS only | ExcelJS for styled generation; xlsx for fast parsing |
| **Deployment** | Docker + Coolify | Vercel, Railway, Fly.io | Self-hosted control, one-time cost, Coolify for PaaS-like DX |
| **Monitoring** | Sentry + Grafana | DataDog, New Relic | Sentry free tier; Grafana open-source, great dashboards |
| **Logging** | Pino + Loki | Winston, CloudWatch | Pino fastest Node logger; Loki for log aggregation |
| **Reverse Proxy** | Caddy | Nginx, Traefik | Auto HTTPS, simple config, modern |

---

## 12. MVP vs Post-MVP Scope

### 12.1 MVP Scope (Sprints 1-6, ~6 months)

**Core Value: "Faculty can enter marks and see CO attainment"**

| Phase | Deliverable | Timeline |
|---|---|---|
| Phase 1 | Requirements Analysis | ✅ Done |
| Phase 2 | System Architecture Document | Week 1 |
| Phase 3 | Monorepo Setup | Week 1-2 |
| Phase 4 | Database Design (Prisma + Seeds) | Week 2-3 |
| Phase 5 | NestJS Base (Guards, Interceptors, Filters) | Week 3-4 |
| Phase 6 | Next.js Base (Layout, Sidebar, Components) | Week 3-4 |
| Phase 7 | Authentication System | Week 4-5 |
| Phase 8 | Master Modules Backend | Week 5-7 |
| Phase 9 | Master Modules Frontend | Week 7-9 |
| Phase 10 | Student Module | Week 9-10 |
| Phase 11 | Faculty Module | Week 10-11 |
| Phase 12 | Course Offering + Enrollment | Week 11-12 |
| Phase 13 | CO/PO/PSO + Mapping | Week 12-14 |
| Phase 14 | Attendance System | Week 14-15 |
| Phase 15 | Teaching Plan + Practical Plan | Week 15-16 |
| Phase 16 | Assessment Engine | Week 16-17 |
| Phase 17 | Marks Management | Week 17-18 |
| Phase 18 | Attainment Engine | Week 18-20 |
| Phase 19 | Report Generation (Core) | Week 20-22 |
| Phase 20 | Dashboards (Faculty, HOD, Student) | Week 22-24 |

**MVP Deliverables:**
- ✅ Full academic structure management
- ✅ Student & Faculty CRUD with bulk import
- ✅ CO/PO/PSO management and mapping
- ✅ Attendance (manual + analytics)
- ✅ Teaching plan with coverage tracking
- ✅ Dynamic assessment types and marks entry
- ✅ CO/PO/PSO attainment calculation
- ✅ Core reports (PDF + Excel)
- ✅ Role-based dashboards

### 12.2 Post-MVP v1.5 (Months 7-9)

| Phase | Deliverable |
|---|---|
| Phase 21 | Survey Engine (indirect attainment) |
| Phase 22 | Slow Learner + Advanced Learner + Beyond Syllabus |
| Phase 23 | Enhanced Dashboards (NBA, IQAC, Principal) |
| Phase 24 | Question Bank + Paper Generation |

### 12.3 Post-MVP v2.0 (Months 10-12)

| Phase | Deliverable |
|---|---|
| Phase 25 | Document Management + Course File Builder |
| Phase 26 | Notification System (Email, SMS, WebSocket) |
| Phase 27 | Audit Trail (Full UI) |
| Phase 28 | Docker + CI/CD + Deployment + Monitoring |

### 12.4 Future (v3.0+)

- AI-powered features (auto-generate COs, predict attainment, question generation)
- Multi-tenant activation (subdomain routing, billing)
- Mobile app (React Native)
- Localization (Hindi, Marathi, Tamil)
- Integration APIs (university result systems, ERP)
- Marketplace (custom report templates, plugins)

---

## 13. Success Metrics (KPIs)

### 13.1 Product Metrics

| Metric | Target (Year 1) | Measurement |
|---|---|---|
| Institutions onboarded | 50+ | Tenant count |
| Active faculty users | 2,000+ | Monthly active |
| Students managed | 50,000+ | Student records |
| Attainment calculations | 10,000+ | Calculation events |
| Reports generated | 5,000+ | Report downloads |
| Daily active users | 500+ | DAU |
| User retention (90-day) | 80%+ | Cohort analysis |

### 13.2 Performance Metrics

| Metric | Target | Measurement |
|---|---|---|
| Page load time | < 2s (p95) | Web Vitals |
| API response time | < 500ms (p95) | APM |
| Uptime | 99.9% | Uptime monitoring |
| Error rate | < 0.1% | Sentry |
| Database query time | < 100ms (p95) | pg_stat_statements |

### 13.3 Business Metrics

| Metric | Target (Year 1) | Measurement |
|---|---|---|
| MRR (Monthly Recurring Revenue) | ₹25L+ | Billing |
| Customer Acquisition Cost | < ₹50,000 | Finance |
| Net Promoter Score | 50+ | Surveys |
| Churn rate | < 5% annually | Billing |
| Support tickets per institution | < 5/month | Help desk |

### 13.4 Educational Impact Metrics

| Metric | Target | Measurement |
|---|---|---|
| Faculty time saved | 85% (15h → 2h/week) | User surveys |
| NBA preparation time | 80% reduction (6mo → 1mo) | Institution feedback |
| Accreditation success rate | 90%+ | Client outcomes |
| Student engagement | 70%+ weekly active | Platform analytics |
| Data accuracy | 99%+ (vs manual audit) | Spot checks |

---

## Phase 1 Checklist

- [x] Executive Summary completed
- [x] All 12 stakeholder personas defined with goals, pain points, and needs
- [x] Functional requirements catalogued across 21 modules (150+ requirements)
- [x] Priority classification (P0/P1/P2) for all requirements
- [x] Non-functional requirements defined (performance, security, scalability, usability)
- [x] System constraints and assumptions documented
- [x] NBA/NAAC/OBE compliance requirements mapped
- [x] Data flow diagrams for core pipelines (attainment, attendance, marks)
- [x] CO attainment calculation detailed with example
- [x] PO attainment aggregation detailed with example
- [x] Risk assessment matrix with 15 risks and mitigations
- [x] User stories in Given-When-Then format for all major features
- [x] Acceptance criteria per module and cross-cutting
- [x] Technical decisions log with rationale
- [x] MVP vs Post-MVP scope defined
- [x] Success metrics (KPIs) defined with targets

---

## Next Steps

**Phase 1 is complete.** Say **"PROCEED TO PHASE 2"** to generate the System Architecture Document covering:
- System architecture diagrams (C4 model)
- Deployment architecture
- Data architecture
- Security architecture
- Module interaction diagrams
- Technology stack deep-dive
- Scalability strategy
- Disaster recovery plan
