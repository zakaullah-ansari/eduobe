import { z } from 'zod';

import { emailSchema, passwordSchema, phoneSchema } from './common.schemas';

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  totpCode: z.string().length(6).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: phoneSchema.optional(),
  tenantId: z.string().cuid(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ['confirmNewPassword'],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const verifyEmailSchema = z.object({
  token: z.string(),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const enable2FASchema = z.object({
  totpCode: z.string().length(6, 'TOTP code must be 6 digits'),
});

export type Enable2FAInput = z.infer<typeof enable2FASchema>;

// User schemas
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: phoneSchema.optional(),
  tenantId: z.string().cuid(),
  roleIds: z.array(z.string().cuid()).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: phoneSchema.optional(),
  avatar: z.string().url().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Role and permission schemas
export const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  code: z.string().min(1, 'Role code is required'),
  description: z.string().optional(),
  tenantId: z.string().cuid(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export const assignPermissionSchema = z.object({
  permissionIds: z.array(z.string().cuid()),
});

export type AssignPermissionInput = z.infer<typeof assignPermissionSchema>;

export const assignRoleSchema = z.object({
  roleIds: z.array(z.string().cuid()),
  scopeType: z.string().optional(),
  scopeId: z.string().optional(),
});

export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
