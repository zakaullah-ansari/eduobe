'use client';

import { useState } from 'react';
import { useTimetableClasses, useRooms, useTimetableConflicts } from '@/services/timetable.service';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Calendar, Building2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const statusColors = {
  scheduled: 'default',
  cancelled: 'destructive',
  rescheduled: 'secondary',
  available: 'default',
  occupied: 'secondary',
  maintenance: 'destructive',
  reserved: 'outline',
  detected: 'destructive',
  resolved: 'default',
  ignored: 'secondary',
} as const;

export default function TimetablePage() {
  const [tab, setTab] = useState<'classes' | 'rooms' | 'conflicts'>('classes');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: classes, isLoading: classesLoading } = useTimetableClasses();
  const { data: rooms, isLoading: roomsLoading } = useRooms();
  const { data: conflicts, isLoading: conflictsLoading } = useTimetableConflicts();

  const classColumns: ColumnDef<any>[] = [
    { accessorKey: 'classNumber', header: 'Class No.', cell: ({ row }) => <Badge variant="outline">{row.getValue('classNumber')}</Badge> },
    { accessorKey: 'courseOffering', header: 'Course', cell: ({ row }) => row.original.courseOffering?.course?.name || 'N/A' },
    { accessorKey: 'faculty', header: 'Faculty', cell: ({ row }) => row.original.faculty ? `${row.original.faculty.firstName} ${row.original.faculty.lastName}` : 'N/A' },
    { accessorKey: 'room', header: 'Room', cell: ({ row }) => row.original.room?.name || 'N/A' },
    { accessorKey: 'dayOfWeek', header: 'Day', cell: ({ row }) => <Badge variant="secondary">{row.getValue('dayOfWeek')}</Badge> },
    { accessorKey: 'startTime', header: 'Time', cell: ({ row }) => `${row.original.startTime} - ${row.original.endTime}` },
    { accessorKey: 'classType', header: 'Type', cell: ({ row }) => <Badge variant="outline">{row.getValue('classType')}</Badge> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={statusColors[row.getValue('status') as keyof typeof statusColors] || 'default'}>{row.getValue('status')}</Badge> },
    { id: 'actions', cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild><Link href={`/campus/timetable/classes/${row.original.id}`}>View Details</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href={`/campus/timetable/classes/${row.original.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
          <DropdownMenuItem className="text-red-600" onClick={() => { if (confirm('Delete?')) toast.success('Deleted'); }}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  const roomColumns: ColumnDef<any>[] = [
    { accessorKey: 'roomNumber', header: 'Room No.', cell: ({ row }) => <Badge variant="outline">{row.getValue('roomNumber')}</Badge> },
    { accessorKey: 'name', header: 'Name', cell: ({ row }) => <Link href={`/campus/timetable/rooms/${row.original.id}`} className="font-medium hover:underline">{row.getValue('name')}</Link> },
    { accessorKey: 'building', header: 'Building', cell: ({ row }) => row.original.building || 'N/A' },
    { accessorKey: 'floor', header: 'Floor' },
    { accessorKey: 'capacity', header: 'Capacity' },
    { accessorKey: 'roomType', header: 'Type', cell: ({ row }) => <Badge variant="secondary">{row.getValue('roomType')}</Badge> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={statusColors[row.getValue('status') as keyof typeof statusColors] || 'default'}>{row.getValue('status')}</Badge> },
    { id: 'actions', cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild><Link href={`/campus/timetable/rooms/${row.original.id}`}>View Details</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href={`/campus/timetable/rooms/${row.original.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  const conflictColumns: ColumnDef<any>[] = [
    { accessorKey: 'conflictNumber', header: 'Conflict No.', cell: ({ row }) => <Badge variant="outline">{row.getValue('conflictNumber')}</Badge> },
    { accessorKey: 'conflictType', header: 'Type', cell: ({ row }) => <Badge variant="secondary">{row.getValue('conflictType')}</Badge> },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'detectedDate', header: 'Detected Date' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={statusColors[row.getValue('status') as keyof typeof statusColors] || 'default'}>{row.getValue('status')}</Badge> },
    { id: 'actions', cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild><Link href={`/campus/timetable/conflicts/${row.original.id}`}>View Details</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  const filteredClasses = classes?.filter(c => c.courseOffering?.course?.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredRooms = rooms?.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredConflicts = conflicts?.filter(c => c.description.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Timetable Management</h1>
        <p className="text-muted-foreground mt-1">Manage class schedules, rooms, and conflicts</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </CardContent>
      </Card>

      {tab === 'classes' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild><Link href="/campus/timetable/classes/new"><Calendar className="mr-2 h-4 w-4" />Schedule Class</Link></Button>
          </div>
          <DataTable columns={classColumns} data={filteredClasses || []} isLoading={classesLoading} />
          <div className="mt-4 text-sm text-muted-foreground text-center">Total: {filteredClasses?.length || 0} classes</div>
        </>
      )}

      {tab === 'rooms' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild><Link href="/campus/timetable/rooms/new"><Building2 className="mr-2 h-4 w-4" />Add Room</Link></Button>
          </div>
          <DataTable columns={roomColumns} data={filteredRooms || []} isLoading={roomsLoading} />
          <div className="mt-4 text-sm text-muted-foreground text-center">Total: {filteredRooms?.length || 0} rooms</div>
        </>
      )}

      {tab === 'conflicts' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button onClick={() => toast.success('Conflicts detected')}><AlertTriangle className="mr-2 h-4 w-4" />Detect Conflicts</Button>
          </div>
          <DataTable columns={conflictColumns} data={filteredConflicts || []} isLoading={conflictsLoading} />
          <div className="mt-4 text-sm text-muted-foreground text-center">Total: {filteredConflicts?.length || 0} conflicts</div>
        </>
      )}
    </div>
  );
}
