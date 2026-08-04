'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCourseType, useUpdateCourseType } from '@/services/course-type.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useEffect } from 'react';

const courseTypeSchema = z.object({
  code: z.string().min(2, 'Code must be at least 2 characters').max(10, 'Code must be less than 10 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  attendanceMode: z.enum(['daily', 'batch_wise', 'experiment_wise']),
  planType: z.enum(['teaching', 'practical', 'project', 'none']),
  hasPractical: z.boolean(),
  hasProject: z.boolean(),
  description: z.string().optional(),
  status: z.enum(['active', 'archived']),
});

type CourseTypeFormData = z.infer<typeof courseTypeSchema>;

export default function EditCourseTypePage() {
  const params = useParams();
  const router = useRouter();
  const courseTypeId = params.id as string;

  const { data: courseType, isLoading: courseTypeLoading } = useCourseType(courseTypeId);
  const updateMutation = useUpdateCourseType();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<CourseTypeFormData>({
    resolver: zodResolver(courseTypeSchema),
  });

  const hasPractical = watch('hasPractical');
  const hasProject = watch('hasProject');

  useEffect(() => {
    if (courseType) {
      reset({
        code: courseType.code,
        name: courseType.name,
        attendanceMode: courseType.attendanceMode,
        planType: courseType.planType,
        hasPractical: courseType.hasPractical,
        hasProject: courseType.hasProject,
        description: courseType.description || '',
        status: courseType.status,
      });
    }
  }, [courseType, reset]);

  const onSubmit = (data: CourseTypeFormData) => {
    updateMutation.mutate(
      { id: courseTypeId, data },
      {
        onSuccess: () => {
          toast.success('Course type updated successfully');
          router.push(`/academic/course-types/${courseTypeId}`);
        },
      }
    );
  };

  if (courseTypeLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!courseType) {
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
          <Link href={`/academic/course-types/${courseTypeId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course Type
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Course Type</h1>
        <p className="text-muted-foreground mt-1">Update course type configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Type Details</CardTitle>
          <CardDescription>Update the course type information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  {...register('code')}
                  placeholder="e.g., THEORY"
                />
                {errors.code && (
                  <p className="text-sm text-red-500">{errors.code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., Theory"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="attendanceMode">Attendance Mode *</Label>
                <select
                  id="attendanceMode"
                  {...register('attendanceMode')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="daily">Daily</option>
                  <option value="batch_wise">Batch Wise</option>
                  <option value="experiment_wise">Experiment Wise</option>
                </select>
                {errors.attendanceMode && (
                  <p className="text-sm text-red-500">{errors.attendanceMode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="planType">Plan Type *</Label>
                <select
                  id="planType"
                  {...register('planType')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="teaching">Teaching</option>
                  <option value="practical">Practical</option>
                  <option value="project">Project</option>
                  <option value="none">None</option>
                </select>
                {errors.planType && (
                  <p className="text-sm text-red-500">{errors.planType.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="hasPractical"
                  checked={hasPractical}
                  onCheckedChange={(checked) => setValue('hasPractical', checked)}
                />
                <Label htmlFor="hasPractical">Has Practical Component</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="hasProject"
                  checked={hasProject}
                  onCheckedChange={(checked) => setValue('hasProject', checked)}
                />
                <Label htmlFor="hasProject">Has Project Component</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                {...register('status')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Course type description..."
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
                  'Update Course Type'
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/academic/course-types/${courseTypeId}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
