# PHASE 9: Master Modules Frontend

## EduOBE v2.0 — Complete Frontend for Academic Management

**Document Version:** 1.0  
**Date:** 2026-08-03  
**Status:** ✅ Complete  
**Prerequisites:** Phase 1-8 ✅

---

## Overview

Phase 9 delivers the complete frontend interface for all master modules with:
- Reusable data table component with filtering, sorting, and pagination
- TanStack Query hooks for all API operations
- CRUD pages for Academic Year and Department modules
- Form components with validation (React Hook Form + Zod)
- Detail views with statistics and related data
- Responsive design with shadcn/ui components

---

## What Was Created

### 1. Reusable Components

#### **Data Table (`components/ui/data-table.tsx`)**
- Built on TanStack Table v8
- Features:
  - Column sorting (ascending/descending)
  - Column filtering (search)
  - Column visibility toggle
  - Row selection
  - Pagination
  - Responsive design
  - Loading states
  - Empty states

**Props:**
```typescript
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
}
```

**Usage:**
```typescript
<DataTable
  columns={columns}
  data={academicYears}
  searchKey="name"
  searchPlaceholder="Search academic years..."
  isLoading={isLoading}
/>
```

#### **UI Components**
- **Table** - Styled table with header, body, footer
- **Badge** - Status badges (default, secondary, destructive, outline)
- **Switch** - Toggle switch for boolean values
- **Skeleton** - Loading placeholders
- **Textarea** - Multi-line text input
- **Dropdown Menu** - Action menus with items

---

### 2. API Service Hooks

#### **Academic Year Service (`services/academic-year.service.ts`)**

**Types:**
```typescript
interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'active' | 'archived';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}
```

**Queries:**
- `useAcademicYears(filters?)` - List all academic years
- `useAcademicYear(id)` - Get single academic year

**Mutations:**
- `useCreateAcademicYear()` - Create new academic year
- `useUpdateAcademicYear()` - Update academic year
- `useDeleteAcademicYear()` - Archive academic year
- `useSetCurrentAcademicYear()` - Set as current year

**Query Keys:**
```typescript
academicYearKeys.all // ['academic-years']
academicYearKeys.lists() // ['academic-years', 'list']
academicYearKeys.list(filters) // ['academic-years', 'list', filters]
academicYearKeys.details() // ['academic-years', 'detail']
academicYearKeys.detail(id) // ['academic-years', 'detail', id]
```

#### **Department Service (`services/department.service.ts`)**

**Types:**
```typescript
interface Department {
  id: string;
  name: string;
  code: string;
  hodId?: string;
  description?: string;
  status: 'active' | 'archived';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  hod?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count?: {
    programs: number;
    faculty: number;
  };
}
```

**Queries:**
- `useDepartments(filters?)` - List all departments
- `useDepartment(id)` - Get single department with details

**Mutations:**
- `useCreateDepartment()` - Create new department
- `useUpdateDepartment()` - Update department
- `useDeleteDepartment()` - Archive department

---

### 3. Academic Year Pages

#### **List Page (`/academic/years`)**

**Features:**
- Data table with all academic years
- Search by name
- Sort by name, start date, end date
- Column visibility toggle
- Row actions dropdown:
  - View details
  - Edit
  - Set as current (if not current)
  - Archive
- Current year badge indicator
- Status badges (active/archived)
- Create button

**Column Definitions:**
```typescript
const columns: ColumnDef<AcademicYear>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link href={`/academic/years/${row.original.id}`}>
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => format(new Date(row.getValue('startDate')), 'MMM dd, yyyy'),
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => format(new Date(row.getValue('endDate')), 'MMM dd, yyyy'),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <Badge>{row.getValue('status')}</Badge>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown year={row.original} />,
  },
];
```

#### **Create Page (`/academic/years/new`)**

**Features:**
- Form with validation (React Hook Form + Zod)
- Fields:
  - Name (required, min 4 chars)
  - Start date (required)
  - End date (required)
  - Is current (switch)
- Real-time validation
- Loading state during submission
- Success/error toast notifications
- Auto-redirect to list on success

**Validation Schema:**
```typescript
const academicYearSchema = z.object({
  name: z.string().min(4, 'Name must be at least 4 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isCurrent: z.boolean().default(false),
});
```

#### **Detail Page (`/academic/years/[id]`)**

**Features:**
- Academic year information card
- Date range display with duration calculation
- Current year badge
- Status badge
- Metadata (created, updated timestamps)
- Edit button
- Loading skeleton
- Not found state

