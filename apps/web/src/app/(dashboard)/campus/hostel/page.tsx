'use client';

import { useState } from 'react';
import { useHostelRooms, useRoomAllocations, useMessMenus, useComplaints } from '@/services/hostel.service';
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
import { MoreHorizontal, Pencil, Building2, Users, Utensils, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  available: 'default',
  full: 'secondary',
  maintenance: 'outline',
  reserved: 'destructive',
  active: 'default',
  expired: 'secondary',
  cancelled: 'destructive',
  pending: 'secondary',
  'in-progress': 'default',
  resolved: 'outline',
  rejected: 'destructive',
} as const;

const priorityColors = {
  low: 'secondary',
  medium: 'default',
  high: 'destructive',
  urgent: 'destructive',
} as const;

export default function HostelPage() {
  const [tab, setTab] = useState<'rooms' | 'allocations' | 'mess' | 'complaints'>('rooms');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: rooms, isLoading: roomsLoading } = useHostelRooms();
  const { data: allocations, isLoading: allocationsLoading } = useRoomAllocations();
  const { data: menus, isLoading: menusLoading } = useMessMenus();
  const { data: complaints, isLoading: complaintsLoading } = useComplaints();

  const roomColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'roomNumber',
      header: 'Room Number',
      cell: ({ row }) => {
        const room = row.original;
        return (
          <Link
            href={`/campus/hostel/rooms/${room.id}`}
            className="font-medium hover:underline"
          >
            {room.roomNumber}
          </Link>
        );
      },
    },
    {
      accessorKey: 'block',
      header: 'Block',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('block')}</Badge>,
    },
    {
      accessorKey: 'floor',
      header: 'Floor',
    },
    {
      accessorKey: 'roomType',
      header: 'Type',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('roomType')}</Badge>,
    },
    {
      accessorKey: 'occupancy',
      header: () => (
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          Occupancy
        </div>
      ),
      cell: ({ row }) => {
        const room = row.original;
        return `${room.currentOccupancy}/${room.capacity}`;
      },
    },
    {
      accessorKey: 'monthlyRent',
      header: 'Monthly Rent',
      cell: ({ row }) => `₹${(row.getValue('monthlyRent') as number).toLocaleString('en-IN')}`,
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
        const room = row.original;
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
                <Link href={`/campus/hostel/rooms/${room.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/campus/hostel/rooms/${room.id}/edit`}>
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

  const allocationColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'student',
      header: 'Student',
      cell: ({ row }) => {
        const allocation = row.original;
        return (
          <div>
            <p className="font-medium">
              {allocation.student?.firstName} {allocation.student?.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {allocation.student?.rollNumber}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'room',
      header: 'Room',
      cell: ({ row }) => {
        const allocation = row.original;
        return `${allocation.room?.roomNumber} (${allocation.room?.block})`;
      },
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
      accessorKey: 'monthlyRent',
      header: 'Monthly Rent',
      cell: ({ row }) => `₹${(row.getValue('monthlyRent') as number).toLocaleString('en-IN')}`,
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

  const menuColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.date), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'breakfast',
      header: 'Breakfast',
      cell: ({ row }) => row.original.breakfast || 'N/A',
    },
    {
      accessorKey: 'lunch',
      header: 'Lunch',
      cell: ({ row }) => row.original.lunch || 'N/A',
    },
    {
      accessorKey: 'snacks',
      header: 'Snacks',
      cell: ({ row }) => row.original.snacks || 'N/A',
    },
    {
      accessorKey: 'dinner',
      header: 'Dinner',
      cell: ({ row }) => row.original.dinner || 'N/A',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const menu = row.original;
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
                <Link href={`/campus/hostel/menus/${menu.id}/edit`}>
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

  const complaintColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ row }) => {
        const complaint = row.original;
        return (
          <Link
            href={`/campus/hostel/complaints/${complaint.id}`}
            className="font-medium hover:underline"
          >
            {complaint.subject}
          </Link>
        );
      },
    },
    {
      accessorKey: 'student',
      header: 'Student',
      cell: ({ row }) => {
        const complaint = row.original;
        return `${complaint.student?.firstName} ${complaint.student?.lastName}`;
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('category')}</Badge>,
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priority = row.getValue('priority') as keyof typeof priorityColors;
        return (
          <Badge variant={priorityColors[priority] || 'default'}>
            {priority}
          </Badge>
        );
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
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM dd, yyyy'),
    },
  ];

  const filteredRooms = rooms?.filter(
    (room) =>
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.block.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAllocations = allocations?.filter(
    (allocation) =>
      allocation.student?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      allocation.student?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      allocation.room?.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMenus = menus?.filter(
    (menu) =>
      format(new Date(menu.date), 'MMM dd, yyyy').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComplaints = complaints?.filter(
    (complaint) =>
      complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.student?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Hostel Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage hostel rooms, allocations, mess, and complaints
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
          <TabsTrigger value="mess">Mess Menu</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'rooms' ? 'Search rooms...' : tab === 'allocations' ? 'Search allocations...' : tab === 'mess' ? 'Search menus...' : 'Search complaints...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'rooms' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/hostel/rooms/new">
                <Building2 className="mr-2 h-4 w-4" />
                Add Room
              </Link>
            </Button>
          </div>
          <DataTable
            columns={roomColumns}
            data={filteredRooms || []}
            isLoading={roomsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Building2 className="inline h-4 w-4 mr-1" />
            Total: {filteredRooms?.length || 0} rooms
          </div>
        </>
      )}

      {tab === 'allocations' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/hostel/allocations/new">
                <Users className="mr-2 h-4 w-4" />
                Allocate Room
              </Link>
            </Button>
          </div>
          <DataTable
            columns={allocationColumns}
            data={filteredAllocations || []}
            isLoading={allocationsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Users className="inline h-4 w-4 mr-1" />
            Total: {filteredAllocations?.length || 0} allocations
          </div>
        </>
      )}

      {tab === 'mess' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/hostel/menus/new">
                <Utensils className="mr-2 h-4 w-4" />
                Add Menu
              </Link>
            </Button>
          </div>
          <DataTable
            columns={menuColumns}
            data={filteredMenus || []}
            isLoading={menusLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Utensils className="inline h-4 w-4 mr-1" />
            Total: {filteredMenus?.length || 0} menus
          </div>
        </>
      )}

      {tab === 'complaints' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/hostel/complaints/new">
                <MessageSquare className="mr-2 h-4 w-4" />
                Submit Complaint
              </Link>
            </Button>
          </div>
          <DataTable
            columns={complaintColumns}
            data={filteredComplaints || []}
            isLoading={complaintsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <MessageSquare className="inline h-4 w-4 mr-1" />
            Total: {filteredComplaints?.length || 0} complaints
          </div>
        </>
      )}
    </div>
  );
}
