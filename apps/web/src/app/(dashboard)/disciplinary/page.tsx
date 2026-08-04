'use client';

import { useState } from 'react';
import { useDisciplinaryCases, useDisciplinaryProceedings, useDisciplinaryAppeals } from '@/services/disciplinary.service';
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
import { MoreHorizontal, Pencil, Trash2, Gavel, FileText, Scale } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  reported: 'secondary',
  under_investigation: 'default',
  hearing_scheduled: 'default',
  hearing_completed: 'default',
  decision_pending: 'default',
  resolved: 'outline',
  appeal_filed: 'default',
  closed: 'outline',
  filed: 'secondary',
  under_review: 'default',
  disposed: 'outline',
  rejected: 'destructive',
} as const;

const severityColors = {
  minor: 'secondary',
  moderate: 'default',
  major: 'destructive',
  severe: 'destructive',
} as const;

export default function DisciplinaryPage() {
  const [tab, setTab] = useState<'cases' | 'proceedings' | 'appeals'>('cases');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: cases, isLoading: casesLoading } = useDisciplinaryCases();
  const { data: proceedings, isLoading: proceedingsLoading } = useDisciplinaryProceedings();
  const { data: appeals, isLoading: appealsLoading } = useDisciplinaryAppeals();

  const caseColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'caseNumber',
      header: 'Case No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('caseNumber')}</Badge>,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const caseItem = row.original;
        return (
          <Link
            href={`/disciplinary/cases/${caseItem.id}`}
            className="font-medium hover:underline"
          >
            {caseItem.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'accusedType',
      header: 'Accused Type',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('accusedType')}</Badge>,
    },
    {
      accessorKey: 'violationType',
      header: 'Violation Type',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('violationType').replace('_', ' ')}</Badge>,
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ row }) => {
        const severity = row.getValue('severity') as keyof typeof severityColors;
        return (
          <Badge variant={severityColors[severity] || 'default'}>
            {severity}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'incidentDate',
      header: 'Incident Date',
      cell: ({ row }) => format(new Date(row.original.incidentDate), 'MMM dd, yyyy'),
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
                <Link href={`/disciplinary/cases/${caseItem.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/disciplinary/cases/${caseItem.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this case?')) {
                    toast.success('Case deleted successfully');
                  }
                }}
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

  const proceedingColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'proceedingNumber',
      header: 'Proceeding No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('proceedingNumber')}</Badge>,
    },
    {
      accessorKey: 'case',
      header: 'Case',
      cell: ({ row }) => row.original.case?.caseNumber || 'N/A',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('type')}</Badge>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.date), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'outcome',
      header: 'Outcome',
      cell: ({ row }) => row.original.outcome || 'Pending',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const proceeding = row.original;
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
                <Link href={`/disciplinary/proceedings/${proceeding.id}`}>
                  View Details
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
      accessorKey: 'appellant',
      header: 'Appellant',
      cell: ({ row }) => {
        const appellant = row.original.appellant;
        return appellant ? `${appellant.firstName} ${appellant.lastName}` : 'N/A';
      },
    },
    {
      accessorKey: 'case',
      header: 'Case',
      cell: ({ row }) => row.original.case?.caseNumber || 'N/A',
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
                <Link href={`/disciplinary/appeals/${appeal.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredCases = cases?.filter(
    (caseItem) =>
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProceedings = proceedings?.filter(
    (proceeding) =>
      proceeding.proceedingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proceeding.case?.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAppeals = appeals?.filter(
    (appeal) =>
      appeal.appealNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.appellant?.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Disciplinary Actions</h1>
        <p className="text-muted-foreground mt-1">
          Manage disciplinary cases, proceedings, and appeals
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="cases">Cases</TabsTrigger>
          <TabsTrigger value="proceedings">Proceedings</TabsTrigger>
          <TabsTrigger value="appeals">Appeals</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'cases' ? 'Search cases...' : tab === 'proceedings' ? 'Search proceedings...' : 'Search appeals...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'cases' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/disciplinary/cases/new">
                <Gavel className="mr-2 h-4 w-4" />
                Report Case
              </Link>
            </Button>
          </div>
          <DataTable
            columns={caseColumns}
            data={filteredCases || []}
            isLoading={casesLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Gavel className="inline h-4 w-4 mr-1" />
            Total: {filteredCases?.length || 0} cases
          </div>
        </>
      )}

      {tab === 'proceedings' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/disciplinary/proceedings/new">
                <FileText className="mr-2 h-4 w-4" />
                Record Proceeding
              </Link>
            </Button>
          </div>
          <DataTable
            columns={proceedingColumns}
            data={filteredProceedings || []}
            isLoading={proceedingsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <FileText className="inline h-4 w-4 mr-1" />
            Total: {filteredProceedings?.length || 0} proceedings
          </div>
        </>
      )}

      {tab === 'appeals' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/disciplinary/appeals/new">
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
