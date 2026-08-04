'use client';

import { useState } from 'react';
import { useICCCommittees, useSexualHarassmentCases } from '@/services/icc.service';
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
import { MoreHorizontal, Pencil, Users, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  active: 'default',
  inactive: 'secondary',
  filed: 'secondary',
  under_investigation: 'default',
  conciliation: 'default',
  inquiry: 'default',
  resolved: 'outline',
  dismissed: 'destructive',
  closed: 'outline',
} as const;

const confidentialityColors = {
  strict: 'destructive',
  moderate: 'default',
  standard: 'secondary',
} as const;

export default function ICCPage() {
  const [tab, setTab] = useState<'committee' | 'cases'>('committee');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: committees, isLoading: committeesLoading } = useICCCommittees();
  const { data: cases, isLoading: casesLoading } = useSexualHarassmentCases();

  const committeeColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Committee Name',
      cell: ({ row }) => {
        const committee = row.original;
        return (
          <Link
            href={`/icc/committee/${committee.id}`}
            className="font-medium hover:underline"
          >
            {committee.name}
          </Link>
        );
      },
    },
    {
      accessorKey: 'presidingOfficer',
      header: 'Presiding Officer',
      cell: ({ row }) => {
        const officer = row.original.presidingOfficer;
        return officer ? `${officer.firstName} ${officer.lastName}` : 'N/A';
      },
    },
    {
      accessorKey: 'contactEmail',
      header: 'Contact Email',
      cell: ({ row }) => row.original.contactEmail || 'N/A',
    },
    {
      accessorKey: 'tenureStart',
      header: 'Tenure Start',
      cell: ({ row }) => format(new Date(row.original.tenureStart), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'cases',
      header: () => (
        <div className="flex items-center">
          <ShieldAlert className="mr-2 h-4 w-4" />
          Cases
        </div>
      ),
      cell: ({ row }) => row.original._count?.cases || 0,
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
        const committee = row.original;
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
                <Link href={`/icc/committee/${committee.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/icc/committee/${committee.id}/edit`}>
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

  const caseColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'caseNumber',
      header: 'Case No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('caseNumber')}</Badge>,
    },
    {
      accessorKey: 'complainantName',
      header: 'Complainant',
    },
    {
      accessorKey: 'respondentName',
      header: 'Respondent',
    },
    {
      accessorKey: 'incidentDate',
      header: 'Incident Date',
      cell: ({ row }) => format(new Date(row.original.incidentDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'confidentialityLevel',
      header: 'Confidentiality',
      cell: ({ row }) => {
        const level = row.getValue('confidentialityLevel') as keyof typeof confidentialityColors;
        return (
          <Badge variant={confidentialityColors[level] || 'default'}>
            {level}
          </Badge>
        );
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
        const caseItem = row.original;
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
                <Link href={`/icc/cases/${caseItem.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/icc/cases/${caseItem.id}/edit`}>
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

  const filteredCommittees = committees?.filter(
    (committee) =>
      committee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCases = cases?.filter(
    (caseItem) =>
      caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.complainantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.respondentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Internal Complaints Committee (ICC)</h1>
        <p className="text-muted-foreground mt-1">
          Manage ICC committee and sexual harassment cases
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="committee">Committee</TabsTrigger>
          <TabsTrigger value="cases">Cases</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'committee' ? 'Search committees...' : 'Search cases...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'committee' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/icc/committee/new">
                <Users className="mr-2 h-4 w-4" />
                Create Committee
              </Link>
            </Button>
          </div>
          <DataTable
            columns={committeeColumns}
            data={filteredCommittees || []}
            isLoading={committeesLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Users className="inline h-4 w-4 mr-1" />
            Total: {filteredCommittees?.length || 0} committees
          </div>
        </>
      )}

      {tab === 'cases' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/icc/cases/new">
                <ShieldAlert className="mr-2 h-4 w-4" />
                File Case
              </Link>
            </Button>
          </div>
          <DataTable
            columns={caseColumns}
            data={filteredCases || []}
            isLoading={casesLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <ShieldAlert className="inline h-4 w-4 mr-1" />
            Total: {filteredCases?.length || 0} cases
          </div>
        </>
      )}
    </div>
  );
}
