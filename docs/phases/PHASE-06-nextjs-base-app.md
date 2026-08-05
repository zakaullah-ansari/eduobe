# PHASE 6: Next.js Base App

## EduOBE v2.0 — Complete Frontend Infrastructure

**Document Version:** 1.0  
**Date:** 2026-08-03  
**Status:** ✅ Complete  
**Prerequisites:** Phase 1 ✅ Phase 2 ✅ Phase 3 ✅ Phase 4 ✅ Phase 5 ✅

---

## Overview

Phase 6 delivers the complete Next.js 14 frontend infrastructure including:
- Next.js 14 application with App Router
- Tailwind CSS with shadcn/ui component system
- Theme system (light/dark/system)
- Authentication middleware and route protection
- API client with Axios and token refresh
- State management (Zustand for client state, TanStack Query for server state)
- Essential UI components (Button, Input, Label, Card, Toaster)
- Route groups for auth, dashboard, and public pages

---

## Application Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout with providers
│   │   ├── page.tsx                      # Landing page
│   │   ├── globals.css                   # Global styles with CSS variables
│   │   │
│   │   ├── (auth)/                       # Auth route group (no sidebar)
│   │   │   └── login/
│   │   │       └── page.tsx              # Login page
│   │   │
│   │   ├── (dashboard)/                  # Dashboard route group (with sidebar)
│   │   │   ├── layout.tsx                # Dashboard layout with sidebar
│   │   │   └── dashboard/
│   │   │       └── page.tsx              # Dashboard home
│   │   │
│   │   └── (public)/                     # Public routes (no auth required)
│   │       ├── pricing/
│   │       └── features/
│   │
│   ├── components/
│   │   ├── ui/                           # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── card.tsx
│   │   │   └── sonner.tsx
│   │   │
│   │   ├── theme-provider.tsx            # Theme context provider
│   │   └── query-provider.tsx            # TanStack Query provider
│   │
│   ├── stores/                           # Zustand stores
│   │   ├── auth-store.ts                 # Auth state (user, token, permissions)
│   │   └── ui-store.ts                   # UI state (sidebar, command palette)
│   │
│   ├── lib/
│   │   ├── utils.ts                      # Utility functions (cn)
│   │   └── api-client.ts                 # Axios instance with interceptors
│   │
│   └── middleware.ts                     # Auth and tenant middleware
│
├── public/                               # Static assets
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

---

## Key Components

### 1. Root Layout (`app/layout.tsx`)

**Features:**
- Inter font from Google Fonts
- ThemeProvider for dark/light/system modes
- QueryProvider for TanStack Query
- Toaster for notifications (Sonner)
- Metadata for SEO

**Providers Stack:**
```
<html>
  <body>
    <ThemeProvider>        {/* Dark/light mode */}
      <QueryProvider>      {/* Server state management */}
        {children}
        <Toaster />        {/* Toast notifications */}
      </QueryProvider>
    </ThemeProvider>
  </body>
</html>
```

### 2. Middleware (`middleware.ts`)

**Route Protection:**
- Public routes: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/pricing`, `/features`
- Protected routes: All other routes require authentication
- Auto-redirect: Unauthenticated users → `/login`, authenticated users on auth pages → `/dashboard`
- Preserves redirect URL for post-login navigation

**Implementation:**
```typescript
// Check auth token in cookies
const token = request.cookies.get('auth-token')?.value;

// Redirect logic
if (!isPublicRoute && !token) {
  return NextResponse.redirect(loginUrl);
}
```

### 3. Theme System

**ThemeProvider:**
- Uses `next-themes` for theme management
- Supports light, dark, and system modes
- CSS variables for dynamic theming
- No flash on page load (suppressHydrationWarning)

**CSS Variables (globals.css):**
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode colors ... */
}
```

**Usage:**
```typescript
// Toggle theme
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();
setTheme('dark');
```

### 4. API Client (`lib/api-client.ts`)

**Features:**
- Axios instance with base URL configuration
- Request interceptor: Adds JWT token to Authorization header
- Response interceptor: Handles 401 errors and token refresh
- Automatic token refresh on expiry
- Logout on refresh failure
- Type-safe response and error types

