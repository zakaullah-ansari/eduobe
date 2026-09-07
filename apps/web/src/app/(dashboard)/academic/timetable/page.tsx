'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { useTimetableClasses, useDeleteClass } from '@/services/timetable.service';
import { useCourseOfferings } from '@/services/course-offering.service';
import { useRooms } from '@/services/room.service';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

const statusColors = {
  scheduled: 'default',
  cancelled: 'destructive',
  rescheduled: 'secondary',
} as const;

const dayLabels = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
} as const;

export default function TimetablePage() {
  const [filters, setFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { data: timetables, isLoading } = useTimetableClasses(filters);
  const { data: courseOfferings } = useCourseOfferings({ status: 'active' });
  const { data: rooms } = useRooms({ status: 'available' });
  const deleteMutation = useDeleteClass();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this timetable entry?')) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'course',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Course
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const timetable = row.original;
          return (
            <div>
              <Link
                href={`/academic/timetable/${timetable.id}`}
                className="font-medium hover:underline"
              >
                {timetable.courseOffering?.course?.name || 'N/A'}
              </Link>
              <p className="text-sm text-muted-foreground">
                {timetable.courseOffering?.course?.code}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: 'dayOfWeek',
        header: 'Day',
        cell: ({ row }) => {
          const day = row.getValue('dayOfWeek') as keyof typeof dayLabels;
          return <Badge variant="outline">{dayLabels[day]}</Badge>;
        },
      },
      {
        accessorKey: 'time',
        header: () => (
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Time
          </div>
        ),
        cell: ({ row }) => {
          const timetable = row.original;
          return `${timetable.startTime} - ${timetable.endTime}`;
        },
      },
      {
        accessorKey: 'room',
        header: 'Room',
        cell: ({ row }) => {
          const room = row.original.room;
          return room ? `${room.name} (${room.building})` : 'N/A';
        },
      },
      {
        accessorKey: 'faculty',
        header: 'Faculty',
        cell: ({ row }) => {
          const faculty = row.original.faculty;
          return faculty ? `${faculty.firstName} ${faculty.lastName}` : 'N/A';
        },
      },
      {
        accessorKey: 'batch',
        header: 'Batch',
        cell: ({ row }) => row.original.batch?.name || 'N/A',
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
          const timetable = row.original;
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
                  <Link href={`/academic/timetable/${timetable.id}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/timetable/${timetable.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDelete(timetable.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [deleteMutation]
  );

  const filteredTimetables = useMemo(() => {
    if (!searchQuery) return timetables || [];
    
    const query = searchQuery.toLowerCase();
    return (timetables || []).filter(
      (timetable) =>
        timetable.courseOffering?.course?.name.toLowerCase().includes(query) ||
        timetable.courseOffering?.course?.code.toLowerCase().includes(query) ||
        timetable.faculty?.firstName.toLowerCase().includes(query) ||
        timetable.faculty?.lastName.toLowerCase().includes(query) ||
        timetable.room?.name.toLowerCase().includes(query)
    );
  }, [timetables, searchQuery]);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-muted-foreground mt-1">
            Manage class schedules and timetables
          </p>
        </div>
        <Button asChild>
          <Link href="/academic/timetable/new">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Class
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search by course, faculty, or room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Day</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.dayOfWeek || ''}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    dayOfWeek: e.target.value || undefined,
                  }))
                }
              >
                <option value="">All Days</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Course Offering</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.courseOfferingId || ''}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    courseOfferingId: e.target.value || undefined,
                  }))
                }
              >
                <option value="">All Courses</option>
                {courseOfferings?.map((offering) => (
                  <option key={offering.id} value={offering.id}>
                    {offering.course?.name} ({offering.batch?.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.status || ''}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    status: e.target.value || undefined,
                  }))
                }
              >
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={filteredTimetables}
        isLoading={isLoading}
      />

      <div className="mt-4 text-sm text-muted-foreground text-center">
        <Calendar className="inline h-4 w-4 mr-1" />
        Total: {filteredTimetables.length} timetable entries
      </div>
    </div>
  );
}
