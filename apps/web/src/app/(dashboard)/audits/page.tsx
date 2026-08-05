'use client';

import { useState } from 'react';
import { useAudits, useDeleteAudit } from '@/services/audit.service';
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
import { MoreHorizontal, Pencil, Trash2, ClipboardCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  scheduled: 'secondary',
  in_progress: 'default',
  completed: 'outline',
  cancelled: 'destructive',
  open: 'destructive',
  resolved: 'outline',
  closed: 'secondary',
  accepted: 'default',
} as const;

export default function AuditsPage() {
  const [tab, setTab] = useState<'audits' | 'findings'>('audits');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: audits, isLoading } = useAudits();
  const deleteMutation = useDeleteAudit();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this audit?')) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const auditColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Audit Title',
      cell: ({ row }) => {
        const audit = row.original;
        return (
          <Link
            href={`/audits/${audit.id}`}
            className="font-medium hover:underline"
          >
            {audit.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('type')}</Badge>,
    },
    {
      accessorKey: 'auditor',
      header: 'Auditor',
      cell: ({ row }) => row.original.auditor || 'N/A',
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => format(new Date(row.original.startDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => {
        const date = row.original.endDate;
        return date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A';
      },
    },
    {
      accessorKey: 'findings',
      header: () => (
        <div className="flex items-center">
          <AlertCircle className="mr-2 h-4 w-4" />
          Findings
        </div>
      ),
      cell: ({ row }) => row.original._count?.findings || row.original.findings || 0,
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
        const audit = row.original;
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
                <Link href={`/audits/${audit.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/audits/${audit.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/audits/${audit.id}/findings`}>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Manage Findings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(audit.id)}
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

  const filteredAudits = audits?.filter(
    (audit) =>
      audit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.auditor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Audit Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage internal and external audits with findings tracking
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="audits">Audits</TabsTrigger>
          <TabsTrigger value="findings">All Findings</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder="Search audits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'audits' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/audits/new">
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Schedule Audit
              </Link>
            </Button>
          </div>
          <DataTable
            columns={auditColumns}
            data={filteredAudits || []}
            isLoading={isLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <ClipboardCheck className="inline h-4 w-4 mr-1" />
            Total: {filteredAudits?.length || 0} audits
          </div>
        </>
      )}

      {tab === 'findings' && (
        <div className="text-center py-10 text-muted-foreground">
          <AlertCircle className="inline h-12 w-12 mb-4" />
          <p>Select an audit to view its findings</p>
        </div>
      )}
    </div>
  );
}
