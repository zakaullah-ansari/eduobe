'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, BookOpen, Calendar } from 'lucide-react';
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
import { useCurricula, useDeleteCurriculum } from '@/services/curriculum.service';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const statusColors = {
  draft: 'secondary',
  active: 'default',
  archived: 'outline',
} as const;

export default function CurriculaPage() {
  const { data: curricula, isLoading } = useCurricula();
  const deleteMutation = useDeleteCurriculum();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to archive this curriculum?')) {
      return;
    }

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Curriculum archived successfully');
      },
    });
  };

  const columns: ColumnDef<any>[] = useMemo(
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
          const curriculum = row.original;
          return (
            <Link
              href={`/academic/curriculum/${curriculum.id}`}
              className="font-medium hover:underline"
            >
              {curriculum.name}
            </Link>
          );
        },
      },
      {
        accessorKey: 'version',
        header: 'Version',
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue('version')}</Badge>
        ),
      },
      {
        accessorKey: 'program',
        header: 'Program',
        cell: ({ row }) => row.original.program?.name || 'N/A',
      },
      {
        accessorKey: 'effectiveFrom',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Effective From
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: 'semesters',
        header: () => (
          <div className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Semesters
          </div>
        ),
        cell: ({ row }) => row.original._count?.semesters || 0,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as keyof typeof statusColors;
          return (
            <Badge variant={statusColors[status] || 'default'}>
              {status}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const curriculum = row.original;
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
                  <Link href={`/academic/curriculum/${curriculum.id}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/curriculum/${curriculum.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDelete(curriculum.id)}
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
          <h1 className="text-3xl font-bold">Curricula</h1>
          <p className="text-muted-foreground mt-1">
            Manage curriculum versions and their semesters
          </p>
        </div>
        <Button asChild>
          <Link href="/academic/curriculum/new">Create Curriculum</Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={curricula || []}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search curricula..."
      />
    </div>
  );
}
