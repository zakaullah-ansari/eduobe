'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCourseType, useDeleteCourseType } from '@/services/course-type.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Trash2, ArrowLeft, BookOpen, Settings, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CourseTypeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseTypeId = params.id as string;

  const { data: courseType, isLoading, error } = useCourseType(courseTypeId);
  const deleteMutation = useDeleteCourseType();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to archive this course type?')) {
      return;
    }

    deleteMutation.mutate(courseTypeId, {
      onSuccess: () => {
        toast.success('Course type archived successfully');
        router.push('/academic/course-types');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error || !courseType) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course type not found</h2>
          <Button asChild>
            <Link href="/academic/course-types">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course Types
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/academic/course-types">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course Types
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{courseType.name}</h1>
              <Badge variant="outline">{courseType.code}</Badge>
              <Badge variant={courseType.status === 'active' ? 'default' : 'secondary'}>
                {courseType.status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/academic/course-types/${courseTypeId}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Archive
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Attendance Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-base">
              {courseType.attendanceMode}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Plan Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-base">
              {courseType.planType}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4" />
              Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{courseType._count?.courses || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Components
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={courseType.hasPractical ? 'default' : 'secondary'}>
                {courseType.hasPractical ? 'Yes' : 'No'}
              </Badge>
              <span>Practical Component</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={courseType.hasProject ? 'default' : 'secondary'}>
                {courseType.hasProject ? 'Yes' : 'No'}
              </Badge>
              <span>Project Component</span>
            </div>
          </CardContent>
        </Card>

        {courseType.description && (
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{courseType.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
