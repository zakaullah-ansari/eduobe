'use client';

import { useState } from 'react';
import { useAccreditations, useDeleteAccreditation } from '@/services/accreditation.service';
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
import { MoreHorizontal, Pencil, Trash2, Award } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  planned: 'secondary',
  application_submitted: 'outline',
  under_review: 'default',
  visit_scheduled: 'default',
  completed: 'outline',
  accredited: 'default',
  not_accredited: 'destructive',
} as const;

export default function AccreditationPage() {
  const [tab, setTab] = useState<'all' | 'nba' | 'naac' | 'nirf'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: accreditations, isLoading } = useAccreditations(tab !== 'all' ? { type: tab } : {});
  const deleteMutation = useDeleteAccreditation();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this accreditation?')) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const accreditation = row.original;
        return (
          <Link
            href={`/accreditation/${accreditation.id}`}
            className="font-medium hover:underline"
          >
            {accreditation.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <Badge variant="outline">{String(row.getValue('type')).toUpperCase()}</Badge>,
    },
    {
      accessorKey: 'applicationDate',
      header: 'Application Date',
      cell: ({ row }) => {
        const date = row.original.applicationDate;
        return date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A';
      },
    },
    {
      accessorKey: 'visitDate',
      header: 'Visit Date',
      cell: ({ row }) => {
        const date = row.original.visitDate;
        return date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A';
      },
    },
    {
      accessorKey: 'grade',
      header: 'Grade/Score',
      cell: ({ row }) => {
        const accreditation = row.original;
        return accreditation.grade || (accreditation.score ? `${accreditation.score}/100` : 'N/A');
      },
    },
    {
      accessorKey: 'validityPeriod',
      header: 'Validity',
      cell: ({ row }) => row.original.validityPeriod || 'N/A',
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
        const accreditation = row.original;
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
                <Link href={`/accreditation/${accreditation.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/accreditation/${accreditation.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/accreditation/${accreditation.id}/criteria`}>
                  <Award className="mr-2 h-4 w-4" />
                  Manage Criteria
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(accreditation.id)}
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

  const filteredAccreditations = accreditations?.filter(
    (accreditation) =>
      accreditation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      accreditation.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Accreditation Management</h1>
        <p className="text-muted-foreground mt-1">
          Track NBA, NAAC, NIRF, and other accreditations
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="nba">NBA</TabsTrigger>
          <TabsTrigger value="naac">NAAC</TabsTrigger>
          <TabsTrigger value="nirf">NIRF</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder="Search accreditations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 flex justify-end">
        <Button asChild>
          <Link href="/accreditation/new">
            <Award className="mr-2 h-4 w-4" />
            Add Accreditation
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredAccreditations || []}
        isLoading={isLoading}
      />

      <div className="mt-4 text-sm text-muted-foreground text-center">
        <Award className="inline h-4 w-4 mr-1" />
        Total: {filteredAccreditations?.length || 0} accreditations
      </div>
    </div>
  );
}
