# PHASE 7: Authentication System

## EduOBE v2.0 — Complete Full-Stack Authentication

**Document Version:** 1.0  
**Date:** 2026-08-03  
**Status:** ✅ Complete  
**Prerequisites:** Phase 1 ✅ Phase 2 ✅ Phase 3 ✅ Phase 4 ✅ Phase 5 ✅ Phase 6 ✅

---

## Overview

Phase 7 delivers a complete, production-ready authentication system with:
- Email/password authentication with JWT tokens
- Refresh token rotation with family tracking
- Password reset flow with email notifications
- User registration with validation
- Profile management
- Automatic token refresh on expiry
- Full-stack implementation (NestJS backend + Next.js frontend)

---

## Backend (NestJS)

### Auth Module Structure

```
apps/api/src/modules/auth/
├── auth.module.ts           # Module definition
├── auth.controller.ts       # 10 API endpoints
├── auth.service.ts          # Business logic
└── dto/
    └── auth.dto.ts          # 9 DTOs with validation
```

### API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Login with email/password | No |
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/refresh` | Refresh access token | No |
| POST | `/api/v1/auth/logout` | Logout and revoke tokens | Yes |
| POST | `/api/v1/auth/forgot-password` | Request password reset | No |
| POST | `/api/v1/auth/reset-password` | Reset password with token | No |
| POST | `/api/v1/auth/change-password` | Change password | Yes |
| GET | `/api/v1/auth/me` | Get current user profile | Yes |
| PATCH | `/api/v1/auth/me` | Update profile | Yes |

### Auth Service Features

**1. Login:**
- Validates email and password
- Hashes password with Argon2id
- Generates JWT access token (15 min expiry)
- Generates refresh token (7 day expiry)
- Stores refresh token in database with family tracking
- Updates last login timestamp
- Emits `USER_LOGIN` event

**2. Register:**
- Validates input with DTO
- Checks for duplicate email
- Hashes password with Argon2id
- Creates user in database
- Assigns default role
- Sends welcome email
- Emits `USER_CREATED` event

**3. Refresh Token:**
- Verifies refresh token signature
- Checks token in database
- Validates not revoked and not expired
- Revokes old token
- Generates new access and refresh tokens
- Implements token rotation

**4. Logout:**
- Revokes specific refresh token (if provided)
- Or revokes all refresh tokens for user
- Emits `USER_LOGOUT` event

**5. Forgot Password:**
- Generates secure reset token (32 bytes hex)
- Stores token in user metadata with 1-hour expiry
- Sends reset email with link
- Always returns success (prevents email enumeration)

**6. Reset Password:**
- Validates reset token
- Checks token expiry
- Hashes new password
- Updates user password
- Clears reset token from metadata
- Revokes all refresh tokens (force re-login)

**7. Change Password:**
- Verifies current password
- Hashes new password
- Updates user password
- Revokes all refresh tokens (force re-login)

**8. Get Profile:**
- Returns user with tenant, roles, and permissions
- Includes metadata (2FA status, login count, etc.)

**9. Update Profile:**
- Updates first name, last name, phone, avatar
- Emits `USER_UPDATED` event

### Security Features

**Password Hashing:**
```typescript
// Argon2id with OWASP recommended parameters
await hashPassword(password, {
  type: argon2.argon2id,
  memoryCost: 65536,  // 64 MB
  timeCost: 3,
  parallelism: 4,
  hashLength: 32,
});
```

**JWT Token Structure:**
```typescript
// Access token (15 min)
{
  sub: user.id,
  email: user.email,
  tenantId: user.tenantId,
  roles: ['admin', 'faculty'],
  permissions: ['student:read', 'marks:write'],
  iat: 1691049600,
  exp: 1691050500
}

// Refresh token (7 days)
{
  sub: user.id,
  tenantId: user.tenantId,
  type: 'refresh',
  iat: 1691049600,
  exp: 1691654400
}
```

**Refresh Token Rotation:**
- Each refresh generates a new token
- Old token is revoked
- Family tracking prevents token theft
- If revoked token is reused, entire family is revoked

**Token Storage:**
```typescript
// RefreshToken table
{
  id: cuid,
  userId: string,
  token: string (hashed),
  family: string (UUID),
  expiresAt: DateTime,
  revokedAt: DateTime?
}
```

---

## Frontend (Next.js)

### Auth Pages

```
apps/web/src/app/(auth)/
├── login/
│   └── page.tsx              # Login form
├── register/
│   └── page.tsx              # Registration form
├── forgot-password/
│   └── page.tsx              # Request reset email
└── reset-password/
    └── [token]/
        └── page.tsx          # Reset password form
