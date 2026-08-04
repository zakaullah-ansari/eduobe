'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Edit, Trash, BookOpen } from 'lucide-react';
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
import {
  useCourses,
  useDeleteCourse,
  type Course,
} from '@/services/course.service';
import { Badge } from '@/components/ui/badge';

export default function CoursesPage() {
  const { data: courses, isLoading } = useCourses();
  const deleteMutation = useDeleteCourse();

  const columns: ColumnDef<Course>[] = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Code
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue('code')}</Badge>
        ),
      },
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Course Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const course = row.original;
          return (
            <Link
              href={`/academic/courses/${course.id}`}
              className="font-medium hover:underline"
            >
              {course.name}
            </Link>
          );
        },
      },
      {
        accessorKey: 'semester',
        header: 'Semester',
        cell: ({ row }) => {
          const semester = row.original.semester;
          return semester ? `Sem ${semester.number}` : '-';
        },
      },
      {
        accessorKey: 'courseType',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.original.courseType;
          return type ? (
            <Badge variant="secondary">{type.name}</Badge>
          ) : (
            '-'
          );
        },
      },
      {
        accessorKey: 'credits',
        header: 'Credits',
      },
      {
        id: 'hours',
        header: 'Hours (L-T-P)',
        cell: ({ row }) => {
          const course = row.original;
          return `${course.lectureHours}-${course.tutorialHours}-${course.practicalHours}`;
        },
      },
      {
        accessorKey: '_count.courseOfferings',
        header: () => (
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Offerings
          </div>
        ),
        cell: ({ row }) => row.original._count?.courseOfferings || 0,
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
          const course = row.original;

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
                  <Link href={`/academic/courses/${course.id}`}>View Details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/courses/${course.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    if (confirm('Are you sure you want to archive this course?')) {
                      deleteMutation.mutate(course.id);
                    }
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [deleteMutation]
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground mt-2">
            Manage courses with prerequisites and credit structure
          </p>
        </div>
        <Button asChild>
          <Link href="/academic/courses/new">Create Course</Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={courses || []}
        searchKey="name"
        searchPlaceholder="Search courses..."
        isLoading={isLoading}
      />
    </div>
  );
}
