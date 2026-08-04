'use client';

import { useState } from 'react';
import { useScholarshipSchemes, useScholarshipApplications, useDisbursements } from '@/services/scholarship.service';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Award, FileText, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  active: 'default',
  inactive: 'secondary',
  closed: 'destructive',
  applied: 'secondary',
  under_review: 'default',
  approved: 'default',
  rejected: 'destructive',
  disbursed: 'outline',
  renewed: 'outline',
  pending: 'secondary',
  processed: 'default',
  completed: 'outline',
  failed: 'destructive',
} as const;

export default function ScholarshipsPage() {
  const [tab, setTab] = useState<'schemes' | 'applications' | 'disbursements'>('schemes');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: schemes, isLoading: schemesLoading } = useScholarshipSchemes();
  const { data: applications, isLoading: applicationsLoading } = useScholarshipApplications();
  const { data: disbursements, isLoading: disbursementsLoading } = useDisbursements();

  const schemeColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'schemeNumber',
      header: 'Scheme No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('schemeNumber')}</Badge>,
    },
    {
      accessorKey: 'name',
      header: 'Scheme Name',
      cell: ({ row }) => {
        const scheme = row.original;
        return (
          <Link
            href={`/campus/scholarships/schemes/${scheme.id}`}
            className="font-medium hover:underline"
          >
            {scheme.name}
          </Link>
        );
      },
    },
    {
      accessorKey: 'providerType',
      header: 'Provider Type',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('providerType')}</Badge>,
    },
    {
      accessorKey: 'providerName',
      header: 'Provider Name',
    },
    {
      accessorKey: 'amount',
      header: () => (
        <div className="flex items-center">
          <IndianRupee className="mr-2 h-4 w-4" />
          Amount
        </div>
      ),
      cell: ({ row }) => {
        const amount = row.getValue('amount') as number;
        return `₹${amount.toLocaleString('en-IN')}`;
      },
    },
    {
      accessorKey: 'applicationDeadline',
      header: 'Deadline',
      cell: ({ row }) => format(new Date(row.original.applicationDeadline), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'applications',
      header: () => (
        <div className="flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          Applications
        </div>
      ),
      cell: ({ row }) => row.original._count?.applications || 0,
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
        const scheme = row.original;
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
                <Link href={`/campus/scholarships/schemes/${scheme.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/campus/scholarships/schemes/${scheme.id}/edit`}>
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

  const applicationColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'applicationNumber',
      header: 'Application No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('applicationNumber')}</Badge>,
    },
    {
      accessorKey: 'student',
      header: 'Student',
      cell: ({ row }) => {
        const student = row.original.student;
        return student ? (
          <div>
            <p className="font-medium">{student.firstName} {student.lastName}</p>
            <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
          </div>
        ) : 'N/A';
      },
    },
    {
      accessorKey: 'scheme',
      header: 'Scheme',
      cell: ({ row }) => {
        const scheme = row.original.scheme;
        return scheme ? (
          <div>
            <p className="font-medium">{scheme.name}</p>
            <p className="text-sm text-muted-foreground">{scheme.providerName}</p>
          </div>
        ) : 'N/A';
      },
    },
    {
      accessorKey: 'appliedDate',
      header: 'Applied Date',
      cell: ({ row }) => format(new Date(row.original.appliedDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'approvedAmount',
      header: () => (
        <div className="flex items-center">
          <IndianRupee className="mr-2 h-4 w-4" />
          Approved Amount
        </div>
      ),
      cell: ({ row }) => {
        const amount = row.original.approvedAmount;
        return amount ? `₹${amount.toLocaleString('en-IN')}` : 'N/A';
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
        const application = row.original;
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
                <Link href={`/campus/scholarships/applications/${application.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const disbursementColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'disbursementNumber',
      header: 'Disbursement No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('disbursementNumber')}</Badge>,
    },
    {
      accessorKey: 'application',
      header: 'Application',
      cell: ({ row }) => {
        const application = row.original.application;
        return application ? (
          <div>
            <p className="font-medium">{application.applicationNumber}</p>
            <p className="text-sm text-muted-foreground">
              {application.student?.firstName} {application.student?.lastName}
            </p>
          </div>
        ) : 'N/A';
      },
    },
    {
      accessorKey: 'amount',
      header: () => (
        <div className="flex items-center">
          <IndianRupee className="mr-2 h-4 w-4" />
          Amount
        </div>
      ),
      cell: ({ row }) => {
        const amount = row.getValue('amount') as number;
        return `₹${amount.toLocaleString('en-IN')}`;
      },
    },
    {
      accessorKey: 'disbursementDate',
      header: 'Disbursement Date',
      cell: ({ row }) => format(new Date(row.original.disbursementDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('paymentMethod')}</Badge>,
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
        const disbursement = row.original;
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
                <Link href={`/campus/scholarships/disbursements/${disbursement.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredSchemes = schemes?.filter(
    (scheme) =>
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.providerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApplications = applications?.filter(
    (application) =>
      application.student?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.scheme?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDisbursements = disbursements?.filter(
    (disbursement) =>
      disbursement.application?.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disbursement.application?.student?.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Scholarship Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage scholarship schemes, applications, and disbursements
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="schemes">Schemes</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="disbursements">Disbursements</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'schemes' ? 'Search schemes...' : tab === 'applications' ? 'Search applications...' : 'Search disbursements...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'schemes' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/scholarships/schemes/new">
                <Award className="mr-2 h-4 w-4" />
                Create Scheme
              </Link>
            </Button>
          </div>
          <DataTable
            columns={schemeColumns}
            data={filteredSchemes || []}
            isLoading={schemesLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Award className="inline h-4 w-4 mr-1" />
            Total: {filteredSchemes?.length || 0} schemes
          </div>
        </>
      )}

      {tab === 'applications' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/scholarships/applications/new">
                <FileText className="mr-2 h-4 w-4" />
                Submit Application
              </Link>
            </Button>
          </div>
          <DataTable
            columns={applicationColumns}
            data={filteredApplications || []}
            isLoading={applicationsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <FileText className="inline h-4 w-4 mr-1" />
            Total: {filteredApplications?.length || 0} applications
          </div>
        </>
      )}

      {tab === 'disbursements' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/scholarships/disbursements/new">
                <IndianRupee className="mr-2 h-4 w-4" />
                Record Disbursement
              </Link>
            </Button>
          </div>
          <DataTable
            columns={disbursementColumns}
            data={filteredDisbursements || []}
            isLoading={disbursementsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <IndianRupee className="inline h-4 w-4 mr-1" />
            Total: {filteredDisbursements?.length || 0} disbursements
          </div>
        </>
      )}
    </div>
  );
}