```

### Login Page

**Features:**
- React Hook Form with Zod validation
- Email and password fields
- Tenant ID field (optional)
- Loading state with spinner
- Error handling with toast notifications
- Redirect to original URL after login
- Stores token in cookie for middleware

**Validation:**
```typescript
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  tenantId: z.string().optional(),
});
```

**Flow:**
1. User enters email, password, and optional tenant ID
2. Form validates input
3. POST to `/api/v1/auth/login`
4. Store access token in Zustand and cookie
5. Store user data in Zustand
6. Redirect to original URL or `/dashboard`

### Register Page

**Features:**
- React Hook Form with Zod validation
- Password strength validation
- Password confirmation
- Tenant ID required
- Phone number (optional)
- Loading state
- Error handling

**Validation:**
```typescript
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
      message: 'Password must contain uppercase, lowercase, number and special character',
    }),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  tenantId: z.string().min(1, 'Tenant ID is required'),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
```

### Forgot Password Page

**Features:**
- Email and tenant ID fields
- Success state with email sent message
- Loading state
- Error handling

**Flow:**
1. User enters email and tenant ID
2. POST to `/api/v1/auth/forgot-password`
3. Show success message (even if email doesn't exist)
4. User checks email for reset link

### Reset Password Page

**Features:**
- Token validation from URL
- New password field with strength validation
- Password confirmation
- Loading state
- Error handling
- Redirect to login after success

**Flow:**
1. User clicks reset link from email
2. Token extracted from URL query params
3. User enters new password
4. POST to `/api/v1/auth/reset-password` with token
5. Redirect to login page

### Auth Service Hooks

**TanStack Query Mutations:**

```typescript
// Login
const loginMutation = useLogin();
loginMutation.mutate({ email, password, tenantId });

// Register
const registerMutation = useRegister();
registerMutation.mutate({ email, password, firstName, lastName, tenantId });

// Forgot Password
const forgotPasswordMutation = useForgotPassword();
forgotPasswordMutation.mutate({ email, tenantId });

// Reset Password
const resetPasswordMutation = useResetPassword();
resetPasswordMutation.mutate({ token, newPassword });

// Change Password
const changePasswordMutation = useChangePassword();
changePasswordMutation.mutate({ currentPassword, newPassword });

// Update Profile
const updateProfileMutation = useUpdateProfile();
updateProfileMutation.mutate({ firstName, lastName, phone });

// Logout
const logoutMutation = useLogout();
logoutMutation.mutate(refreshToken);
```

**Queries:**

```typescript
// Get Profile
const { data: profile, isLoading } = useProfile();
```

### User Menu Component

**Features:**
- Displays user name and email
- Profile button (navigates to `/settings/profile`)
- Settings button (navigates to `/settings`)
- Logout button (calls logout mutation)
- Responsive design

**Implementation:**
```typescript
export function UserMenu() {
  const { user, logout } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex items-center gap-4">
      <div>
        <p>{user.firstName} {user.lastName}</p>
        <p>{user.email}</p>
      </div>
      <Button onClick={handleLogout}>
        <LogOut />
      </Button>
    </div>
  );
}
```

---

## Token Management

### Access Token Flow

```
1. User logs in → receives access token (15 min)
2. Access token stored in Zustand (memory)
3. Access token stored in cookie (for middleware)
4. API client adds token to Authorization header
5. On 401 response:
   a. Call /auth/refresh with refresh token
   b. Receive new access token
   c. Update Zustand and cookie
   d. Retry original request
6. If refresh fails:
   a. Logout user
   b. Clear tokens
   c. Redirect to /login
```

### Refresh Token Flow

```
1. User logs in → receives refresh token (7 days)
2. Refresh token stored in httpOnly cookie (backend)
3. Refresh token stored in database with family
4. On access token expiry:
   a. POST /auth/refresh with refresh token
   b. Backend verifies token
   c. Backend revokes old token
   d. Backend generates new access + refresh tokens
   e. Frontend receives new tokens
   f. Frontend updates Zustand and cookie