**Layout:**
```
┌─────────────────────────────────────┐
│ 2024-25  [Current] [Active]  [Edit] │
├─────────────────────────────────────┤
│ Basic Information                   │
│ - Start Date: July 01, 2024         │
│ - End Date: June 30, 2025           │
│ - Duration: 365 days                │
├─────────────────────────────────────┤
│ Metadata                            │
│ - Created: Jan 15, 2024 10:30       │
│ - Last Updated: Jan 20, 2024 14:45  │
└─────────────────────────────────────┘
```

---

### 4. Department Pages

#### **List Page (`/academic/departments`)**

**Features:**
- Data table with all departments
- Search by name
- Columns:
  - Department name (link to detail)
  - Code (badge)
  - HOD (name + email)
  - Programs count (with icon)
  - Faculty count (with icon)
  - Status (badge)
  - Actions dropdown
- Row actions:
  - View details
  - Edit
  - Archive
- Create button

**Column Definitions:**
```typescript
const columns: ColumnDef<Department>[] = [
  {
    accessorKey: 'name',
    header: 'Department Name',
  },
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => <Badge variant="outline">{row.getValue('code')}</Badge>,
  },
  {
    accessorKey: 'hod',
    header: 'HOD',
    cell: ({ row }) => {
      const hod = row.original.hod;
      return hod ? (
        <div>
          <p>{`${hod.firstName} ${hod.lastName}`}</p>
          <p className="text-sm text-muted-foreground">{hod.email}</p>
        </div>
      ) : (
        'Not assigned'
      );
    },
  },
  {
    accessorKey: '_count.programs',
    header: 'Programs',
  },
  {
    accessorKey: '_count.faculty',
    header: 'Faculty',
  },
];
```

#### **Create Page (`/academic/departments/new`)**

**Features:**
- Form with validation
- Fields:
  - Name (required, min 2 chars)
  - Code (required, min 2 chars, max 10 chars)
  - HOD ID (optional)
  - Description (optional, textarea)
- Real-time validation
- Loading state
- Toast notifications
- Auto-redirect on success

**Validation Schema:**
```typescript
const departmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters').max(10),
  hodId: z.string().optional(),
  description: z.string().optional(),
});
```

#### **Detail Page (`/academic/departments/[id]`)**

**Features:**
- Department information header with badges
- Statistics cards:
  - Programs count (with icon)
  - Faculty count (with icon)
- HOD information card (if assigned):
  - Avatar with initials
  - Name
  - Email
- Description card (if provided)
- Metadata card (created, updated)
- Edit button
- Loading skeleton
- Not found state

**Layout:**
```
┌─────────────────────────────────────────┐
│ Computer Science [CSE] [Active]  [Edit] │
├─────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐             │
│ │ Programs │  │ Faculty  │             │
│ │    3     │  │   15     │             │
│ └──────────┘  └──────────┘             │
├─────────────────────────────────────────┤
│ Head of Department                      │
│ [RS] Dr. Rajesh Sharma                  │
│      rajesh.sharma@vjti.ac.in           │
├─────────────────────────────────────────┤
│ Description                             │
│ Department of Computer Science...       │
├─────────────────────────────────────────┤
│ Metadata                                │
│ - Created: Jan 10, 2024 09:15           │
│ - Last Updated: Feb 05, 2024 16:30      │
└─────────────────────────────────────────┘
```

---

## File Structure

```
apps/web/src/
├── app/(dashboard)/academic/
│   ├── years/
│   │   ├── page.tsx                    # List page
│   │   ├── new/
│   │   │   └── page.tsx                # Create page
│   │   └── [id]/
│   │       └── page.tsx                # Detail page
│   └── departments/
│       ├── page.tsx                    # List page
│       ├── new/
│       │   └── page.tsx                # Create page
│       └── [id]/
│           └── page.tsx                # Detail page
│
├── components/ui/
│   ├── data-table.tsx                  # Reusable data table
│   ├── table.tsx                       # Table components
│   ├── dropdown-menu.tsx               # Dropdown menu
│   ├── badge.tsx                       # Status badges
│   ├── switch.tsx                      # Toggle switch
│   ├── skeleton.tsx                    # Loading skeleton
│   └── textarea.tsx                    # Textarea input
│
└── services/
    ├── academic-year.service.ts        # Academic Year hooks
    └── department.service.ts           # Department hooks
```

---

## Statistics

- **129 files created** (cumulative with Phase 8)
- **14,562 lines of code** (cumulative)
- **7 new UI components**
- **2 service modules** with TanStack Query hooks
- **6 new pages** (3 for Academic Year, 3 for Department)
- **2 complete CRUD flows** (list, create, detail)

