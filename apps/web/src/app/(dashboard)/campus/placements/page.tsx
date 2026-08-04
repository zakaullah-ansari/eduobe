'use client';

import { useState } from 'react';
import { useCompanies, usePlacementDrives, useApplications } from '@/services/placement.service';
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
import { MoreHorizontal, Pencil, Trash2, Building2, Calendar, FileText, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  active: 'default',
  inactive: 'secondary',
  blacklisted: 'destructive',
  scheduled: 'secondary',
  ongoing: 'default',
  completed: 'outline',
  cancelled: 'destructive',
  applied: 'secondary',
  shortlisted: 'default',
  rejected: 'destructive',
  selected: 'default',
  offered: 'default',
  joined: 'outline',
  declined: 'destructive',
} as const;

export default function PlacementsPage() {
  const [tab, setTab] = useState<'companies' | 'drives' | 'applications'>('companies');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const { data: drives, isLoading: drivesLoading } = usePlacementDrives();
  const { data: applications, isLoading: applicationsLoading } = useApplications();

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
      cell: ({ row }) => <Badge variant="outline">{row.getValue('industry')}</Badge>,
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => row.original.location || 'N/A',
    },
    {
      accessorKey: 'contactPerson',
      header: 'Contact Person',
      cell: ({ row }) => row.original.contactPerson || 'N/A',
    },
    {
      accessorKey: 'drives',
      header: () => (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Drives
        </div>
      ),
      cell: ({ row }) => row.original._count?.drives || 0,
    },
    {
      accessorKey: 'offers',
      header: () => (
        <div className="flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          Offers
        </div>
      ),
      cell: ({ row }) => row.original._count?.offers || 0,
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
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const driveColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'driveNumber',
      header: 'Drive No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('driveNumber')}</Badge>,
    },
    {
      accessorKey: 'title',
      header: 'Drive Title',
      cell: ({ row }) => {
        const drive = row.original;
        return (
          <Link
            href={`/campus/placements/drives/${drive.id}`}
            className="font-medium hover:underline"
          >
            {drive.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'company',
      header: 'Company',
      cell: ({ row }) => row.original.company?.name || 'N/A',
    },
    {
      accessorKey: 'driveDate',
      header: 'Drive Date',
      cell: ({ row }) => format(new Date(row.original.driveDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'driveType',
      header: 'Type',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('driveType')}</Badge>,
    },
    {
      accessorKey: 'packageOffered',
      header: () => (
        <div className="flex items-center">
          <IndianRupee className="mr-2 h-4 w-4" />
          Package (LPA)
        </div>
      ),
      cell: ({ row }) => {
        const pkg = row.original.packageOffered;
        return pkg ? `₹${(pkg / 100000).toFixed(2)} LPA` : 'N/A';
      },
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
      accessorKey: 'drive',
      header: 'Drive',
      cell: ({ row }) => {
        const drive = row.original.drive;
        return drive ? (
          <div>
            <p className="font-medium">{drive.title}</p>
            <p className="text-sm text-muted-foreground">{drive.company?.name}</p>
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
      accessorKey: 'offeredPackage',
      header: () => (
        <div className="flex items-center">
          <IndianRupee className="mr-2 h-4 w-4" />
          Offered Package
        </div>
      ),
      cell: ({ row }) => {
        const pkg = row.original.offeredPackage;
        return pkg ? `₹${(pkg / 100000).toFixed(2)} LPA` : 'N/A';
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
                <Link href={`/campus/placements/applications/${application.id}`}>
                  View Details
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

  const filteredApplications = applications?.filter(
    (application) =>
      application.student?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.drive?.title.toLowerCase().includes(searchQuery.toLowerCase())
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
          <TabsTrigger value="drives">Drives</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'companies' ? 'Search companies...' : tab === 'drives' ? 'Search drives...' : 'Search applications...'}
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
                <Calendar className="mr-2 h-4 w-4" />
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
            <Calendar className="inline h-4 w-4 mr-1" />
            Total: {filteredDrives?.length || 0} drives
          </div>
        </>
      )}

      {tab === 'applications' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/placements/applications/new">
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
    </div>
  );
}
