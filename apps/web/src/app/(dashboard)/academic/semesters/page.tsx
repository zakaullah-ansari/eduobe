'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, BookOpen, Hash } from 'lucide-react';
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
import { useSemesters, useDeleteSemester } from '@/services/semester.service';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function SemestersPage() {
  const { data: semesters, isLoading } = useSemesters();
  const deleteMutation = useDeleteSemester();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to archive this semester?')) {
      return;
    }

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Semester archived successfully');
      },
    });
  };

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'number',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              <Hash className="mr-2 h-4 w-4" />
              Number
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <Badge variant="outline">Sem {row.getValue('number')}</Badge>
        ),
      },
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
          const semester = row.original;
          return (
            <Link
              href={`/academic/semesters/${semester.id}`}
              className="font-medium hover:underline"
            >
              {semester.name}
            </Link>
          );
        },
      },
      {
        accessorKey: 'curriculum',
        header: 'Curriculum',
        cell: ({ row }) => row.original.curriculum?.name || 'N/A',
      },
      {
        accessorKey: 'totalCredits',
        header: 'Total Credits',
      },
      {
        accessorKey: 'courses',
        header: () => (
          <div className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Courses
          </div>
        ),
        cell: ({ row }) => row.original._count?.courses || 0,
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
          const semester = row.original;
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
                  <Link href={`/academic/semesters/${semester.id}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/semesters/${semester.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDelete(semester.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Semesters</h1>
          <p className="text-muted-foreground mt-1">
            Manage semesters within curricula
          </p>
        </div>
        <Button asChild>
          <Link href="/academic/semesters/new">Create Semester</Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={semesters || []}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search semesters..."
      />
    </div>
  );
}