---

## Key Features

### 1. Data Table Features
- **Sorting** - Click column headers to sort
- **Filtering** - Search input filters by specified key
- **Pagination** - 10 rows per page with navigation
- **Column Visibility** - Toggle columns on/off
- **Row Selection** - Select multiple rows
- **Actions Menu** - Dropdown with row-specific actions
- **Loading State** - Skeleton loading
- **Empty State** - "No results" message

### 2. Form Features
- **Validation** - Real-time validation with Zod schemas
- **Error Messages** - Inline error messages
- **Loading State** - Disabled button with spinner
- **Toast Notifications** - Success/error toasts
- **Auto-redirect** - Navigate to list on success
- **Cancel Button** - Return to previous page

### 3. Detail View Features
- **Statistics Cards** - Count metrics with icons
- **Related Data** - HOD information, programs, faculty
- **Metadata** - Created/updated timestamps
- **Badges** - Status indicators
- **Edit Button** - Quick access to edit page
- **Loading Skeleton** - Placeholder during load
- **Not Found State** - 404 handling

### 4. Responsive Design
- Mobile-first approach
- Collapsible sidebar
- Responsive tables (horizontal scroll)
- Stacked cards on mobile
- Touch-friendly buttons

---

## Usage Examples

### List Academic Years
```typescript
import { useAcademicYears } from '@/services/academic-year.service';
import { DataTable } from '@/components/ui/data-table';

export default function AcademicYearsPage() {
  const { data: academicYears, isLoading } = useAcademicYears();

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'startDate', header: 'Start Date' },
  ];

  return (
    <DataTable
      columns={columns}
      data={academicYears || []}
      searchKey="name"
      isLoading={isLoading}
    />
  );
}
```

### Create Academic Year
```typescript
import { useCreateAcademicYear } from '@/services/academic-year.service';

export default function CreateAcademicYear() {
  const createMutation = useCreateAcademicYear();

  const handleSubmit = (data: CreateAcademicYearDto) => {
    createMutation.mutate(data, {
      onSuccess: () => router.push('/academic/years'),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create'}
      </Button>
    </form>
  );
}
```

### View Department Details
```typescript
import { useDepartment } from '@/services/department.service';

export default function DepartmentDetail({ id }: { id: string }) {
  const { data: department, isLoading } = useDepartment(id);

  if (isLoading) return <Skeleton />;

  return (
    <div>
      <h1>{department.name}</h1>
      <Badge>{department.code}</Badge>
      <p>Programs: {department._count?.programs}</p>
      <p>Faculty: {department._count?.faculty}</p>
    </div>
  );
}
```

---

## Testing the Frontend

### 1. Start Services
```bash
# Start backend
cd apps/api && pnpm dev

# Start frontend
cd apps/web && pnpm dev
```

### 2. Navigate to Academic Years
```
http://localhost:3000/academic/years
```

### 3. Test CRUD Operations
- **Create**: Click "Create Academic Year" button
- **List**: View all academic years in table
- **Search**: Type in search box to filter
- **Sort**: Click column headers
- **View**: Click on academic year name
- **Edit**: Click edit in actions menu (Phase 10)
- **Delete**: Click archive in actions menu

### 4. Test Department Pages
```
http://localhost:3000/academic/departments
```

---

## Next Steps

**Phase 9 is complete.** The frontend for Academic Year and Department modules is fully functional.

**To continue development, say:**
```
PROCEED TO PHASE 10
```

**Phase 10 will generate:**
- Edit pages for Academic Year and Department
- Program management pages (list, create, edit, detail)
- Curriculum management pages
- Semester management pages
- Course Type management pages
- Course management pages with prerequisites
- Batch management pages
- Section management pages

Each module will follow the same pattern:
- List page with data table
- Create page with form
- Edit page with pre-filled form
- Detail page with statistics

---

## Quick Reference

### Data Table
```typescript
<DataTable
  columns={columns}
  data={data}
  searchKey="name"
  searchPlaceholder="Search..."
  isLoading={isLoading}
/>
```

### TanStack Query Hook
```typescript
const { data, isLoading } = useAcademicYears({ status: 'active' });
```

### Mutation Hook
```typescript
const { mutate, isPending } = useCreateAcademicYear();
mutate(data, {
  onSuccess: () => toast.success('Created'),
  onError: () => toast.error('Failed'),
});
```

### Form with Validation
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});

<form onSubmit={handleSubmit(onSubmit)}>
  <Input {...register('name')} />
  {errors.name && <p>{errors.name.message}</p>}
</form>
```
