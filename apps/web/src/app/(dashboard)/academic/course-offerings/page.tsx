'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Users, BookOpen } from 'lucide-react';
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
import { useCourseOfferings, useDeleteCourseOffering } from '@/services/course-offering.service';
import { useCourses } from '@/services/course.service';
import { useFaculty } from '@/services/faculty.service';
import { useBatches } from '@/services/batch.service';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

const statusColors = {
  planned: 'secondary',
  ongoing: 'default',
  completed: 'outline',
  cancelled: 'destructive',
} as const;

export default function CourseOfferingsPage() {
  const [filters, setFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { data: offerings, isLoading } = useCourseOfferings(filters);
  const { data: courses } = useCourses({ status: 'active' });
  const { data: faculty } = useFaculty({ status: 'active' });
  const { data: batches } = useBatches({ status: 'active' });
  const deleteMutation = useDeleteCourseOffering();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this course offering?')) {
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
          const offering = row.original;
          return (
            <div>
              <Link
                href={`/academic/course-offerings/${offering.id}`}
                className="font-medium hover:underline"
              >
                {offering.course?.name || 'N/A'}
              </Link>
              <p className="text-sm text-muted-foreground">{offering.course?.code}</p>
            </div>
          );
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
        accessorKey: 'semester',
        header: 'Semester',
      },
      {
        accessorKey: 'academicYear',
        header: 'Academic Year',
      },
      {
        accessorKey: 'enrollments',
        header: () => (
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Enrolled
          </div>
        ),
        cell: ({ row }) => {
          const offering = row.original;
          const enrolled = offering._count?.enrollments || 0;
          const max = offering.maxStudents || '∞';
          return `${enrolled}/${max}`;
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
          const offering = row.original;
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
                  <Link href={`/academic/course-offerings/${offering.id}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/course-offerings/${offering.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/enrollments?courseOfferingId=${offering.id}`}>
                    <Users className="mr-2 h-4 w-4" />
                    Manage Enrollments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDelete(offering.id)}
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

  const filteredOfferings = useMemo(() => {
    if (!searchQuery) return offerings || [];
    
    const query = searchQuery.toLowerCase();
    return (offerings || []).filter(
      (offering) =>
        offering.course?.name.toLowerCase().includes(query) ||
        offering.course?.code.toLowerCase().includes(query) ||
        offering.faculty?.firstName.toLowerCase().includes(query) ||
        offering.faculty?.lastName.toLowerCase().includes(query)
    );
  }, [offerings, searchQuery]);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Offerings</h1>
          <p className="text-muted-foreground mt-1">
            Manage course offerings and assignments
          </p>
        </div>
        <Button asChild>
          <Link href="/academic/course-offerings/new">Create Offering</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search by course or faculty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Course</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.courseId || ''}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    courseId: e.target.value || undefined,
                  }))
                }
              >
                <option value="">All Courses</option>
                {courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
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
                <option value="planned">Planned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Academic Year</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.academicYear || ''}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    academicYear: e.target.value || undefined,
                  }))
                }
              >
                <option value="">All Years</option>
                <option value="2024-25">2024-25</option>
                <option value="2023-24">2023-24</option>
                <option value="2022-23">2022-23</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={filteredOfferings}
        isLoading={isLoading}
      />

      <div className="mt-4 text-sm text-muted-foreground text-center">
        <BookOpen className="inline h-4 w-4 mr-1" />
        Total: {filteredOfferings.length} course offerings
      </div>
    </div>
  );
}
