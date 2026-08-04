'use client';

import { useState } from 'react';
import { useMOUs, usePartnerships, useDeleteMOU, useDeletePartnership } from '@/services/industry.service';
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
import { MoreHorizontal, Pencil, Trash2, FileText, Handshake } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  active: 'default',
  expired: 'secondary',
  terminated: 'destructive',
  proposed: 'outline',
  inactive: 'secondary',
  completed: 'outline',
} as const;

export default function IndustryPage() {
  const [tab, setTab] = useState<'mous' | 'partnerships'>('mous');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: mous, isLoading: mousLoading } = useMOUs();
  const { data: partnerships, isLoading: partnershipsLoading } = usePartnerships();
  const deleteMOUMutation = useDeleteMOU();
  const deletePartnershipMutation = useDeletePartnership();

  const handleDeleteMOU = (id: string) => {
    if (!confirm('Are you sure you want to delete this MOU?')) {
      return;
    }

    deleteMOUMutation.mutate(id);
  };

  const handleDeletePartnership = (id: string) => {
    if (!confirm('Are you sure you want to delete this partnership?')) {
      return;
    }

    deletePartnershipMutation.mutate(id);
  };

  const mouColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'MOU Title',
      cell: ({ row }) => {
        const mou = row.original;
        return (
          <Link
            href={`/industry/mous/${mou.id}`}
            className="font-medium hover:underline"
          >
            {mou.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'partnerOrganization',
      header: 'Partner Organization',
    },
    {
      accessorKey: 'partnerType',
      header: 'Partner Type',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('partnerType')}</Badge>,
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => format(new Date(row.original.startDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => format(new Date(row.original.endDate), 'MMM dd, yyyy'),
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
        const mou = row.original;
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
                <Link href={`/industry/mous/${mou.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/industry/mous/${mou.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteMOU(mou.id)}
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

  const partnershipColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Partnership Title',
      cell: ({ row }) => {
        const partnership = row.original;
        return (
          <Link
            href={`/industry/partnerships/${partnership.id}`}
            className="font-medium hover:underline"
          >
            {partnership.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'partnerOrganization',
      header: 'Partner Organization',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('type')}</Badge>,
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => format(new Date(row.original.startDate), 'MMM dd, yyyy'),
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
        const partnership = row.original;
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
                <Link href={`/industry/partnerships/${partnership.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/industry/partnerships/${partnership.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeletePartnership(partnership.id)}
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

  const filteredMOUs = mous?.filter(
    (mou) =>
      mou.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mou.partnerOrganization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPartnerships = partnerships?.filter(
    (partnership) =>
      partnership.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partnership.partnerOrganization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Industry Collaboration</h1>
        <p className="text-muted-foreground mt-1">
          Manage MOUs and partnerships
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="mous">MOUs</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'mous' ? 'Search MOUs...' : 'Search partnerships...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'mous' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/industry/mous/new">
                <FileText className="mr-2 h-4 w-4" />
                Create MOU
              </Link>
            </Button>
          </div>
          <DataTable
            columns={mouColumns}
            data={filteredMOUs || []}
            isLoading={mousLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <FileText className="inline h-4 w-4 mr-1" />
            Total: {filteredMOUs?.length || 0} MOUs
          </div>
        </>
      )}

      {tab === 'partnerships' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/industry/partnerships/new">
                <Handshake className="mr-2 h-4 w-4" />
                Add Partnership
              </Link>
            </Button>
          </div>
          <DataTable
            columns={partnershipColumns}
            data={filteredPartnerships || []}
            isLoading={partnershipsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Handshake className="inline h-4 w-4 mr-1" />
            Total: {filteredPartnerships?.length || 0} partnerships
          </div>
        </>
      )}
    </div>
  );
}
