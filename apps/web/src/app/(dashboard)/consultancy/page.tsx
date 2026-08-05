'use client';

import { useState } from 'react';
import { useConsultancyProjects, useConsultancyClients, useDeleteConsultancyProject } from '@/services/consultancy.service';
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
import { MoreHorizontal, Pencil, Trash2, Briefcase, Building2, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  ongoing: 'default',
  completed: 'outline',
  cancelled: 'destructive',
  proposed: 'secondary',
  active: 'default',
  inactive: 'secondary',
} as const;

export default function ConsultancyPage() {
  const [tab, setTab] = useState<'projects' | 'clients'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: projects, isLoading: projectsLoading } = useConsultancyProjects();
  const { data: clients, isLoading: clientsLoading } = useConsultancyClients();
  const deleteMutation = useDeleteConsultancyProject();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const projectColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Project Title',
      cell: ({ row }) => {
        const project = row.original;
        return (
          <Link
            href={`/consultancy/projects/${project.id}`}
            className="font-medium hover:underline"
          >
            {project.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'client',
      header: 'Client',
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
        const project = row.original;
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
                <Link href={`/consultancy/projects/${project.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/consultancy/projects/${project.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(project.id)}
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

  const clientColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Client Name',
    },
    {
      accessorKey: 'industry',
      header: 'Industry',
    },
    {
      accessorKey: 'contactPerson',
      header: 'Contact Person',
      cell: ({ row }) => row.original.contactPerson || 'N/A',
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => row.original.email || 'N/A',
    },
    {
      accessorKey: 'projects',
      header: () => (
        <div className="flex items-center">
          <Briefcase className="mr-2 h-4 w-4" />
          Projects
        </div>
      ),
      cell: ({ row }) => row.original._count?.projects || 0,
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
  ];

  const filteredProjects = projects?.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClients = clients?.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Consultancy Services</h1>
        <p className="text-muted-foreground mt-1">
          Manage consultancy projects and clients
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'projects' ? 'Search projects...' : 'Search clients...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'projects' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/consultancy/projects/new">
                <Briefcase className="mr-2 h-4 w-4" />
                Add Project
              </Link>
            </Button>
          </div>
          <DataTable
            columns={projectColumns}
            data={filteredProjects || []}
            isLoading={projectsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Briefcase className="inline h-4 w-4 mr-1" />
            Total: {filteredProjects?.length || 0} projects
          </div>
        </>
      )}

      {tab === 'clients' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/consultancy/clients/new">
                <Building2 className="mr-2 h-4 w-4" />
                Add Client
              </Link>
            </Button>
          </div>
          <DataTable
            columns={clientColumns}
            data={filteredClients || []}
            isLoading={clientsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Building2 className="inline h-4 w-4 mr-1" />
            Total: {filteredClients?.length || 0} clients
          </div>
        </>
      )}
    </div>
  );
}
