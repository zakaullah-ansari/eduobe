'use client';

import { useState } from 'react';
import { useExamSchedules, useExams, useHallTickets, useExamResults } from '@/services/examination.service';
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
import { MoreHorizontal, Pencil, Trash2, Building2, Bed, Utensils, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  scheduled: 'secondary',
  ongoing: 'default',
  completed: 'outline',
  cancelled: 'destructive',
  pass: 'default',
  fail: 'destructive',
  absent: 'secondary',
  withheld: 'secondary',
  generated: 'secondary',
  downloaded: 'default',
  printed: 'outline',
} as const;

export default function ExaminationsPage() {
  const [tab, setTab] = useState<'schedules' | 'rooms' | 'hall-tickets' | 'results'>('schedules');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: schedules, isLoading: schedulesLoading } = useExamSchedules();
  const { data: rooms, isLoading: roomsLoading } = useExams();
  const { data: hallTickets, isLoading: hallTicketsLoading } = useHallTickets();
  const { data: results, isLoading: resultsLoading } = useExamResults();

  const scheduleColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'scheduleNumber',
      header: 'Schedule No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('scheduleNumber')}</Badge>,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const schedule = row.original;
        return (
          <Link
            href={`/campus/hostel/schedules/${schedule.id}`}
            className="font-medium hover:underline"
          >
            {schedule.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'roomType',
      header: 'Type',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('roomType')}</Badge>,
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
      accessorKey: 'rooms',
      header: () => (
        <div className="flex items-center">
          <Bed className="mr-2 h-4 w-4" />
          Exams
        </div>
      ),
      cell: ({ row }) => row.original._count?.rooms || 0,
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
        const schedule = row.original;
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
                <Link href={`/campus/hostel/schedules/${schedule.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/campus/hostel/schedules/${schedule.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this schedule?')) {
                    toast.success('Schedule deleted successfully');
                  }
                }}
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

  const roomColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'roomNumber',
      header: 'Exam No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('roomNumber')}</Badge>,
    },
    {
      accessorKey: 'courseOffering',
      header: 'Course',
      cell: ({ row }) => {
        const course = row.original.courseOffering?.course;
        return course ? (
          <div>
            <p className="font-medium">{course.name}</p>
            <p className="text-sm text-muted-foreground">{course.code}</p>
          </div>
        ) : 'N/A';
      },
    },
    {
      accessorKey: 'roomDate',
      header: 'Exam Date',
      cell: ({ row }) => format(new Date(row.original.roomDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'startTime',
      header: 'Time',
      cell: ({ row }) => `${row.original.startTime} - ${row.original.endTime}`,
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: ({ row }) => `${row.getValue('duration')} min`,
    },
    {
      accessorKey: 'maxMarks',
      header: 'Max Marks',
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

  const hallTicketColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'hallTicketNumber',
      header: 'Hall Ticket No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('hallTicketNumber')}</Badge>,
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
      accessorKey: 'schedule',
      header: 'Schedule',
      cell: ({ row }) => row.original.schedule?.title || 'N/A',
    },
    {
      accessorKey: 'generatedDate',
      header: 'Generated Date',
      cell: ({ row }) => format(new Date(row.original.generatedDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'seatNumber',
      header: 'Seat No.',
      cell: ({ row }) => row.original.seatNumber || 'N/A',
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
        const hallTicket = row.original;
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
                <Link href={`/campus/hostel/hall-tickets/${hallTicket.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const resultColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'resultNumber',
      header: 'Result No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('resultNumber')}</Badge>,
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
      accessorKey: 'room',
      header: 'Exam',
      cell: ({ row }) => {
        const room = row.original.room;
        return room ? (
          <div>
            <p className="font-medium">{room.roomNumber}</p>
            <p className="text-sm text-muted-foreground">{room.courseOffering?.course?.name}</p>
          </div>
        ) : 'N/A';
      },
    },
    {
      accessorKey: 'marksObtained',
      header: 'Marks',
      cell: ({ row }) => `${row.original.marksObtained}/${row.original.maxMarks}`,
    },
    {
      accessorKey: 'percentage',
      header: 'Percentage',
      cell: ({ row }) => `${row.original.percentage}%`,
    },
    {
      accessorKey: 'grade',
      header: 'Grade',
      cell: ({ row }) => row.original.grade || 'N/A',
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
        const result = row.original;
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
                <Link href={`/campus/hostel/results/${result.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredSchedules = schedules?.filter(
    (schedule: any) =>
      schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.roomType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExams = rooms?.filter(
    (room: any) =>
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.courseOffering?.course?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHallTickets = hallTickets?.filter(
    (hallTicket: any) =>
      hallTicket.hallTicketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hallTicket.student?.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResults = results?.filter(
    (result: any) =>
      result.resultNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.student?.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Hostel Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage room schedules, hall tickets, and results
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="rooms">Exams</TabsTrigger>
          <TabsTrigger value="hall-tickets">Hall Tickets</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'schedules' ? 'Search schedules...' : tab === 'rooms' ? 'Search rooms...' : tab === 'hall-tickets' ? 'Search hall tickets...' : 'Search results...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'schedules' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/hostel/schedules/new">
                <Building2 className="mr-2 h-4 w-4" />
                Create Schedule
              </Link>
            </Button>
          </div>
          <DataTable
            columns={scheduleColumns}
            data={filteredSchedules || []}
            isLoading={schedulesLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Building2 className="inline h-4 w-4 mr-1" />
            Total: {filteredSchedules?.length || 0} schedules
          </div>
        </>
      )}

      {tab === 'rooms' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/hostel/rooms/new">
                <Bed className="mr-2 h-4 w-4" />
                Schedule Exam
              </Link>
            </Button>
          </div>
          <DataTable
            columns={roomColumns}
            data={filteredExams || []}
            isLoading={roomsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Bed className="inline h-4 w-4 mr-1" />
            Total: {filteredExams?.length || 0} rooms
          </div>
        </>
      )}

      {tab === 'hall-tickets' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/hostel/hall-tickets/new">
                <Utensils className="mr-2 h-4 w-4" />
                Generate Hall Ticket
              </Link>
            </Button>
          </div>
          <DataTable
            columns={hallTicketColumns}
            data={filteredHallTickets || []}
            isLoading={hallTicketsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Utensils className="inline h-4 w-4 mr-1" />
            Total: {filteredHallTickets?.length || 0} hall tickets
          </div>
        </>
      )}

      {tab === 'results' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/hostel/results/new">
                <IndianRupee className="mr-2 h-4 w-4" />
                Create Result
              </Link>
            </Button>
          </div>
          <DataTable
            columns={resultColumns}
            data={filteredResults || []}
            isLoading={resultsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <IndianRupee className="inline h-4 w-4 mr-1" />
            Total: {filteredResults?.length || 0} results
          </div>
        </>
      )}
    </div>
  );
}
