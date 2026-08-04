'use client';

import { useState } from 'react';
import { useAlumniProfiles, useAlumniEvents, useAlumniDonations } from '@/services/alumni.service';
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
import { MoreHorizontal, Pencil, Users, Calendar, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const eventStatusColors = {
  upcoming: 'default',
  ongoing: 'secondary',
  completed: 'outline',
  cancelled: 'destructive',
} as const;

const eventTypes = {
  networking: 'Networking',
  seminar: 'Seminar',
  workshop: 'Workshop',
  reunion: 'Reunion',
  mentorship: 'Mentorship',
} as const;

export default function AlumniPage() {
  const [tab, setTab] = useState<'profiles' | 'events' | 'donations'>('profiles');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: profiles, isLoading: profilesLoading } = useAlumniProfiles();
  const { data: events, isLoading: eventsLoading } = useAlumniEvents();
  const { data: donations, isLoading: donationsLoading } = useAlumniDonations();

  const profileColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const alumni = row.original;
        return (
          <div>
            <Link
              href={`/campus/alumni/${alumni.id}`}
              className="font-medium hover:underline"
            >
              {alumni.student?.firstName} {alumni.student?.lastName}
            </Link>
            <p className="text-sm text-muted-foreground">
              {alumni.student?.rollNumber}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'graduationYear',
      header: 'Graduation Year',
    },
    {
      accessorKey: 'currentCompany',
      header: 'Company',
      cell: ({ row }) => row.original.currentCompany || 'N/A',
    },
    {
      accessorKey: 'currentDesignation',
      header: 'Designation',
      cell: ({ row }) => row.original.currentDesignation || 'N/A',
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => row.original.location || 'N/A',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const alumni = row.original;
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
                <Link href={`/campus/alumni/${alumni.id}`}>
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/campus/alumni/${alumni.id}/edit`}>
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

  const eventColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Event Title',
      cell: ({ row }) => {
        const event = row.original;
        return (
          <Link
            href={`/campus/alumni/events/${event.id}`}
            className="font-medium hover:underline"
          >
            {event.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as keyof typeof eventTypes;
        return <Badge variant="outline">{eventTypes[type]}</Badge>;
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
      accessorKey: 'attendees',
      header: () => (
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          Attendees
        </div>
      ),
      cell: ({ row }) => row.original._count?.attendees || 0,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as keyof typeof eventStatusColors;
        return (
          <Badge variant={eventStatusColors[status] || 'default'}>
            {status}
          </Badge>
        );
      },
    },
  ];

  const donationColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'alumni',
      header: 'Alumni',
      cell: ({ row }) => {
        const donation = row.original;
        return (
          <div>
            <p className="font-medium">
              {donation.alumni?.student?.firstName} {donation.alumni?.student?.lastName}
            </p>
          </div>
        );
      },
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
      accessorKey: 'purpose',
      header: 'Purpose',
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.date), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => <Badge variant="outline">{row.original.paymentMethod}</Badge>,
    },
    {
      accessorKey: 'receiptNumber',
      header: 'Receipt No.',
    },
  ];

  const filteredProfiles = profiles?.filter(
    (profile) =>
      profile.student?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.student?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.currentCompany?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = events?.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDonations = donations?.filter(
    (donation) =>
      donation.alumni?.student?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Alumni Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage alumni profiles, events, and donations
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'profiles' ? 'Search alumni...' : tab === 'events' ? 'Search events...' : 'Search donations...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'profiles' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/alumni/new">
                <Users className="mr-2 h-4 w-4" />
                Add Alumni
              </Link>
            </Button>
          </div>
          <DataTable
            columns={profileColumns}
            data={filteredProfiles || []}
            isLoading={profilesLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Users className="inline h-4 w-4 mr-1" />
            Total: {filteredProfiles?.length || 0} alumni
          </div>
        </>
      )}

      {tab === 'events' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/alumni/events/new">
                <Calendar className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </div>
          <DataTable
            columns={eventColumns}
            data={filteredEvents || []}
            isLoading={eventsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Calendar className="inline h-4 w-4 mr-1" />
            Total: {filteredEvents?.length || 0} events
          </div>
        </>
      )}

      {tab === 'donations' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/alumni/donations/new">
                <IndianRupee className="mr-2 h-4 w-4" />
                Record Donation
              </Link>
            </Button>
          </div>
          <DataTable
            columns={donationColumns}
            data={filteredDonations || []}
            isLoading={donationsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <IndianRupee className="inline h-4 w-4 mr-1" />
            Total: {filteredDonations?.length || 0} donations
          </div>
        </>
      )}
    </div>
  );
}
