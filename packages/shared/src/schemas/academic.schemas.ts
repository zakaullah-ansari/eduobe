import { z } from 'zod';

// Academic Year schemas
export const createAcademicYearSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  tenantId: z.string().cuid(),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type CreateAcademicYearInput = z.infer<typeof createAcademicYearSchema>;

export const updateAcademicYearSchema = z.object({
  name: z.string().min(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isCurrent: z.boolean().optional(),
  status: z.enum(['active', 'archived']).optional(),
});

export type UpdateAcademicYearInput = z.infer<typeof updateAcademicYearSchema>;

// Department schemas
export const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  code: z.string().min(1, 'Department code is required'),
  tenantId: z.string().cuid(),
  hodId: z.string().cuid().optional(),
  vision: z.string().optional(),
  mission: z.string().optional(),
  description: z.string().optional(),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;

export const updateDepartmentSchema = z.object({
  name: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
  hodId: z.string().cuid().optional().nullable(),
  vision: z.string().optional(),
  mission: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'archived']).optional(),
});

export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;

// Program schemas
export const createProgramSchema = z.object({
  name: z.string().min(1, 'Program name is required'),
  code: z.string().min(1, 'Program code is required'),
  departmentId: z.string().cuid(),
  tenantId: z.string().cuid(),
  degreeType: z.enum(['btech', 'mtech', 'diploma', 'phd']),
  duration: z.number().int().positive(),
  totalSemesters: z.number().int().positive(),
  totalCredits: z.number().int().positive().optional(),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;

export const updateProgramSchema = z.object({
  name: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
  degreeType: z.enum(['btech', 'mtech', 'diploma', 'phd']).optional(),
  duration: z.number().int().positive().optional(),
  totalSemesters: z.number().int().positive().optional(),
  totalCredits: z.number().int().positive().optional(),
  status: z.enum(['active', 'archived']).optional(),
});

export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;

// Curriculum schemas
export const createCurriculumSchema = z.object({
  programId: z.string().cuid(),
  tenantId: z.string().cuid(),
  version: z.string().min(1, 'Version is required'),
  name: z.string().min(1, 'Name is required'),
  effectiveFrom: z.string().min(1, 'Effective from is required'),
});

export type CreateCurriculumInput = z.infer<typeof createCurriculumSchema>;

export const updateCurriculumSchema = z.object({
  version: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  effectiveFrom: z.string().min(1).optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
});

export type UpdateCurriculumInput = z.infer<typeof updateCurriculumSchema>;

// Semester schemas
export const createSemesterSchema = z.object({
  curriculumId: z.string().cuid(),
  tenantId: z.string().cuid(),
  number: z.number().int().min(1).max(12),
  name: z.string().min(1, 'Name is required'),
  totalCredits: z.number().int().positive().optional(),
});

export type CreateSemesterInput = z.infer<typeof createSemesterSchema>;

export const updateSemesterSchema = z.object({
  number: z.number().int().min(1).max(12).optional(),
  name: z.string().min(1).optional(),
  totalCredits: z.number().int().positive().optional(),
  status: z.enum(['active', 'archived']).optional(),
});

export type UpdateSemesterInput = z.infer<typeof updateSemesterSchema>;

// Course Type schemas
export const createCourseTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  tenantId: z.string().cuid(),
  description: z.string().optional(),
  attendanceMode: z.enum(['daily', 'batch_wise', 'experiment_wise']),
  hasPractical: z.boolean().default(false),
  hasProject: z.boolean().default(false),
  planType: z.enum(['teaching', 'practical', 'project', 'none']),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export type CreateCourseTypeInput = z.infer<typeof createCourseTypeSchema>;

export const updateCourseTypeSchema = z.object({
  name: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
  description: z.string().optional(),
  attendanceMode: z.enum(['daily', 'batch_wise', 'experiment_wise']).optional(),
  hasPractical: z.boolean().optional(),
  hasProject: z.boolean().optional(),
  planType: z.enum(['teaching', 'practical', 'project', 'none']).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  status: z.enum(['active', 'archived']).optional(),
});

export type UpdateCourseTypeInput = z.infer<typeof updateCourseTypeSchema>;

// Course schemas
export const createCourseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  code: z.string().min(1, 'Course code is required'),
  semesterId: z.string().cuid(),
  curriculumId: z.string().cuid(),
  courseTypeId: z.string().cuid(),
  tenantId: z.string().cuid(),
  shortName: z.string().optional(),
  credits: z.number().int().positive(),
  lectureHours: z.number().int().min(0).default(0),
  tutorialHours: z.number().int().min(0).default(0),
  practicalHours: z.number().int().min(0).default(0),
  description: z.string().optional(),
  syllabusUrl: z.string().url().optional(),
  prerequisites: z.array(z.string()).optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = z.object({
  name: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
  shortName: z.string().optional(),
  credits: z.number().int().positive().optional(),
  lectureHours: z.number().int().min(0).optional(),
  tutorialHours: z.number().int().min(0).optional(),
  practicalHours: z.number().int().min(0).optional(),
  description: z.string().optional(),
  syllabusUrl: z.string().url().optional(),
  prerequisites: z.array(z.string()).optional(),
  status: z.enum(['active', 'archived']).optional(),
});

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

// Batch schemas
export const createBatchSchema = z.object({
  name: z.string().min(1, 'Batch name is required'),
  programId: z.string().cuid(),
  academicYearId: z.string().cuid(),
  tenantId: z.string().cuid(),
  admissionYear: z.number().int().min(2000).max(2100),
  currentSemester: z.number().int().min(1).default(1),
});

export type CreateBatchInput = z.infer<typeof createBatchSchema>;

export const updateBatchSchema = z.object({
  name: z.string().min(1).optional(),
  currentSemester: z.number().int().min(1).optional(),
  status: z.enum(['active', 'graduated', 'archived']).optional(),
});

export type UpdateBatchInput = z.infer<typeof updateBatchSchema>;

// Section schemas
export const createSectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  batchId: z.string().cuid(),
  tenantId: z.string().cuid(),
  maxStrength: z.number().int().positive().default(60),
});

export type CreateSectionInput = z.infer<typeof createSectionSchema>;

export const updateSectionSchema = z.object({
  name: z.string().min(1).optional(),
  maxStrength: z.number().int().positive().optional(),
  status: z.enum(['active', 'archived']).optional(),
});

export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
