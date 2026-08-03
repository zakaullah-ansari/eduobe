'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Edit, Trash, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import {
  useDepartments,
  useDeleteDepartment,
  type Department,
} from '@/services/department.service';
import { Badge } from '@/components/ui/badge';

export default function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();
  const deleteMutation = useDeleteDepartment();

  const columns: ColumnDef<Department>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Department Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const dept = row.original;
          return (
            <Link
              href={`/academic/departments/${dept.id}`}
              className="font-medium hover:underline"
            >
              {dept.name}
            </Link>
          );
        },
      },
      {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue('code')}</Badge>
        ),
      },
      {
        accessorKey: 'hod',
        header: 'HOD',
        cell: ({ row }) => {
          const hod = row.original.hod;
          return hod ? (
            <div className="text-sm">
              <p className="font-medium">{`${hod.firstName} ${hod.lastName}`}</p>
              <p className="text-muted-foreground">{hod.email}</p>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Not assigned</span>
          );
        },
      },
      {
        accessorKey: '_count.programs',
        header: () => (
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Programs
          </div>
        ),
        cell: ({ row }) => row.original._count?.programs || 0,
      },
      {
        accessorKey: '_count.faculty',
        header: () => (
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Faculty
          </div>
        ),
        cell: ({ row }) => row.original._count?.faculty || 0,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          return (
            <Badge variant={status === 'active' ? 'default' : 'secondary'}>
              {status}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const dept = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/departments/${dept.id}`}>View Details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/departments/${dept.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    if (confirm('Are you sure you want to archive this department?')) {
                      deleteMutation.mutate(dept.id);
                    }
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [deleteMutation]
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground mt-2">
            Manage academic departments and HOD assignments
          </p>
        </div>
        <Button asChild>
          <Link href="/academic/departments/new">Create Department</Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={departments || []}
        searchKey="name"
        searchPlaceholder="Search departments..."
        isLoading={isLoading}
      />
    </div>
  );
}
