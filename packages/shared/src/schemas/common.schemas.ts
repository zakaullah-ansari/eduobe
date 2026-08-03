import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number');

export const urlSchema = z.string().url('Invalid URL').optional().or(z.literal(''));

// Pagination schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// API Response schemas
export const apiSuccessResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    message: z.string(),
    data: dataSchema,
    meta: z
      .object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
      })
      .optional(),
  });

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string(),
  statusCode: z.number(),
  details: z.array(z.object({ field: z.string(), message: z.string() })).optional(),
  timestamp: z.string(),
  path: z.string(),
  requestId: z.string(),
});

export type ApiSuccessResponse<T> = z.infer<ReturnType<typeof apiSuccessResponseSchema<T>>>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

// Date schemas
export const dateSchema = z.coerce.date();
export const dateStringSchema = z.string().datetime();

// ID schemas
export const cuidSchema = z.string().cuid();
export const cuidArraySchema = z.array(cuidSchema);

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  category: z.enum(['course_file', 'audit', 'student', 'faculty', 'administrative']),
  subcategory: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;

// Search and filter schemas
export const searchSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  dateFrom: dateStringSchema.optional(),
  dateTo: dateStringSchema.optional(),
});

export type SearchInput = z.infer<typeof searchSchema>;

// Re-export zod for convenience
export { z };