5. Token rotation prevents replay attacks
```

### Cookie Management

```typescript
// Set cookie after login
document.cookie = `auth-token=${accessToken}; path=/; max-age=${15 * 60}`;

// Clear cookie on logout
document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

// Middleware reads cookie
const token = request.cookies.get('auth-token')?.value;
```

---

## Security Best Practices

### 1. Password Security
- Argon2id hashing (memory-hard, GPU-resistant)
- Minimum 8 characters with complexity requirements
- No password hints in error messages

### 2. Token Security
- Short-lived access tokens (15 min)
- Long-lived refresh tokens (7 days)
- Refresh token rotation
- Family tracking for theft detection
- httpOnly cookies for refresh tokens (backend)

### 3. Email Security
- Password reset tokens expire in 1 hour
- Reset tokens are single-use
- Email enumeration prevention (always return success)
- Secure random token generation (32 bytes)

### 4. Session Security
- Logout revokes all refresh tokens
- Password change forces re-login
- Token family revocation on suspicious activity

### 5. Input Validation
- DTO validation with class-validator
- Zod schemas on frontend
- SQL injection prevention (Prisma)
- XSS prevention (React auto-escaping)

---

## Testing the Authentication System

### 1. Register a New User

**Request:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@vjti.ac.in",
    "password": "Test@1234",
    "firstName": "Test",
    "lastName": "User",
    "tenantId": "clx..."
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "clx...",
    "email": "test@vjti.ac.in",
    "firstName": "Test",
    "lastName": "User"
  }
}
```

### 2. Login

**Request:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@vjti.ac.in",
    "password": "Test@1234"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clx...",
      "email": "test@vjti.ac.in",
      "firstName": "Test",
      "lastName": "User",
      "roles": ["student"],
      "permissions": ["student:read:own"]
    }
  }
}
```

### 3. Get Profile (Protected)

**Request:**
```bash
curl -X GET http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "id": "clx...",
    "email": "test@vjti.ac.in",
    "firstName": "Test",
    "lastName": "User",
    "tenantId": "clx...",
    "tenantName": "VJTI",
    "roles": [
      {
        "id": "clx...",
        "code": "student",
        "name": "Student"
      }
    ],
    "permissions": ["student:read:own"],
    "emailVerified": true,
    "twoFactorEnabled": false,
    "lastLoginAt": "2026-08-03T10:30:00Z",
    "loginCount": 1
  }
}
```

### 4. Refresh Token

**Request:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 5. Logout

**Request:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Phase 7 Checklist

- [x] Auth module with complete structure
- [x] Auth controller with 10 endpoints
- [x] Auth service with business logic
- [x] 9 DTOs with class-validator
- [x] JWT strategy for Passport
- [x] Password hashing with Argon2id
- [x] Refresh token rotation with family tracking
- [x] Email verification support
- [x] Password reset flow
- [x] Event emission for audit trail
- [x] Login page with React Hook Form + Zod
- [x] Register page with password validation
- [x] Forgot password page
- [x] Reset password page
- [x] User menu component
- [x] Auth service hooks (TanStack Query)
- [x] Token management with cookies
- [x] Automatic token refresh on 401
- [x] Logout functionality
- [x] Profile management

---

## Next Steps

**Phase 7 is complete.** The authentication system is production-ready.

**To continue development, say:**
```
PROCEED TO PHASE 8
```

**Phase 8 will generate Master Modules Backend:**
- Academic Year CRUD
- Department management
- Program management
- Curriculum management
- Semester management
- Course Type management
- Course management
- Batch management
- Section management

---

## Quick Reference

### Login
```typescript
const { mutate: login } = useLogin();
login({ email, password, tenantId });
```

### Register
```typescript
const { mutate: register } = useRegister();
register({ email, password, firstName, lastName, tenantId });
```

### Get Profile
```typescript
const { data: profile } = useProfile();
```

### Update Profile
```typescript
const { mutate: updateProfile } = useUpdateProfile();
updateProfile({ firstName, lastName });
```

### Logout
```typescript
const { mutate: logout } = useLogout();
logout(refreshToken);
```

### Check Auth State
```typescript
const { isAuthenticated, user, hasPermission, hasRole } = useAuthStore();

if (hasPermission('student:read')) {
  // Show student list
}
```
