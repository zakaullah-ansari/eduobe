'use client';

import { useState } from 'react';
import { usePublications, useResearchProjects, useGrants, useDeletePublication } from '@/services/research.service';
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
import { MoreHorizontal, Pencil, Trash2, BookOpen, FolderKanban, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const statusColors = {
  published: 'default',
  accepted: 'secondary',
  submitted: 'outline',
  in_review: 'secondary',
  rejected: 'destructive',
  ongoing: 'default',
  completed: 'outline',
  approved: 'default',
  applied: 'secondary',
} as const;

const publicationTypes = {
  journal: 'Journal',
  conference: 'Conference',
  book: 'Book',
  chapter: 'Chapter',
  patent: 'Patent',
  other: 'Other',
} as const;

export default function ResearchPage() {
  const [tab, setTab] = useState<'publications' | 'projects' | 'grants'>('publications');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: publications, isLoading: publicationsLoading } = usePublications();
  const { data: projects, isLoading: projectsLoading } = useResearchProjects();
  const { data: grants, isLoading: grantsLoading } = useGrants();
  const deleteMutation = useDeletePublication();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const publicationColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const publication = row.original;
        return (
          <Link
            href={`/research/publications/${publication.id}`}
            className="font-medium hover:underline"
          >
            {publication.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as keyof typeof publicationTypes;
        return <Badge variant="outline">{publicationTypes[type]}</Badge>;
      },
    },
    {
      accessorKey: 'year',
      header: 'Year',
    },
    {
      accessorKey: 'journal',
      header: 'Journal/Conference',
      cell: ({ row }) => row.original.journal || row.original.conference || 'N/A',
    },
    {
      accessorKey: 'impactFactor',
      header: 'Impact Factor',
      cell: ({ row }) => row.original.impactFactor?.toFixed(2) || 'N/A',
    },
    {
      accessorKey: 'citations',
      header: 'Citations',
      cell: ({ row }) => row.original.citations || 0,
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
        const publication = row.original;
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
                <Link href={`/research/publications/${publication.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/research/publications/${publication.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(publication.id)}
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

  const projectColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Project Title',
      cell: ({ row }) => {
        const project = row.original;
        return (
          <Link
            href={`/research/projects/${project.id}`}
            className="font-medium hover:underline"
          >
            {project.title}
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
      accessorKey: 'principalInvestigator',
      header: 'PI',
      cell: ({ row }) => row.original.principalInvestigator || 'N/A',
    },
    {
      accessorKey: 'fundingAgency',
      header: 'Funding Agency',
      cell: ({ row }) => row.original.fundingAgency || 'N/A',
    },
    {
      accessorKey: 'grantAmount',
      header: () => (
        <div className="flex items-center">
          <IndianRupee className="mr-2 h-4 w-4" />
          Grant Amount
        </div>
      ),
      cell: ({ row }) => {
        const amount = row.getValue('grantAmount') as number;
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
                <Link href={`/research/projects/${project.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/research/projects/${project.id}/edit`}>
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

  const grantColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Grant Title',
    },
    {
      accessorKey: 'fundingAgency',
      header: 'Funding Agency',
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
      accessorKey: 'duration',
      header: 'Duration',
      cell: ({ row }) => `${row.getValue('duration')} months`,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('type')}</Badge>,
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

  const filteredPublications = publications?.filter(
    (pub) =>
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.conference?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = projects?.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.principalInvestigator?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.fundingAgency?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGrants = grants?.filter(
    (grant) =>
      grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.fundingAgency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Research Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage research publications, projects, and grants
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="publications">Publications</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="grants">Grants</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'publications' ? 'Search publications...' : tab === 'projects' ? 'Search projects...' : 'Search grants...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'publications' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/research/publications/new">
                <BookOpen className="mr-2 h-4 w-4" />
                Add Publication
              </Link>
            </Button>
          </div>
          <DataTable
            columns={publicationColumns}
            data={filteredPublications || []}
            isLoading={publicationsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <BookOpen className="inline h-4 w-4 mr-1" />
            Total: {filteredPublications?.length || 0} publications
          </div>
        </>
      )}

      {tab === 'projects' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/research/projects/new">
                <FolderKanban className="mr-2 h-4 w-4" />
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
            <FolderKanban className="inline h-4 w-4 mr-1" />
            Total: {filteredProjects?.length || 0} projects
          </div>
        </>
      )}

      {tab === 'grants' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/research/grants/new">
                <IndianRupee className="mr-2 h-4 w-4" />
                Apply for Grant
              </Link>
            </Button>
          </div>
          <DataTable
            columns={grantColumns}
            data={filteredGrants || []}
            isLoading={grantsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <IndianRupee className="inline h-4 w-4 mr-1" />
            Total: {filteredGrants?.length || 0} grants
          </div>
        </>
      )}
    </div>
  );
}
