'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Calendar, Clock, Users } from 'lucide-react';
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
import { useExams, useDeleteExam } from '@/services/exam.service';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

const statusColors = {
  scheduled: 'default',
  ongoing: 'secondary',
  completed: 'outline',
  cancelled: 'destructive',
} as const;

const typeLabels = {
  midterm: 'Midterm',
  final: 'Final',
  quiz: 'Quiz',
  assignment: 'Assignment',
  lab: 'Lab',
  supplementary: 'Supplementary',
} as const;

export default function ExamsPage() {
  const [filters, setFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { data: exams, isLoading } = useExams(filters);
  const deleteMutation = useDeleteExam();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Exam Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const exam = row.original;
          return (
            <div>
              <Link
                href={`/academic/exams/${exam.id}`}
                className="font-medium hover:underline"
              >
                {exam.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {exam.courseOffering?.course?.name}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.getValue('type') as keyof typeof typeLabels;
          return <Badge variant="outline">{typeLabels[type]}</Badge>;
        },
      },
      {
        accessorKey: 'date',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = row.getValue('date') as string;
          return format(new Date(date), 'MMM dd, yyyy');
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
          const exam = row.original;
          return `${exam.startTime} - ${exam.endTime}`;
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
        accessorKey: 'duration',
        header: 'Duration',
        cell: ({ row }) => `${row.getValue('duration')} min`,
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
          const exam = row.original;
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
                  <Link href={`/academic/exams/${exam.id}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/exams/${exam.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/exams/${exam.id}/allocate-seats`}>
                    <Users className="mr-2 h-4 w-4" />
                    Allocate Seats
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDelete(exam.id)}
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

  const filteredExams = useMemo(() => {
    if (!searchQuery) return exams || [];
    
    const query = searchQuery.toLowerCase();
    return (exams || []).filter(
      (exam) =>
        exam.name.toLowerCase().includes(query) ||
        exam.courseOffering?.course?.name.toLowerCase().includes(query) ||
        exam.courseOffering?.course?.code.toLowerCase().includes(query)
    );
  }, [exams, searchQuery]);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exam Scheduling</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage examinations
          </p>
        </div>
        <Button asChild>
          <Link href="/academic/exams/schedule">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Exam
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search by exam or course name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.type || ''}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    type: e.target.value || undefined,
                  }))
                }
              >
                <option value="">All Types</option>
                <option value="midterm">Midterm</option>
                <option value="final">Final</option>
                <option value="quiz">Quiz</option>
                <option value="assignment">Assignment</option>
                <option value="lab">Lab</option>
                <option value="supplementary">Supplementary</option>
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
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    startDate: e.target.value || undefined,
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={filteredExams}
        isLoading={isLoading}
      />

      <div className="mt-4 text-sm text-muted-foreground text-center">
        <Calendar className="inline h-4 w-4 mr-1" />
        Total: {filteredExams.length} exams
      </div>
    </div>
  );
}
