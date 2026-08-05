'use client';

import { useState } from 'react';
import { useRTIRequests, useRTIAppeals } from '@/services/rti.service';
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
import { MoreHorizontal, Pencil, FileText, Scale } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  received: 'secondary',
  under_process: 'default',
  information_provided: 'outline',
  rejected: 'destructive',
  transferred: 'secondary',
  appeal_filed: 'default',
  filed: 'secondary',
  under_review: 'default',
  hearing_scheduled: 'default',
  disposed: 'outline',
} as const;

export default function RTIPage() {
  const [tab, setTab] = useState<'requests' | 'appeals'>('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: requests, isLoading: requestsLoading } = useRTIRequests();
  const { data: appeals, isLoading: appealsLoading } = useRTIAppeals();

  const requestColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'requestNumber',
      header: 'Request No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('requestNumber')}</Badge>,
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ row }) => {
        const request = row.original;
        return (
          <Link
            href={`/rti/requests/${request.id}`}
            className="font-medium hover:underline"
          >
            {request.subject}
          </Link>
        );
      },
    },
    {
      accessorKey: 'applicantName',
      header: 'Applicant',
    },
    {
      accessorKey: 'receivedDate',
      header: 'Received Date',
      cell: ({ row }) => format(new Date(row.original.receivedDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'responseDeadline',
      header: 'Deadline',
      cell: ({ row }) => format(new Date(row.original.responseDeadline), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'feePaid',
      header: 'Fee Paid',
      cell: ({ row }) => `₹${(row.getValue('feePaid') as number).toLocaleString('en-IN')}`,
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
        const request = row.original;
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
                <Link href={`/rti/requests/${request.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/rti/requests/${request.id}/edit`}>
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

  const appealColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'appealNumber',
      header: 'Appeal No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('appealNumber')}</Badge>,
    },
    {
      accessorKey: 'appellantName',
      header: 'Appellant',
    },
    {
      accessorKey: 'rtiRequest',
      header: 'RTI Request',
      cell: ({ row }) => row.original.rtiRequest?.requestNumber || 'N/A',
    },
    {
      accessorKey: 'filedDate',
      header: 'Filed Date',
      cell: ({ row }) => format(new Date(row.original.filedDate), 'MMM dd, yyyy'),
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
        const appeal = row.original;
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
                <Link href={`/rti/appeals/${appeal.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredRequests = requests?.filter(
    (request) =>
      request.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.applicantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAppeals = appeals?.filter(
    (appeal) =>
      appeal.appellantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.appealNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">RTI Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage Right to Information requests and appeals
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="appeals">Appeals</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'requests' ? 'Search requests...' : 'Search appeals...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'requests' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/rti/requests/new">
                <FileText className="mr-2 h-4 w-4" />
                Submit RTI Request
              </Link>
            </Button>
          </div>
          <DataTable
            columns={requestColumns}
            data={filteredRequests || []}
            isLoading={requestsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <FileText className="inline h-4 w-4 mr-1" />
            Total: {filteredRequests?.length || 0} requests
          </div>
        </>
      )}

      {tab === 'appeals' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/rti/appeals/new">
                <Scale className="mr-2 h-4 w-4" />
                File Appeal
              </Link>
            </Button>
          </div>
          <DataTable
            columns={appealColumns}
            data={filteredAppeals || []}
            isLoading={appealsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Scale className="inline h-4 w-4 mr-1" />
            Total: {filteredAppeals?.length || 0} appeals
          </div>
        </>
      )}
    </div>
  );
}
