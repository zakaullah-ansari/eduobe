'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Edit, Trash, BookOpen, Users } from 'lucide-react';
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
  usePrograms,
  useDeleteProgram,
  type Program,
} from '@/services/program.service';
import { Badge } from '@/components/ui/badge';

const degreeTypeLabels = {
  btech: 'B.Tech',
  mtech: 'M.Tech',
  diploma: 'Diploma',
  phd: 'Ph.D',
};

export default function ProgramsPage() {
  const { data: programs, isLoading } = usePrograms();
  const deleteMutation = useDeleteProgram();

  const columns: ColumnDef<Program>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Program Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const program = row.original;
          return (
            <Link
              href={`/academic/programs/${program.id}`}
              className="font-medium hover:underline"
            >
              {program.name}
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
        accessorKey: 'department',
        header: 'Department',
        cell: ({ row }) => row.original.department?.name || '-',
      },
      {
        accessorKey: 'degreeType',
        header: 'Degree Type',
        cell: ({ row }) => {
          const type = row.getValue('degreeType') as keyof typeof degreeTypeLabels;
          return <Badge variant="secondary">{degreeTypeLabels[type]}</Badge>;
        },
      },
      {
        accessorKey: 'duration',
        header: 'Duration',
        cell: ({ row }) => `${row.getValue('duration')} years`,
      },
      {
        accessorKey: 'totalSemesters',
        header: 'Semesters',
      },
      {
        accessorKey: '_count.batches',
        header: () => (
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Batches
          </div>
        ),
        cell: ({ row }) => row.original._count?.batches || 0,
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
          const program = row.original;

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
                  <Link href={`/academic/programs/${program.id}`}>View Details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/programs/${program.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    if (confirm('Are you sure you want to archive this program?')) {
                      deleteMutation.mutate(program.id);
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
          <h1 className="text-3xl font-bold">Programs</h1>
          <p className="text-muted-foreground mt-2">
            Manage academic programs and degree types
          </p>
        </div>
        <Button asChild>
          <Link href="/academic/programs/new">Create Program</Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={programs || []}
        searchKey="name"
        searchPlaceholder="Search programs..."
        isLoading={isLoading}
      />
    </div>
  );
}