**Token Refresh Flow:**
```typescript
// 1. Request fails with 401
// 2. Interceptor catches error
// 3. Calls /auth/refresh endpoint
// 4. Updates token in store
// 5. Retries original request
// 6. If refresh fails, logout and redirect to /login
```

**Usage:**
```typescript
import { apiClient } from '@/lib/api-client';

// GET request
const response = await apiClient.get('/students');

// POST request
const response = await apiClient.post('/students', data);

// With query params
const response = await apiClient.get('/students', {
  params: { page: 1, limit: 20 }
});
```

### 5. State Management

**Auth Store (Zustand):**
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}
```

**Features:**
- Persisted to localStorage
- Permission and role checking
- Type-safe user object

**Usage:**
```typescript
const { user, isAuthenticated, logout, hasPermission } = useAuthStore();

if (hasPermission('student:read')) {
  // Show student list
}
```

**UI Store (Zustand):**
```typescript
interface UIState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  toggleSidebar: () => void;
  toggleCommandPalette: () => void;
}
```

**Usage:**
```typescript
const { sidebarOpen, toggleSidebar } = useUIStore();
```

**TanStack Query (Server State):**
```typescript
// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['students', filters],
  queryFn: () => apiClient.get('/students', { params: filters }),
});

// Mutate data
const mutation = useMutation({
  mutationFn: (data) => apiClient.post('/students', data),
  onSuccess: () => queryClient.invalidateQueries(['students']),
});
```

### 6. UI Components (shadcn/ui)

**Button:**
```typescript
<Button variant="default" size="default">
  Click me
</Button>

<Button variant="destructive" size="sm">
  Delete
</Button>

<Button variant="outline" size="lg" asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

**Variants:**
- `default` — Primary button
- `destructive` — Danger button
- `outline` — Bordered button
- `secondary` — Secondary button
- `ghost` — Transparent button
- `link` — Link-style button

**Sizes:**
- `default` — h-10 px-4 py-2
- `sm` — h-9 px-3
- `lg` — h-11 px-8
- `icon` — h-10 w-10

**Input:**
```typescript
<Input
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**Label:**
```typescript
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

**Card:**
```typescript
<Card>
  <CardHeader>
    <CardTitle>Student Details</CardTitle>
    <CardDescription>View and edit student information</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Footer actions */}
  </CardFooter>
</Card>
```

**Toaster (Sonner):**
```typescript
import { toast } from 'sonner';

// Success toast
toast.success('Student created successfully');

// Error toast
toast.error('Failed to create student');

// Loading toast
toast.loading('Creating student...');

// Custom toast
toast('Custom message', {
  description: 'Additional details',
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo'),
  },
});
```

### 7. Route Groups

**(auth) Group:**
- No sidebar
- Centered layout
- Routes: `/login`, `/register`, `/forgot-password`, `/reset-password`

**(dashboard) Group:**
- Sidebar navigation
- Header with breadcrumb
- Routes: `/dashboard`, `/students`, `/faculty`, `/courses`, etc.

**(public) Group:**
- No authentication required
- Marketing pages
- Routes: `/pricing`, `/features`

### 8. Tailwind Configuration

**Features:**
- Dark mode via `class` strategy
- CSS variables for colors (shadcn pattern)
- Custom animations (accordion)
- Container with max-width
- Inter font family

**Usage:**
```typescript
<div className="bg-background text-foreground">
  <Button className="bg-primary hover:bg-primary/90">
    Click me
  </Button>
</div>
```

---

## Styling System

### CSS Variables

**Light Mode:**
```css
--background: 0 0% 100%;           /* White */
--foreground: 222.2 84% 4.9%;      /* Dark blue-gray */
--primary: 221.2 83.2% 53.3%;      /* Blue */
--secondary: 210 40% 96.1%;        /* Light gray */
--muted: 210 40% 96.1%;            /* Light gray */
--accent: 210 40% 96.1%;           /* Light gray */
--destructive: 0 84.2% 60.2%;      /* Red */
--border: 214.3 31.8% 91.4%;       /* Light border */
--ring: 221.2 83.2% 53.3%;         /* Blue */
```

