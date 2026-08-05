'use client';

import { useState } from 'react';
import { useAlumniProfiles, useAlumniEvents, useAlumniDonations, useAlumniMentorships } from '@/services/alumni.service';
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
import { MoreHorizontal, Pencil, Users, Calendar, IndianRupee, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  active: 'default',
  inactive: 'secondary',
  deceased: 'destructive',
  upcoming: 'secondary',
  ongoing: 'default',
  completed: 'outline',
  cancelled: 'destructive',
  pending: 'secondary',
  received: 'default',
  acknowledged: 'outline',
  utilized: 'outline',
  terminated: 'destructive',
} as const;

export default function AlumniPage() {
  const [tab, setTab] = useState<'profiles' | 'events' | 'donations' | 'mentorship'>('profiles');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: profiles, isLoading: profilesLoading } = useAlumniProfiles();
  const { data: events, isLoading: eventsLoading } = useAlumniEvents();
  const { data: donations, isLoading: donationsLoading } = useAlumniDonations();
  const { data: mentorships, isLoading: mentorshipsLoading } = useAlumniMentorships();

  const profileColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'alumniNumber',
      header: 'Alumni No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('alumniNumber')}</Badge>,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const alumni = row.original;
        return (
          <Link
            href={`/campus/alumni/${alumni.id}`}
            className="font-medium hover:underline"
          >
            {alumni.firstName} {alumni.lastName}
          </Link>
        );
      },
    },
    {
      accessorKey: 'graduationYear',
      header: 'Graduation Year',
    },
    {
      accessorKey: 'program',
      header: 'Program',
      cell: ({ row }) => row.original.program?.name || 'N/A',
    },
    {
      accessorKey: 'currentCompany',
      header: 'Current Company',
      cell: ({ row }) => row.original.currentCompany || 'N/A',
    },
    {
      accessorKey: 'currentDesignation',
      header: 'Designation',
      cell: ({ row }) => row.original.currentDesignation || 'N/A',
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
                  View Details
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
      accessorKey: 'eventType',
      header: 'Type',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('eventType')}</Badge>,
    },
    {
      accessorKey: 'eventDate',
      header: 'Event Date',
      cell: ({ row }) => format(new Date(row.original.eventDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => row.original.location || 'N/A',
    },
    {
      accessorKey: 'currentAttendees',
      header: 'Attendees',
      cell: ({ row }) => {
        const event = row.original;
        return `${event.currentAttendees || 0}${event.maxAttendees ? `/${event.maxAttendees}` : ''}`;
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
        const event = row.original;
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
                <Link href={`/campus/alumni/events/${event.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/campus/alumni/events/${event.id}/edit`}>
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

  const donationColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'donationNumber',
      header: 'Donation No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('donationNumber')}</Badge>,
    },
    {
      accessorKey: 'alumni',
      header: 'Alumni',
      cell: ({ row }) => {
        const alumni = row.original.alumni;
        return alumni ? `${alumni.firstName} ${alumni.lastName}` : 'N/A';
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
      accessorKey: 'donationDate',
      header: 'Donation Date',
      cell: ({ row }) => format(new Date(row.original.donationDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('paymentMethod')}</Badge>,
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
        const donation = row.original;
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
                <Link href={`/campus/alumni/donations/${donation.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const mentorshipColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'programName',
      header: 'Program Name',
      cell: ({ row }) => {
        const mentorship = row.original;
        return (
          <Link
            href={`/campus/alumni/mentorship/${mentorship.id}`}
            className="font-medium hover:underline"
          >
            {mentorship.programName}
          </Link>
        );
      },
    },
    {
      accessorKey: 'mentor',
      header: 'Mentor',
      cell: ({ row }) => {
        const mentor = row.original.mentor;
        return mentor ? (
          <div>
            <p className="font-medium">{mentor.firstName} {mentor.lastName}</p>
            {mentor.currentCompany && (
              <p className="text-sm text-muted-foreground">{mentor.currentCompany}</p>
            )}
          </div>
        ) : 'N/A';
      },
    },
    {
      accessorKey: 'mentee',
      header: 'Mentee',
      cell: ({ row }) => {
        const mentee = row.original.mentee;
        return mentee ? (
          <div>
            <p className="font-medium">{mentee.firstName} {mentee.lastName}</p>
            {mentee.program && (
              <p className="text-sm text-muted-foreground">{mentee.program.name}</p>
            )}
          </div>
        ) : 'N/A';
      },
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => format(new Date(row.original.startDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'meetings',
      header: 'Meetings',
      cell: ({ row }) => row.original.meetings || 0,
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
        const mentorship = row.original;
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
                <Link href={`/campus/alumni/mentorship/${mentorship.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredProfiles = profiles?.filter(
    (profile) =>
      `${profile.firstName} ${profile.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.currentCompany?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = events?.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDonations = donations?.filter(
    (donation) =>
      donation.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.alumni?.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMentorships = mentorships?.filter(
    (mentorship) =>
      mentorship.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentorship.mentor?.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Alumni Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage alumni database, events, donations, and mentorship programs
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'profiles' ? 'Search alumni...' : tab === 'events' ? 'Search events...' : tab === 'donations' ? 'Search donations...' : 'Search mentorships...'}
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

      {tab === 'mentorship' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/alumni/mentorship/new">
                <UserCheck className="mr-2 h-4 w-4" />
                Create Mentorship
              </Link>
            </Button>
          </div>
          <DataTable
            columns={mentorshipColumns}
            data={filteredMentorships || []}
            isLoading={mentorshipsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <UserCheck className="inline h-4 w-4 mr-1" />
            Total: {filteredMentorships?.length || 0} mentorships
          </div>
        </>
      )}
    </div>
  );
}
