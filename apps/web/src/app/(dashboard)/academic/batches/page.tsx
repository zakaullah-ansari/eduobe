'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Edit, Trash, Users, LayoutGrid } from 'lucide-react';
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
  useBatches,
  useDeleteBatch,
  type Batch,
} from '@/services/batch.service';
import { Badge } from '@/components/ui/badge';

const statusColors = {
  active: 'default',
  graduated: 'secondary',
  archived: 'outline',
};

export default function BatchesPage() {
  const { data: batches, isLoading } = useBatches();
  const deleteMutation = useDeleteBatch();

  const columns: ColumnDef<Batch>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Batch Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const batch = row.original;
          return (
            <Link
              href={`/academic/batches/${batch.id}`}
              className="font-medium hover:underline"
            >
              {batch.name}
            </Link>
          );
        },
      },
      {
        accessorKey: 'program',
        header: 'Program',
        cell: ({ row }) => row.original.program?.name || '-',
      },
      {
        accessorKey: 'academicYear',
        header: 'Academic Year',
        cell: ({ row }) => row.original.academicYear?.name || '-',
      },
      {
        accessorKey: 'admissionYear',
        header: 'Admission Year',
      },
      {
        accessorKey: 'currentSemester',
        header: 'Current Semester',
        cell: ({ row }) => `Sem ${row.getValue('currentSemester')}`,
      },
      {
        accessorKey: '_count.sections',
        header: () => (
          <div className="flex items-center gap-1">
            <LayoutGrid className="h-4 w-4" />
            Sections
          </div>
        ),
        cell: ({ row }) => row.original._count?.sections || 0,
      },
      {
        accessorKey: '_count.students',
        header: () => (
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Students
          </div>
        ),
        cell: ({ row }) => row.original._count?.students || 0,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as keyof typeof statusColors;
          return (
            <Badge variant={statusColors[status] as any}>
              {status}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const batch = row.original;

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
                  <Link href={`/academic/batches/${batch.id}`}>View Details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/batches/${batch.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    if (confirm('Are you sure you want to archive this batch?')) {
                      deleteMutation.mutate(batch.id);
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
          <h1 className="text-3xl font-bold">Batches</h1>
          <p className="text-muted-foreground mt-2">
            Manage student batches by admission year
          </p>
        </div>
        <Button asChild>
          <Link href="/academic/batches/new">Create Batch</Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={batches || []}
        searchKey="name"
        searchPlaceholder="Search batches..."
        isLoading={isLoading}
      />
    </div>
  );
}
