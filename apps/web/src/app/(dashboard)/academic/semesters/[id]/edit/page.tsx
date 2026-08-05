'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSemester, useUpdateSemester } from '@/services/semester.service';
import { useCurricula } from '@/services/curriculum.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useEffect } from 'react';

const semesterSchema = z.object({
  number: z.coerce.number().min(1, 'Semester number must be at least 1').max(12, 'Semester number must be 12 or less'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  curriculumId: z.string().min(1, 'Curriculum is required'),
  totalCredits: z.coerce.number().min(0).optional(),
  status: z.enum(['active', 'archived']),
});

type SemesterFormData = z.infer<typeof semesterSchema>;

export default function EditSemesterPage() {
  const params = useParams();
  const router = useRouter();
  const semesterId = params.id as string;

  const { data: semester, isLoading: semesterLoading } = useSemester(semesterId);
  const { data: curricula, isLoading: curriculaLoading } = useCurricula({ status: 'active' });
  const updateMutation = useUpdateSemester();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SemesterFormData>({
    resolver: zodResolver(semesterSchema),
  });

  useEffect(() => {
    if (semester) {
      reset({
        number: semester.number,
        name: semester.name,
        curriculumId: semester.curriculumId,
        totalCredits: semester.totalCredits || undefined,
        status: semester.status,
      });
    }
  }, [semester, reset]);

  const onSubmit = (data: SemesterFormData) => {
    updateMutation.mutate(
      { id: semesterId, data },
      {
        onSuccess: () => {
          toast.success('Semester updated successfully');
          router.push(`/academic/semesters/${semesterId}`);
        },
      }
    );
  };

  if (semesterLoading || curriculaLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!semester) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Semester not found</h2>
          <Button asChild>
            <Link href="/academic/semesters">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Semesters
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
          <Link href={`/academic/semesters/${semesterId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Semester
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Semester</h1>
        <p className="text-muted-foreground mt-1">Update semester information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semester Details</CardTitle>
          <CardDescription>Update the semester information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="number">Semester Number *</Label>
                <Input
                  id="number"
                  type="number"
                  {...register('number')}
                  placeholder="e.g., 1"
                />
                {errors.number && (
                  <p className="text-sm text-red-500">{errors.number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalCredits">Total Credits</Label>
                <Input
                  id="totalCredits"
                  type="number"
                  {...register('totalCredits')}
                  placeholder="e.g., 20"
                />
                {errors.totalCredits && (
                  <p className="text-sm text-red-500">{errors.totalCredits.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Semester Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., First Semester"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="curriculumId">Curriculum *</Label>
              <select
                id="curriculumId"
                {...register('curriculumId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a curriculum</option>
                {curricula?.map((curriculum) => (
                  <option key={curriculum.id} value={curriculum.id}>
                    {curriculum.name} ({curriculum.version})
                  </option>
                ))}
              </select>
              {errors.curriculumId && (
                <p className="text-sm text-red-500">{errors.curriculumId.message}</p>
              )}
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

            <div className="flex gap-4">
              <Button type="submit" disabled={updateMutation.isPending || !isDirty}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Semester'
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/academic/semesters/${semesterId}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
