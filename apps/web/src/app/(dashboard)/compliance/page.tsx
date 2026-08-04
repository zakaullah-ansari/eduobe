'use client';

import { useState } from 'react';
import { useComplianceRequirements, useComplianceReports, useDeleteRequirement } from '@/services/compliance.service';
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
import { MoreHorizontal, Pencil, Trash2, Shield, FileText } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  pending: 'secondary',
  in_progress: 'default',
  compliant: 'outline',
  non_compliant: 'destructive',
  exempted: 'secondary',
  draft: 'secondary',
  submitted: 'default',
  accepted: 'outline',
  rejected: 'destructive',
} as const;

export default function CompliancePage() {
  const [tab, setTab] = useState<'requirements' | 'reports'>('requirements');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: requirements, isLoading: requirementsLoading } = useComplianceRequirements();
  const { data: reports, isLoading: reportsLoading } = useComplianceReports();
  const deleteMutation = useDeleteRequirement();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this requirement?')) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const requirementColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Requirement Title',
      cell: ({ row }) => {
        const requirement = row.original;
        return (
          <Link
            href={`/compliance/requirements/${requirement.id}`}
            className="font-medium hover:underline"
          >
            {requirement.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('category').toUpperCase()}</Badge>,
    },
    {
      accessorKey: 'regulation',
      header: 'Regulation',
      cell: ({ row }) => row.original.regulation || 'N/A',
    },
    {
      accessorKey: 'effectiveDate',
      header: 'Effective Date',
      cell: ({ row }) => {
        const date = row.original.effectiveDate;
        return date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A';
      },
    },
    {
      accessorKey: 'deadlineDate',
      header: 'Deadline',
      cell: ({ row }) => {
        const date = row.original.deadlineDate;
        return date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A';
      },
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
        const requirement = row.original;
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
                <Link href={`/compliance/requirements/${requirement.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/compliance/requirements/${requirement.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(requirement.id)}
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

  const reportColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Report Title',
      cell: ({ row }) => {
        const report = row.original;
        return (
          <Link
            href={`/compliance/reports/${report.id}`}
            className="font-medium hover:underline"
          >
            {report.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('category').toUpperCase()}</Badge>,
    },
    {
      accessorKey: 'reportingPeriod',
      header: 'Reporting Period',
    },
    {
      accessorKey: 'submittedDate',
      header: 'Submitted Date',
      cell: ({ row }) => {
        const date = row.original.submittedDate;
        return date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A';
      },
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
        const report = row.original;
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
                <Link href={`/compliance/reports/${report.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/compliance/reports/${report.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredRequirements = requirements?.filter(
    (requirement) =>
      requirement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      requirement.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      requirement.regulation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReports = reports?.filter(
    (report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Compliance Management</h1>
        <p className="text-muted-foreground mt-1">
          Track AICTE, university, and government compliance requirements
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'requirements' ? 'Search requirements...' : 'Search reports...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'requirements' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/compliance/requirements/new">
                <Shield className="mr-2 h-4 w-4" />
                Add Requirement
              </Link>
            </Button>
          </div>
          <DataTable
            columns={requirementColumns}
            data={filteredRequirements || []}
            isLoading={requirementsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Shield className="inline h-4 w-4 mr-1" />
            Total: {filteredRequirements?.length || 0} requirements
          </div>
        </>
      )}

      {tab === 'reports' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/compliance/reports/new">
                <FileText className="mr-2 h-4 w-4" />
                Create Report
              </Link>
            </Button>
          </div>
          <DataTable
            columns={reportColumns}
            data={filteredReports || []}
            isLoading={reportsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <FileText className="inline h-4 w-4 mr-1" />
            Total: {filteredReports?.length || 0} reports
          </div>
        </>
      )}
    </div>
  );
}
