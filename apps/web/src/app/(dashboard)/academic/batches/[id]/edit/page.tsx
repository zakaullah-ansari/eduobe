'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBatch, useUpdateBatch } from '@/services/batch.service';
import { usePrograms } from '@/services/program.service';
import { useAcademicYears } from '@/services/academic-year.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useEffect } from 'react';

const batchSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  programId: z.string().min(1, 'Program is required'),
  academicYearId: z.string().min(1, 'Academic year is required'),
  admissionYear: z.coerce.number().min(2000, 'Admission year must be 2000 or later').max(2100, 'Admission year must be 2100 or earlier'),
  currentSemester: z.coerce.number().min(1, 'Semester must be at least 1').max(12, 'Semester must be 12 or less'),
});

type BatchFormData = z.infer<typeof batchSchema>;

export default function EditBatchPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params.id as string;

  const { data: batch, isLoading: batchLoading } = useBatch(batchId);
  const { data: programs, isLoading: programsLoading } = usePrograms({ status: 'active' });
  const { data: academicYears, isLoading: yearsLoading } = useAcademicYears({ status: 'active' });
  const updateMutation = useUpdateBatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
  });

  useEffect(() => {
    if (batch) {
      reset({
        name: batch.name,
        programId: batch.programId,
        academicYearId: batch.academicYearId,
        admissionYear: batch.admissionYear,
        currentSemester: batch.currentSemester,
      });
    }
  }, [batch, reset]);

  const onSubmit = (data: BatchFormData) => {
    updateMutation.mutate(
      { id: batchId, data },
      {
        onSuccess: () => {
          toast.success('Batch updated successfully');
          router.push(`/academic/batches/${batchId}`);
        },
      }
    );
  };

  if (batchLoading || programsLoading || yearsLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Batch not found</h2>
          <Button asChild>
            <Link href="/academic/batches">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Batches
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
          <Link href={`/academic/batches/${batchId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Batch
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Batch</h1>
        <p className="text-muted-foreground mt-1">Update batch information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batch Details</CardTitle>
          <CardDescription>Update the batch information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Batch Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., B.Tech CSE 2023"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="programId">Program *</Label>
              <select
                id="programId"
                {...register('programId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a program</option>
                {programs?.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name} ({program.code})
                  </option>
                ))}
              </select>
              {errors.programId && (
                <p className="text-sm text-red-500">{errors.programId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYearId">Academic Year *</Label>
              <select
                id="academicYearId"
                {...register('academicYearId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select an academic year</option>
                {academicYears?.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name} {year.isCurrent && '(Current)'}
                  </option>
                ))}
              </select>
              {errors.academicYearId && (
                <p className="text-sm text-red-500">{errors.academicYearId.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admissionYear">Admission Year *</Label>
                <Input
                  id="admissionYear"
                  type="number"
                  {...register('admissionYear')}
                  placeholder="e.g., 2023"
                />
                {errors.admissionYear && (
                  <p className="text-sm text-red-500">{errors.admissionYear.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentSemester">Current Semester *</Label>
                <Input
                  id="currentSemester"
                  type="number"
                  {...register('currentSemester')}
                  placeholder="e.g., 1"
                />
                {errors.currentSemester && (
                  <p className="text-sm text-red-500">{errors.currentSemester.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={updateMutation.isPending || !isDirty}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Batch'
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/academic/batches/${batchId}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
