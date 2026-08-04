'use client';

import { useState } from 'react';
import { useInnovationProjects, useStartups, useInnovationChallenges } from '@/services/innovation.service';
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
import { MoreHorizontal, Pencil, Lightbulb, Rocket, Trophy, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const statusColors = {
  active: 'default',
  completed: 'outline',
  on_hold: 'secondary',
  cancelled: 'destructive',
  inactive: 'secondary',
  acquired: 'outline',
  closed: 'destructive',
  upcoming: 'secondary',
  ongoing: 'default',
} as const;

const stageColors = {
  ideation: 'secondary',
  prototype: 'default',
  testing: 'outline',
  launch: 'default',
  idea: 'secondary',
  'pre-seed': 'outline',
  seed: 'default',
  series_a: 'default',
  series_b: 'default',
  growth: 'outline',
  exit: 'secondary',
} as const;

export default function InnovationPage() {
  const [tab, setTab] = useState<'projects' | 'startups' | 'challenges'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: projects, isLoading: projectsLoading } = useInnovationProjects();
  const { data: startups, isLoading: startupsLoading } = useStartups();
  const { data: challenges, isLoading: challengesLoading } = useInnovationChallenges();

  const projectColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Project Title',
      cell: ({ row }) => {
        const project = row.original;
        return (
          <Link
            href={`/innovation/projects/${project.id}`}
            className="font-medium hover:underline"
          >
            {project.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('category')}</Badge>,
    },
    {
      accessorKey: 'stage',
      header: 'Stage',
      cell: ({ row }) => {
        const stage = row.getValue('stage') as keyof typeof stageColors;
        return (
          <Badge variant={stageColors[stage] || 'default'}>
            {stage}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'facultyMentor',
      header: 'Faculty Mentor',
      cell: ({ row }) => row.original.facultyMentor || 'N/A',
    },
    {
      accessorKey: 'fundingAmount',
      header: () => (
        <div className="flex items-center">
          <IndianRupee className="mr-2 h-4 w-4" />
          Funding
        </div>
      ),
      cell: ({ row }) => {
        const amount = row.original.fundingAmount as number;
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
                <Link href={`/innovation/projects/${project.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/innovation/projects/${project.id}/edit`}>
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

  const startupColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Startup Name',
      cell: ({ row }) => {
        const startup = row.original;
        return (
          <Link
            href={`/innovation/startups/${startup.id}`}
            className="font-medium hover:underline"
          >
            {startup.name}
          </Link>
        );
      },
    },
    {
      accessorKey: 'industry',
      header: 'Industry',
    },
    {
      accessorKey: 'stage',
      header: 'Stage',
      cell: ({ row }) => {
        const stage = row.getValue('stage') as keyof typeof stageColors;
        return (
          <Badge variant={stageColors[stage] || 'default'}>
            {stage.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'fundingRaised',
      header: () => (
        <div className="flex items-center">
          <IndianRupee className="mr-2 h-4 w-4" />
          Funding Raised
        </div>
      ),
      cell: ({ row }) => {
        const amount = row.original.fundingRaised as number;
        return amount ? `₹${amount.toLocaleString('en-IN')}` : 'N/A';
      },
    },
    {
      accessorKey: 'incubationStatus',
      header: 'Incubation',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('incubationStatus')}</Badge>,
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
        const startup = row.original;
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
                <Link href={`/innovation/startups/${startup.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/innovation/startups/${startup.id}/edit`}>
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

  const challengeColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Challenge Title',
      cell: ({ row }) => {
        const challenge = row.original;
        return (
          <Link
            href={`/innovation/challenges/${challenge.id}`}
            className="font-medium hover:underline"
          >
            {challenge.title}
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
      accessorKey: 'organizer',
      header: 'Organizer',
      cell: ({ row }) => row.original.organizer || 'N/A',
    },
    {
      accessorKey: 'prizeAmount',
      header: () => (
        <div className="flex items-center">
          <IndianRupee className="mr-2 h-4 w-4" />
          Prize
        </div>
      ),
      cell: ({ row }) => {
        const amount = row.original.prizeAmount as number;
        return amount ? `₹${amount.toLocaleString('en-IN')}` : 'N/A';
      },
    },
    {
      accessorKey: 'participants',
      header: 'Participants',
      cell: ({ row }) => row.original._count?.teams || row.original.participants || 0,
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
        const challenge = row.original;
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
                <Link href={`/innovation/challenges/${challenge.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/innovation/challenges/${challenge.id}/edit`}>
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

  const filteredProjects = projects?.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStartups = startups?.filter(
    (startup) =>
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChallenges = challenges?.filter(
    (challenge) =>
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Innovation Hub</h1>
        <p className="text-muted-foreground mt-1">
          Manage student projects, startups, and innovation challenges
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="startups">Startups</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'projects' ? 'Search projects...' : tab === 'startups' ? 'Search startups...' : 'Search challenges...'}
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
              <Link href="/innovation/projects/new">
                <Lightbulb className="mr-2 h-4 w-4" />
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
            <Lightbulb className="inline h-4 w-4 mr-1" />
            Total: {filteredProjects?.length || 0} projects
          </div>
        </>
      )}

      {tab === 'startups' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/innovation/startups/new">
                <Rocket className="mr-2 h-4 w-4" />
                Register Startup
              </Link>
            </Button>
          </div>
          <DataTable
            columns={startupColumns}
            data={filteredStartups || []}
            isLoading={startupsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Rocket className="inline h-4 w-4 mr-1" />
            Total: {filteredStartups?.length || 0} startups
          </div>
        </>
      )}

      {tab === 'challenges' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/innovation/challenges/new">
                <Trophy className="mr-2 h-4 w-4" />
                Create Challenge
              </Link>
            </Button>
          </div>
          <DataTable
            columns={challengeColumns}
            data={filteredChallenges || []}
            isLoading={challengesLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Trophy className="inline h-4 w-4 mr-1" />
            Total: {filteredChallenges?.length || 0} challenges
          </div>
        </>
      )}
    </div>
  );
}
