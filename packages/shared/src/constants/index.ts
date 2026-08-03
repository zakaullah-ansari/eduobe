// System constants
export const SYSTEM_CONSTANTS = {
  APP_NAME: 'EduOBE',
  APP_VERSION: '2.0.0',
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_REPORT_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  JWT_ACCESS_EXPIRY: '15m',
  JWT_REFRESH_EXPIRY: '7d',
  ACCOUNT_LOCKOUT_ATTEMPTS: 5,
  ACCOUNT_LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  QR_CODE_EXPIRY: 5 * 60 * 1000, // 5 minutes
  ATTENDANCE_THRESHOLD: 75, // 75%
} as const;

// Default roles
export const DEFAULT_ROLES = {
  SUPER_ADMIN: 'super_admin',
  TENANT_ADMIN: 'tenant_admin',
  PRINCIPAL: 'principal',
  HOD: 'hod',
  IQAC_COORDINATOR: 'iqac_coordinator',
  NBA_COORDINATOR: 'nba_coordinator',
  PROGRAM_COORDINATOR: 'program_coordinator',
  FACULTY: 'faculty',
  LAB_INSTRUCTOR: 'lab_instructor',
  STUDENT: 'student',
  EXTERNAL_AUDITOR: 'external_auditor',
  PARENT: 'parent',
} as const;

// Bloom's Taxonomy levels
export const BLOOM_LEVELS = {
  L1_REMEMBER: { code: 'L1_remember', label: 'Remember', level: 1, color: '#94a3b8' },
  L2_UNDERSTAND: { code: 'L2_understand', label: 'Understand', level: 2, color: '#60a5fa' },
  L3_APPLY: { code: 'L3_apply', label: 'Apply', level: 3, color: '#34d399' },
  L4_ANALYZE: { code: 'L4_analyze', label: 'Analyze', level: 4, color: '#fbbf24' },
  L5_EVALUATE: { code: 'L5_evaluate', label: 'Evaluate', level: 5, color: '#f97316' },
  L6_CREATE: { code: 'L6_create', label: 'Create', level: 6, color: '#ef4444' },
} as const;

// Standard NBA Program Outcomes
export const STANDARD_POS = [
  {
    number: 'PO1',
    description:
      'Engineering knowledge: Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.',
  },
  {
    number: 'PO2',
    description:
      'Problem analysis: Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences.',
  },
  {
    number: 'PO3',
    description:
      'Design/development of solutions: Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for the public health and safety, and the cultural, societal, and environmental considerations.',
  },
  {
    number: 'PO4',
    description:
      'Conduct investigations of complex problems: Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data and synthesis of the information to provide valid conclusions.',
  },
  {
    number: 'PO5',
    description:
      'Modern tool usage: Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of the limitations.',
  },
  {
    number: 'PO6',
    description:
      'The engineer and society: Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice.',
  },
  {
    number: 'PO7',
    description:
      'Environment and sustainability: Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development.',
  },
  {
    number: 'PO8',
    description:
      'Ethics: Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.',
  },
  {
    number: 'PO9',
    description:
      'Individual and team work: Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.',
  },
  {
    number: 'PO10',
    description:
      'Communication: Communicate effectively on complex engineering activities with the engineering community and with society at large, such as, being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.',
  },
  {
    number: 'PO11',
    description:
      'Project management and finance: Demonstrate knowledge and understanding of the engineering and management principles and apply these to one's own work, as a member and leader in a team, to manage projects and in multidisciplinary environments.',
  },
  {
    number: 'PO12',
    description:
      'Life-long learning: Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.',
  },
] as const;

// Default assessment types
export const DEFAULT_ASSESSMENT_TYPES = [
  { name: 'CIA', code: 'cia', category: 'formative', isInternal: true, defaultMaxMarks: 30 },
  { name: 'MSE', code: 'mse', category: 'formative', isInternal: true, defaultMaxMarks: 40 },
  { name: 'TEE', code: 'tee', category: 'summative', isInternal: false, defaultMaxMarks: 100 },
  { name: 'Quiz', code: 'quiz', category: 'formative', isInternal: true, defaultMaxMarks: 10 },
  { name: 'Assignment', code: 'assignment', category: 'formative', isInternal: true, defaultMaxMarks: 20 },
  { name: 'Lab Exam', code: 'lab_exam', category: 'formative', isInternal: true, defaultMaxMarks: 25 },
  { name: 'Viva', code: 'viva', category: 'formative', isInternal: true, defaultMaxMarks: 20 },
  {
    name: 'Project Review',
    code: 'project_review',
    category: 'summative',
    isInternal: true,
    defaultMaxMarks: 50,
  },
] as const;

// Default course types
export const DEFAULT_COURSE_TYPES = [
  { name: 'Theory', code: 'theory', attendanceMode: 'daily', planType: 'teaching' },
  { name: 'Laboratory', code: 'laboratory', attendanceMode: 'batch_wise', planType: 'practical' },
  { name: 'Project', code: 'project', attendanceMode: 'daily', planType: 'project' },
  { name: 'Seminar', code: 'seminar', attendanceMode: 'daily', planType: 'teaching' },
  { name: 'Internship', code: 'internship', attendanceMode: 'daily', planType: 'project' },
  { name: 'Mini Project', code: 'mini_project', attendanceMode: 'daily', planType: 'project' },
  { name: 'Capstone', code: 'capstone', attendanceMode: 'daily', planType: 'project' },
] as const;

// Attainment levels
export const DEFAULT_ATTAINMENT_LEVELS = [
  { level: 3, label: 'High', min: 0.7, color: '#22c55e' },
  { level: 2, label: 'Medium', min: 0.5, color: '#f59e0b' },
  { level: 1, label: 'Low', min: 0.3, color: '#ef4444' },
  { level: 0, label: 'Not Attained', min: 0, color: '#dc2626' },
] as const;

// Mapping level weights
export const DEFAULT_MAPPING_WEIGHTS = {
  1: 1,
  2: 2,
  3: 3,
} as const;

// API routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
    TWO_FA: '/auth/2fa',
  },
  USERS: '/users',
  ROLES: '/roles',
  PERMISSIONS: '/permissions',
  ACADEMIC_YEARS: '/academic-years',
  DEPARTMENTS: '/departments',
  PROGRAMS: '/programs',
  CURRICULA: '/curricula',
  SEMESTERS: '/semesters',
  COURSE_TYPES: '/course-types',
  COURSES: '/courses',
  COURSE_OFFERINGS: '/course-offerings',
  BATCHES: '/batches',
  SECTIONS: '/sections',
  STUDENTS: '/students',
  FACULTY: '/faculty',
  OUTCOMES: '/outcomes',
  ATTAINMENT: '/attainment',
  ATTENDANCE: '/attendance',
  ASSESSMENTS: '/assessments',
  MARKS: '/marks',
  REPORTS: '/reports',
  DASHBOARD: '/dashboard',
  NOTIFICATIONS: '/notifications',
  AUDIT_LOGS: '/audit-logs',
} as const;

// File types
export const ALLOWED_FILE_TYPES = {
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  SPREADSHEET: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

export const ALL_ALLOWED_FILE_TYPES = [
  ...ALLOWED_FILE_TYPES.DOCUMENT,
  ...ALLOWED_FILE_TYPES.SPREADSHEET,
  ...ALLOWED_FILE_TYPES.IMAGE,
] as const;
