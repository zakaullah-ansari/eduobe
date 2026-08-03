'use client';

import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAcademicYear } from '@/services/academic-year.service';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Star, Edit } from 'lucide-react';
import Link from 'next/link';

export default function AcademicYearDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: academicYear, isLoading } = useAcademicYear(id);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!academicYear) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Academic Year Not Found</h1>
          <Button onClick={() => router.push('/academic/years')} className="mt-4">
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{academicYear.name}</h1>
              {academicYear.isCurrent && (
                <Badge variant="default" className="text-sm">
                  <Star className="mr-1 h-3 w-3" />
                  Current
                </Badge>
              )}
              <Badge variant={academicYear.status === 'active' ? 'default' : 'secondary'}>
                {academicYear.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2">
              Academic year details and information
            </p>
          </div>
          <Button asChild>
            <Link href={`/academic/years/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Academic year duration and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="text-lg font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(academicYear.startDate), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="text-lg font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(academicYear.endDate), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-lg font-medium">
                  {Math.ceil(
                    (new Date(academicYear.endDate).getTime() -
                      new Date(academicYear.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  days
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
              <CardDescription>
                System information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm">
                    {format(new Date(academicYear.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm">
                    {format(new Date(academicYear.updatedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