**Dark Mode:**
```css
--background: 222.2 84% 4.9%;      /* Dark blue-gray */
--foreground: 210 40% 98%;         /* White */
--primary: 217.2 91.2% 59.8%;      /* Light blue */
--secondary: 217.2 32.6% 17.5%;    /* Dark gray */
--muted: 217.2 32.6% 17.5%;        /* Dark gray */
--accent: 217.2 32.6% 17.5%;       /* Dark gray */
--destructive: 0 62.8% 30.6%;      /* Dark red */
--border: 217.2 32.6% 17.5%;       /* Dark border */
--ring: 224.3 76.3% 48%;           /* Blue */
```

### Custom Scrollbar

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-muted;
}

::-webkit-scrollbar-thumb {
  @apply bg-muted-foreground/30 rounded-full;
}
```

### Focus Styles

```css
*:focus-visible {
  @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
}
```

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Type check
pnpm type-check
```

---

## Environment Variables

```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# App
NEXT_PUBLIC_APP_NAME=EduOBE
NEXT_PUBLIC_APP_VERSION=2.0.0
```

---

## Testing the Setup

### 1. Start Services
```bash
# Start backend (if not running)
cd apps/api
pnpm dev

# Start frontend
cd apps/web
pnpm dev
```

### 2. Visit Pages
- Landing page: `http://localhost:3000`
- Login page: `http://localhost:3000/login`
- Dashboard (protected): `http://localhost:3000/dashboard` (redirects to login)

### 3. Test Theme Toggle
```typescript
// Add to any page
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();

<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  Toggle Theme
</button>
```

### 4. Test API Client
```typescript
// In any component
import { apiClient } from '@/lib/api-client';

useEffect(() => {
  apiClient.get('/health').then(console.log);
}, []);
```

---

## Phase 6 Checklist

- [x] Next.js 14 application with App Router
- [x] Root layout with providers (Theme, Query, Toaster)
- [x] Global CSS with CSS variables for theming
- [x] Tailwind CSS configuration with shadcn preset
- [x] PostCSS configuration
- [x] TypeScript configuration
- [x] Next.js configuration with transpilePackages
- [x] Middleware for auth and route protection
- [x] Theme system (light/dark/system) with next-themes
- [x] API client with Axios and token refresh
- [x] Auth store with Zustand (persisted)
- [x] UI store with Zustand
- [x] TanStack Query setup with devtools
- [x] shadcn/ui components (Button, Input, Label, Card)
- [x] Toaster with Sonner
- [x] Route groups ((auth), (dashboard), (public))
- [x] Login page placeholder
- [x] Dashboard layout placeholder
- [x] Dashboard home page placeholder
- [x] Landing page
- [x] Utility functions (cn)
- [x] Custom scrollbar styles
- [x] Focus styles
- [x] Smooth transitions

---

## Next Steps

**Phase 6 is complete.** The frontend infrastructure is ready for feature development.

**To continue development, say:**
```
PROCEED TO PHASE 7
```

**Phase 7 will generate the Authentication System:**
- Login form with validation (React Hook Form + Zod)
- Register form
- Forgot password flow
- Reset password flow
- 2FA setup and verification
- JWT token management
- Auth service with API integration
- Protected route components
- User menu and logout

---

## Quick Reference

### Theme Toggle
```typescript
import { useTheme } from 'next-themes';
const { theme, setTheme } = useTheme();
```

### API Request
```typescript
import { apiClient } from '@/lib/api-client';
const response = await apiClient.get('/students');
```

### Auth State
```typescript
import { useAuthStore } from '@/stores/auth-store';
const { user, isAuthenticated, logout } = useAuthStore();
```

### UI State
```typescript
import { useUIStore } from '@/stores/ui-store';
const { sidebarOpen, toggleSidebar } = useUIStore();
```

### Server State
```typescript
import { useQuery } from '@tanstack/react-query';
const { data, isLoading } = useQuery({
  queryKey: ['students'],
  queryFn: () => apiClient.get('/students'),
});
```

### Toast Notification
```typescript
import { toast } from 'sonner';
toast.success('Success message');
```

### Utility Function
```typescript
import { cn } from '@/lib/utils';
<div className={cn('base-class', condition && 'conditional-class')} />
```
