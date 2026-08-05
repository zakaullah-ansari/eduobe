'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCourse, useDeleteCourse } from '@/services/course.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Trash2, ArrowLeft, BookOpen, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { data: course, isLoading, error } = useCourse(courseId);
  const deleteMutation = useDeleteCourse();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to archive this course?')) {
      return;
    }

    deleteMutation.mutate(courseId, {
      onSuccess: () => {
        toast.success('Course archived successfully');
        router.push('/academic/courses');
      },
    });
  };

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

  if (error || !course) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Button asChild>
            <Link href="/academic/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
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
          <Link href="/academic/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{course.name}</h1>
              <Badge variant="outline">{course.code}</Badge>
              <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                {course.status}
              </Badge>
            </div>
            {course.shortName && (
              <p className="text-muted-foreground mt-1">{course.shortName}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/academic/courses/${courseId}/edit`}>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Credits</p>
              <p className="text-2xl font-bold">{course.credits}</p>
            </div>
            {course.syllabusUrl && (
              <div>
                <p className="text-sm text-muted-foreground">Syllabus</p>
                <a
                  href={course.syllabusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Syllabus
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Contact Hours (L-T-P)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold">{course.lectureHours}</p>
                <p className="text-sm text-muted-foreground">Lecture</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{course.tutorialHours}</p>
                <p className="text-sm text-muted-foreground">Tutorial</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{course.practicalHours}</p>
                <p className="text-sm text-muted-foreground">Practical</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Total Hours/Week</p>
              <p className="text-2xl font-bold">
                {course.lectureHours + course.tutorialHours + course.practicalHours}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Offerings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-muted-foreground">Total Offerings</p>
              <p className="text-3xl font-bold">{course._count?.courseOfferings || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {course.description && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{course.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
