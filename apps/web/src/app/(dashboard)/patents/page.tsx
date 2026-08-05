'use client';

import { useState } from 'react';
import { usePatents, useDeletePatent } from '@/services/patent.service';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, FileText } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

const statusColors = {
  filed: 'secondary',
  published: 'default',
  granted: 'outline',
  rejected: 'destructive',
  abandoned: 'secondary',
} as const;

const commercializationColors = {
  not_started: 'secondary',
  in_progress: 'default',
  licensed: 'outline',
  sold: 'destructive',
} as const;

export default function PatentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({});
  const { data: patents, isLoading } = usePatents(filters);
  const deleteMutation = useDeletePatent();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this patent?')) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Patent Title',
      cell: ({ row }) => {
        const patent = row.original;
        return (
          <Link
            href={`/patents/${patent.id}`}
            className="font-medium hover:underline"
          >
            {patent.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'applicationNumber',
      header: 'Application No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('applicationNumber')}</Badge>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('type')}</Badge>,
    },
    {
      accessorKey: 'applicationDate',
      header: 'Application Date',
      cell: ({ row }) => format(new Date(row.original.applicationDate), 'MMM dd, yyyy'),
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
      accessorKey: 'commercializationStatus',
      header: 'Commercialization',
      cell: ({ row }) => {
        const status = row.original.commercializationStatus as keyof typeof commercializationColors;
        return status ? (
          <Badge variant={commercializationColors[status] || 'default'}>
            {status.replace('_', ' ')}
          </Badge>
        ) : (
          'N/A'
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const patent = row.original;
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
                <Link href={`/patents/${patent.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/patents/${patent.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(patent.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredPatents = patents?.filter(
    (patent) =>
      patent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patent.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patent.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patent Management</h1>
          <p className="text-muted-foreground mt-1">
            File and track patents
          </p>
        </div>
        <Button asChild>
          <Link href="/patents/new">
            <FileText className="mr-2 h-4 w-4" />
            File Patent
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder="Search patents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.status || ''}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    status: e.target.value || undefined,
                  }))
                }
              >
                <option value="">All Status</option>
                <option value="filed">Filed</option>
                <option value="published">Published</option>
                <option value="granted">Granted</option>
                <option value="rejected">Rejected</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>

            <div className="space-y-2">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.type || ''}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    type: e.target.value || undefined,
                  }))
                }
              >
                <option value="">All Types</option>
                <option value="provisional">Provisional</option>
                <option value="complete">Complete</option>
                <option value="pct">PCT</option>
                <option value="national">National</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={filteredPatents || []}
        isLoading={isLoading}
      />

      <div className="mt-4 text-sm text-muted-foreground text-center">
        <FileText className="inline h-4 w-4 mr-1" />
        Total: {filteredPatents?.length || 0} patents
      </div>
    </div>
  );
}
