'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateSemester } from '@/services/semester.service';
import { useCurricula } from '@/services/curriculum.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const semesterSchema = z.object({
  number: z.coerce.number().min(1, 'Semester number must be at least 1').max(12, 'Semester number must be 12 or less'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  curriculumId: z.string().min(1, 'Curriculum is required'),
  totalCredits: z.coerce.number().min(0).optional(),
});

type SemesterFormData = z.infer<typeof semesterSchema>;

export default function NewSemesterPage() {
  const router = useRouter();
  const { data: curricula, isLoading: curriculaLoading } = useCurricula({ status: 'active' });
  const createMutation = useCreateSemester();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SemesterFormData>({
    resolver: zodResolver(semesterSchema),
  });

  const onSubmit = (data: SemesterFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Semester created successfully');
        router.push('/academic/semesters');
      },
    });
  };

  if (curriculaLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/academic/semesters">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Semesters
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create Semester</h1>
        <p className="text-muted-foreground mt-1">Add a new semester to a curriculum</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semester Details</CardTitle>
          <CardDescription>Fill in the semester information below</CardDescription>
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

            <div className="flex gap-4">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Semester'
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/academic/semesters">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
