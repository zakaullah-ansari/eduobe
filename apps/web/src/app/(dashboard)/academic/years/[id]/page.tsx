'use client';

import { useParams } from 'next/navigation';
import { useAcademicYear } from '@/services/academic-year.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AcademicYearDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: academicYear, isLoading } = useAcademicYear(id);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!academicYear) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center py-10">
          <p className="text-muted-foreground">Academic year not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/academic/years">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Academic Years
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{academicYear.name}</h1>
          <p className="text-muted-foreground mt-1">Academic year details</p>
        </div>
        <Button asChild>
          <Link href={`/academic/years/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Academic year details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg font-semibold">{academicYear.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Start Date</p>
              <p className="text-lg font-semibold flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {format(new Date(academicYear.startDate), 'MMMM dd, yyyy')}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">End Date</p>
              <p className="text-lg font-semibold flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {format(new Date(academicYear.endDate), 'MMMM dd, yyyy')}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={academicYear.status === 'active' ? 'default' : 'secondary'}>
                {academicYear.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Academic year statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold">{academicYear._count?.students || 0}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
              <p className="text-3xl font-bold">{academicYear._count?.courses || 0}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Faculty</p>
              <p className="text-3xl font-bold">{academicYear._count?.faculty || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
