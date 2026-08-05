'use client';

import { useState } from 'react';
import { useGrievances, useDeleteGrievance } from '@/services/grievance.service';
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
import { MoreHorizontal, Pencil, Trash2, MessageSquareWarning } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  submitted: 'secondary',
  under_review: 'default',
  in_progress: 'default',
  resolved: 'outline',
  closed: 'outline',
  rejected: 'destructive',
} as const;

const priorityColors = {
  low: 'secondary',
  medium: 'default',
  high: 'destructive',
  urgent: 'destructive',
} as const;

export default function GrievancesPage() {
  const [tab, setTab] = useState<'all' | 'student' | 'faculty' | 'staff'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: grievances, isLoading } = useGrievances(tab !== 'all' ? { submittedByType: tab } : {});
  const deleteMutation = useDeleteGrievance();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this grievance?')) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'grievanceNumber',
      header: 'Grievance No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('grievanceNumber')}</Badge>,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const grievance = row.original;
        return (
          <Link
            href={`/grievances/${grievance.id}`}
            className="font-medium hover:underline"
          >
            {grievance.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('category')}</Badge>,
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priority = row.getValue('priority') as keyof typeof priorityColors;
        return (
          <Badge variant={priorityColors[priority] || 'default'}>
            {priority}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'submittedByType',
      header: 'Submitted By',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('submittedByType')}</Badge>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Submitted Date',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as keyof typeof statusColors;
        return (
          <Badge variant={statusColors[status] || 'default'}>
            {status.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const grievance = row.original;
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
                <Link href={`/grievances/${grievance.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/grievances/${grievance.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(grievance.id)}
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

  const filteredGrievances = grievances?.filter(
    (grievance) =>
      grievance.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grievance.grievanceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grievance.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Grievance Management</h1>
        <p className="text-muted-foreground mt-1">
          Track and resolve student, faculty, and staff grievances
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder="Search grievances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 flex justify-end">
        <Button asChild>
          <Link href="/grievances/new">
            <MessageSquareWarning className="mr-2 h-4 w-4" />
            Submit Grievance
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredGrievances || []}
        isLoading={isLoading}
      />

      <div className="mt-4 text-sm text-muted-foreground text-center">
        <MessageSquareWarning className="inline h-4 w-4 mr-1" />
        Total: {filteredGrievances?.length || 0} grievances
      </div>
    </div>
  );
}
