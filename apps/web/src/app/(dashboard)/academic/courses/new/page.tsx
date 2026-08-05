'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCourse } from '@/services/course.service';
import { Loader2 } from 'lucide-react';

const courseSchema = z.object({
  code: z.string().min(2, 'Code must be at least 2 characters').max(20),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  shortName: z.string().max(10).optional(),
  semesterId: z.string().min(1, 'Semester is required'),
  curriculumId: z.string().min(1, 'Curriculum is required'),
  courseTypeId: z.string().min(1, 'Course type is required'),
  credits: z.coerce.number().min(1, 'Credits must be at least 1').max(10),
  lectureHours: z.coerce.number().min(0).max(10),
  tutorialHours: z.coerce.number().min(0).max(10),
  practicalHours: z.coerce.number().min(0).max(10),
  syllabusUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function NewCoursePage() {
  const router = useRouter();
  const createMutation = useCreateCourse();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      lectureHours: 0,
      tutorialHours: 0,
      practicalHours: 0,
    },
  });

  const onSubmit = async (data: CourseFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/academic/courses');
      },
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create Course</CardTitle>
            <CardDescription>
              Add a new course to the curriculum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Course Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., CSE301"
                    {...register('code')}
                  />
                  {errors.code && (
                    <p className="text-sm text-red-600">{errors.code.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortName">Short Name (Optional)</Label>
                  <Input
                    id="shortName"
                    placeholder="e.g., DSA"
                    {...register('shortName')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Data Structures and Algorithms"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semesterId">Semester ID</Label>
                  <Input
                    id="semesterId"
                    placeholder="Semester ID"
                    {...register('semesterId')}
                  />
                  {errors.semesterId && (
                    <p className="text-sm text-red-600">{errors.semesterId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="curriculumId">Curriculum ID</Label>
                  <Input
                    id="curriculumId"
                    placeholder="Curriculum ID"
                    {...register('curriculumId')}
                  />
                  {errors.curriculumId && (
                    <p className="text-sm text-red-600">{errors.curriculumId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseTypeId">Course Type ID</Label>
                  <Input
                    id="courseTypeId"
                    placeholder="Course Type ID"
                    {...register('courseTypeId')}
                  />
                  {errors.courseTypeId && (
                    <p className="text-sm text-red-600">{errors.courseTypeId.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  placeholder="4"
                  {...register('credits')}
                />
                {errors.credits && (
                  <p className="text-sm text-red-600">{errors.credits.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lectureHours">Lecture Hours</Label>
                  <Input
                    id="lectureHours"
                    type="number"
                    placeholder="3"
                    {...register('lectureHours')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tutorialHours">Tutorial Hours</Label>
                  <Input
                    id="tutorialHours"
                    type="number"
                    placeholder="1"
                    {...register('tutorialHours')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="practicalHours">Practical Hours</Label>
                  <Input
                    id="practicalHours"
                    type="number"
                    placeholder="2"
                    {...register('practicalHours')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="syllabusUrl">Syllabus URL (Optional)</Label>
                <Input
                  id="syllabusUrl"
                  type="url"
                  placeholder="https://example.com/syllabus.pdf"
                  {...register('syllabusUrl')}
                />
                {errors.syllabusUrl && (
                  <p className="text-sm text-red-600">{errors.syllabusUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the course"
                  rows={4}
                  {...register('description')}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Course'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
