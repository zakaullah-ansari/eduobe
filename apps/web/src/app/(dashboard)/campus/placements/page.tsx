'use client';

import { useState } from 'react';
import { useCompanies, usePlacementDrives, useDeleteCompany } from '@/services/placement.service';
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
import { MoreHorizontal, Pencil, Trash2, Building2, Briefcase, Users } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  active: 'default',
  inactive: 'secondary',
  blacklisted: 'destructive',
} as const;

const driveStatusColors = {
  scheduled: 'default',
  ongoing: 'secondary',
  completed: 'outline',
  cancelled: 'destructive',
} as const;

export default function PlacementsPage() {
  const [tab, setTab] = useState<'companies' | 'drives'>('companies');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const { data: drives, isLoading: drivesLoading } = usePlacementDrives();
  const deleteMutation = useDeleteCompany();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this company?')) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const companyColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Company Name',
      cell: ({ row }) => {
        const company = row.original;
        return (
          <Link
            href={`/campus/placements/companies/${company.id}`}
            className="font-medium hover:underline"
          >
            {company.name}
          </Link>
        );
      },
    },
    {
      accessorKey: 'industry',
      header: 'Industry',
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => row.original.location || 'N/A',
    },
    {
      accessorKey: 'package',
      header: () => (
        <div className="flex items-center">
          <Briefcase className="mr-2 h-4 w-4" />
          Package
        </div>
      ),
      cell: ({ row }) => row.original.package || 'N/A',
    },
    {
      accessorKey: 'drives',
      header: () => (
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          Drives
        </div>
      ),
      cell: ({ row }) => row.original._count?.drives || 0,
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
        const company = row.original;
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
                <Link href={`/campus/placements/companies/${company.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/campus/placements/companies/${company.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(company.id)}
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

  const driveColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Drive Title',
      cell: ({ row }) => {
        const drive = row.original;
        return (
          <div>
            <Link
              href={`/campus/placements/drives/${drive.id}`}
              className="font-medium hover:underline"
            >
              {drive.title}
            </Link>
            <p className="text-sm text-muted-foreground">
              {drive.company?.name}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.date), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => row.original.location || 'N/A',
    },
    {
      accessorKey: 'package',
      header: 'Package',
      cell: ({ row }) => row.original.package || 'N/A',
    },
    {
      accessorKey: 'positions',
      header: 'Positions',
    },
    {
      accessorKey: 'applications',
      header: () => (
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          Applications
        </div>
      ),
      cell: ({ row }) => row.original._count?.applications || 0,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as keyof typeof driveStatusColors;
        return (
          <Badge variant={driveStatusColors[status] || 'default'}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const drive = row.original;
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
                <Link href={`/campus/placements/drives/${drive.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/campus/placements/drives/${drive.id}/edit`}>
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

  const filteredCompanies = companies?.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDrives = drives?.filter(
    (drive) =>
      drive.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.company?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Placement Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage companies, placement drives, and student applications
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="drives">Placement Drives</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'companies' ? 'Search companies...' : 'Search drives...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'companies' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/placements/companies/new">
                <Building2 className="mr-2 h-4 w-4" />
                Add Company
              </Link>
            </Button>
          </div>
          <DataTable
            columns={companyColumns}
            data={filteredCompanies || []}
            isLoading={companiesLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Building2 className="inline h-4 w-4 mr-1" />
            Total: {filteredCompanies?.length || 0} companies
          </div>
        </>
      )}

      {tab === 'drives' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/placements/drives/new">
                <Briefcase className="mr-2 h-4 w-4" />
                Schedule Drive
              </Link>
            </Button>
          </div>
          <DataTable
            columns={driveColumns}
            data={filteredDrives || []}
            isLoading={drivesLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Briefcase className="inline h-4 w-4 mr-1" />
            Total: {filteredDrives?.length || 0} drives
          </div>
        </>
      )}
    </div>
  );
}
