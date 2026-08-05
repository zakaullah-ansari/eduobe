'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Edit, Trash, Star } from 'lucide-react';
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
  useAcademicYears,
  useDeleteAcademicYear,
  useSetCurrentAcademicYear,
  type AcademicYear,
} from '@/services/academic-year.service';
import { Badge } from '@/components/ui/badge';

export default function AcademicYearsPage() {
  const { data: academicYears, isLoading } = useAcademicYears();
  const deleteMutation = useDeleteAcademicYear();
  const setCurrentMutation = useSetCurrentAcademicYear();

  const columns: ColumnDef<AcademicYear>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const year = row.original;
          return (
            <div className="flex items-center gap-2">
              <Link
                href={`/academic/years/${year.id}`}
                className="font-medium hover:underline"
              >
                {year.name}
              </Link>
              {year.isCurrent && (
                <Badge variant="default" className="text-xs">
                  Current
                </Badge>
              )}
            </div>
          );
        },
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
          const year = row.original;

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
                  <Link href={`/academic/years/${year.id}`}>View Details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/years/${year.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                {!year.isCurrent && (
                  <DropdownMenuItem
                    onClick={() => setCurrentMutation.mutate(year.id)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Set as Current
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    if (confirm('Are you sure you want to archive this academic year?')) {
                      deleteMutation.mutate(year.id);
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
    [deleteMutation, setCurrentMutation]
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Academic Years</h1>
          <p className="text-muted-foreground mt-2">
            Manage academic years and set current year
          </p>
        </div>
        <Button asChild>
          <Link href="/academic/years/new">Create Academic Year</Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={academicYears || []}
        searchKey="name"
        searchPlaceholder="Search academic years..."
        isLoading={isLoading}
      />
    </div>
  );
}
