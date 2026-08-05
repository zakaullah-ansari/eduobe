'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateBatch } from '@/services/batch.service';
import { usePrograms } from '@/services/program.service';
import { useAcademicYears } from '@/services/academic-year.service';
import { Loader2 } from 'lucide-react';

const batchSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  programId: z.string().min(1, 'Program is required'),
  academicYearId: z.string().min(1, 'Academic year is required'),
  admissionYear: z.coerce.number().min(2000).max(2100),
  currentSemester: z.coerce.number().min(1).max(12),
});

type BatchFormData = z.infer<typeof batchSchema>;

export default function NewBatchPage() {
  const router = useRouter();
  const createMutation = useCreateBatch();
  const { data: programs } = usePrograms({ status: 'active' });
  const { data: academicYears } = useAcademicYears({ status: 'active' });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      currentSemester: 1,
    },
  });

  const onSubmit = async (data: BatchFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/academic/batches');
      },
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create Batch</CardTitle>
            <CardDescription>
              Add a new student batch for an admission year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Batch Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., B.Tech CSE 2023"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="programId">Program</Label>
                <select
                  id="programId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register('programId')}
                >
                  <option value="">Select Program</option>
                  {programs?.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name} ({program.code})
                    </option>
                  ))}
                </select>
                {errors.programId && (
                  <p className="text-sm text-red-600">{errors.programId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="academicYearId">Academic Year</Label>
                <select
                  id="academicYearId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register('academicYearId')}
                >
                  <option value="">Select Academic Year</option>
                  {academicYears?.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.name} {year.isCurrent && '(Current)'}
                    </option>
                  ))}
                </select>
                {errors.academicYearId && (
                  <p className="text-sm text-red-600">{errors.academicYearId.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admissionYear">Admission Year</Label>
                  <Input
                    id="admissionYear"
                    type="number"
                    placeholder="2023"
                    {...register('admissionYear')}
                  />
                  {errors.admissionYear && (
                    <p className="text-sm text-red-600">{errors.admissionYear.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentSemester">Current Semester</Label>
                  <Input
                    id="currentSemester"
                    type="number"
                    placeholder="1"
                    {...register('currentSemester')}
                  />
                  {errors.currentSemester && (
                    <p className="text-sm text-red-600">{errors.currentSemester.message}</p>
                  )}
                </div>
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
                    'Create Batch'
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
