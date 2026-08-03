// Re-export types from schemas
export type * from '../schemas/common.schemas';
export type * from '../schemas/auth.schemas';
export type * from '../schemas/academic.schemas';

// Common types
export type EntityStatus = 'active' | 'archived';
export type AcademicStatus = 'active' | 'graduated' | 'archived';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export type DegreeType = 'btech' | 'mtech' | 'diploma' | 'phd';
export type AttendanceMode = 'daily' | 'batch_wise' | 'experiment_wise';
export type PlanType = 'teaching' | 'practical' | 'project' | 'none';

export type BloomLevel =
  | 'L1_remember'
  | 'L2_understand'
  | 'L3_apply'
  | 'L4_analyze'
  | 'L5_evaluate'
  | 'L6_create';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'medical';
export type AttendanceMarkingVia = 'manual' | 'qr' | 'bulk_import';

export type AssessmentCategory = 'formative' | 'summative';
export type QuestionType = 'mcq' | 'short_answer' | 'long_answer' | 'numerical' | 'descriptive';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'APPROVE'
  | 'REJECT'
  | 'CALCULATE'
  | 'IMPORT';

export type AuditSeverity = 'info' | 'warning' | 'critical';

export type NotificationType = 'info' | 'warning' | 'success' | 'error';
export type NotificationChannel = 'in_app' | 'email' | 'sms';

export type SurveyType =
  | 'course_exit'
  | 'faculty_feedback'
  | 'event_feedback'
  | 'alumni'
  | 'employer'
  | 'custom';

export type TenantPlan = 'free' | 'starter' | 'professional' | 'enterprise';
export type TenantStatus = 'active' | 'suspended' | 'trial';

export type FacultyDesignation =
  | 'professor'
  | 'associate_professor'
  | 'assistant_professor'
  | 'lecturer';

export type EmploymentType = 'permanent' | 'contract' | 'visiting' | 'adjunct';

export type AdmissionType = 'regular' | 'lateral' | 'transfer';

export type StudentCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';

// Pagination types
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedQuery {
  page?: number;
  limit?: number;
  sort?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginatedResult<T>['meta'];
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
  statusCode: number;
  details?: Array<{ field: string; message: string }>;
  timestamp: string;
  path: string;
  requestId: string;
}

// Permission types
export interface Permission {
  resource: string;
  action: string;
  scope: string;
}

export type PermissionScope = 'own' | 'course' | 'department' | 'program' | 'all';

// User context types
export interface UserContext {
  userId: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRoleContext[];
  permissions: string[];
}

export interface UserRoleContext {
  roleId: string;
  roleCode: string;
  roleName: string;
  scopeType?: string;
  scopeId?: string;
}

// Dashboard types
export interface DashboardStats {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

// Attainment types
export interface AttainmentLevel {
  level: number;
  label: string;
  min: number;
  color: string;
}

export interface COAttainmentResult {
  coId: string;
  coNumber: string;
  directValue: number;
  indirectValue?: number;
  finalValue: number;
  targetLevel: number;
  isAttained: boolean;
  assessmentBreakdown: Array<{
    assessmentId: string;
    assessmentName: string;
    weightage: number;
    attainmentLevel: number;
  }>;
}

export interface POAttainmentResult {
  poId: string;
  poNumber: string;
  attainmentValue: number;
  targetLevel: number;
  isAttained: boolean;
  contributingCOs: Array<{
    coId: string;
    courseName: string;
    attainment: number;
    weight: number;
  }>;
}
