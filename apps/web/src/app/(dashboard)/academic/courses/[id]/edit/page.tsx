'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCourse, useUpdateCourse } from '@/services/course.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useEffect } from 'react';

const courseSchema = z.object({
  code: z.string().min(2, 'Code must be at least 2 characters').max(20, 'Code must be less than 20 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  shortName: z.string().max(10, 'Short name must be less than 10 characters').optional().or(z.literal('')),
  credits: z.coerce.number().min(1, 'Credits must be at least 1').max(10, 'Credits must be less than 10'),
  lectureHours: z.coerce.number().min(0, 'Lecture hours cannot be negative').max(10, 'Lecture hours must be less than 10'),
  tutorialHours: z.coerce.number().min(0, 'Tutorial hours cannot be negative').max(10, 'Tutorial hours must be less than 10'),
  practicalHours: z.coerce.number().min(0, 'Practical hours cannot be negative').max(10, 'Practical hours must be less than 10'),
  syllabusUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const updateMutation = useUpdateCourse();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  useEffect(() => {
    if (course) {
      reset({
        code: course.code,
        name: course.name,
        shortName: course.shortName || '',
        credits: course.credits,
        lectureHours: course.lectureHours,
        tutorialHours: course.tutorialHours,
        practicalHours: course.practicalHours,
        syllabusUrl: course.syllabusUrl || '',
        description: course.description || '',
      });
    }
  }, [course, reset]);

  const onSubmit = (data: CourseFormData) => {
    updateMutation.mutate(
      {
        id: courseId,
        data: {
          ...data,
          shortName: data.shortName || undefined,
          syllabusUrl: data.syllabusUrl || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success('Course updated successfully');
          router.push(`/academic/courses/${courseId}`);
        },
      }
    );
  };

  if (courseLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!course) {
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
          <Link href={`/academic/courses/${courseId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <p className="text-muted-foreground mt-1">Update course information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Update the course information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code *</Label>
                <Input
                  id="code"
                  {...register('code')}
                  placeholder="e.g., CSE301"
                />
                {errors.code && (
                  <p className="text-sm text-red-500">{errors.code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortName">Short Name</Label>
                <Input
                  id="shortName"
                  {...register('shortName')}
                  placeholder="e.g., DSA"
                />
                {errors.shortName && (
                  <p className="text-sm text-red-500">{errors.shortName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., Data Structures and Algorithms"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits">Credits *</Label>
              <Input
                id="credits"
                type="number"
                {...register('credits')}
                placeholder="e.g., 4"
              />
              {errors.credits && (
                <p className="text-sm text-red-500">{errors.credits.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Contact Hours (L-T-P)</Label>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="lectureHours" className="text-sm">Lecture Hours</Label>
                  <Input
                    id="lectureHours"
                    type="number"
                    {...register('lectureHours')}
                    placeholder="e.g., 3"
                  />
                  {errors.lectureHours && (
                    <p className="text-sm text-red-500">{errors.lectureHours.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tutorialHours" className="text-sm">Tutorial Hours</Label>
                  <Input
                    id="tutorialHours"
                    type="number"
                    {...register('tutorialHours')}
                    placeholder="e.g., 1"
                  />
                  {errors.tutorialHours && (
                    <p className="text-sm text-red-500">{errors.tutorialHours.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="practicalHours" className="text-sm">Practical Hours</Label>
                  <Input
                    id="practicalHours"
                    type="number"
                    {...register('practicalHours')}
                    placeholder="e.g., 2"
                  />
                  {errors.practicalHours && (
                    <p className="text-sm text-red-500">{errors.practicalHours.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="syllabusUrl">Syllabus URL</Label>
              <Input
                id="syllabusUrl"
                type="url"
                {...register('syllabusUrl')}
                placeholder="https://example.com/syllabus.pdf"
              />
              {errors.syllabusUrl && (
                <p className="text-sm text-red-500">{errors.syllabusUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Course description..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={updateMutation.isPending || !isDirty}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Course'
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/academic/courses/${courseId}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
