'use client';

import { useState } from 'react';
import { useAntiRaggingCommittees, useAntiRaggingIncidents, useAwarenessCampaigns } from '@/services/anti-ragging.service';
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
import { MoreHorizontal, Pencil, Users, AlertTriangle, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  active: 'default',
  inactive: 'secondary',
  reported: 'secondary',
  under_investigation: 'default',
  resolved: 'outline',
  closed: 'outline',
  planned: 'secondary',
  ongoing: 'default',
  completed: 'outline',
  cancelled: 'destructive',
} as const;

const severityColors = {
  minor: 'secondary',
  moderate: 'default',
  severe: 'destructive',
  critical: 'destructive',
} as const;

export default function AntiRaggingPage() {
  const [tab, setTab] = useState<'committee' | 'incidents' | 'campaigns'>('committee');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: committees, isLoading: committeesLoading } = useAntiRaggingCommittees();
  const { data: incidents, isLoading: incidentsLoading } = useAntiRaggingIncidents();
  const { data: campaigns, isLoading: campaignsLoading } = useAwarenessCampaigns();

  const committeeColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Committee Name',
      cell: ({ row }) => {
        const committee = row.original;
        return (
          <Link
            href={`/anti-ragging/committee/${committee.id}`}
            className="font-medium hover:underline"
          >
            {committee.name}
          </Link>
        );
      },
    },
    {
      accessorKey: 'chairman',
      header: 'Chairman',
      cell: ({ row }) => {
        const chairman = row.original.chairman;
        return chairman ? `${chairman.firstName} ${chairman.lastName}` : 'N/A';
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
      accessorKey: 'incidents',
      header: () => (
        <div className="flex items-center">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Incidents
        </div>
      ),
      cell: ({ row }) => row.original._count?.incidents || 0,
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
                <Link href={`/anti-ragging/committee/${committee.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/anti-ragging/committee/${committee.id}/edit`}>
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

  const incidentColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'incidentNumber',
      header: 'Incident No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('incidentNumber')}</Badge>,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const incident = row.original;
        return (
          <Link
            href={`/anti-ragging/incidents/${incident.id}`}
            className="font-medium hover:underline"
          >
            {incident.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'incidentDate',
      header: 'Incident Date',
      cell: ({ row }) => format(new Date(row.original.incidentDate), 'MMM dd, yyyy'),
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
      accessorKey: 'reporterType',
      header: 'Reported By',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('reporterType')}</Badge>,
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
        const incident = row.original;
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
                <Link href={`/anti-ragging/incidents/${incident.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/anti-ragging/incidents/${incident.id}/edit`}>
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

  const campaignColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Campaign Title',
      cell: ({ row }) => {
        const campaign = row.original;
        return (
          <Link
            href={`/anti-ragging/campaigns/${campaign.id}`}
            className="font-medium hover:underline"
          >
            {campaign.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'campaignType',
      header: 'Type',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('campaignType')}</Badge>,
    },
    {
      accessorKey: 'campaignDate',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.campaignDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'targetAudience',
      header: 'Target Audience',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('targetAudience')}</Badge>,
    },
    {
      accessorKey: 'participants',
      header: 'Participants',
      cell: ({ row }) => row.original.participants || 0,
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
        const campaign = row.original;
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
                <Link href={`/anti-ragging/campaigns/${campaign.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/anti-ragging/campaigns/${campaign.id}/edit`}>
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

  const filteredIncidents = incidents?.filter(
    (incident) =>
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.incidentNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCampaigns = campaigns?.filter(
    (campaign) =>
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.campaignType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Anti-Ragging Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage anti-ragging committee, incidents, and awareness campaigns
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="committee">Committee</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'committee' ? 'Search committees...' : tab === 'incidents' ? 'Search incidents...' : 'Search campaigns...'}
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
              <Link href="/anti-ragging/committee/new">
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

      {tab === 'incidents' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/anti-ragging/incidents/new">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Report Incident
              </Link>
            </Button>
          </div>
          <DataTable
            columns={incidentColumns}
            data={filteredIncidents || []}
            isLoading={incidentsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <AlertTriangle className="inline h-4 w-4 mr-1" />
            Total: {filteredIncidents?.length || 0} incidents
          </div>
        </>
      )}

      {tab === 'campaigns' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/anti-ragging/campaigns/new">
                <Megaphone className="mr-2 h-4 w-4" />
                Create Campaign
              </Link>
            </Button>
          </div>
          <DataTable
            columns={campaignColumns}
            data={filteredCampaigns || []}
            isLoading={campaignsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Megaphone className="inline h-4 w-4 mr-1" />
            Total: {filteredCampaigns?.length || 0} campaigns
          </div>
        </>
      )}
    </div>
  );
}
