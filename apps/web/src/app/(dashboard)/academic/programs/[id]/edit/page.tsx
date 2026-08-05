'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useProgram, useUpdateProgram } from '@/services/program.service';
import { useDepartments } from '@/services/department.service';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const programSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters').max(20),
  departmentId: z.string().min(1, 'Department is required'),
  degreeType: z.enum(['btech', 'mtech', 'diploma', 'phd']),
  duration: z.coerce.number().min(1).max(10),
  totalSemesters: z.coerce.number().min(1).max(20),
  totalCredits: z.coerce.number().optional(),
  description: z.string().optional(),
});

type ProgramFormData = z.infer<typeof programSchema>;

export default function EditProgramPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: program, isLoading } = useProgram(id);
  const updateMutation = useUpdateProgram();
  const { data: departments } = useDepartments({ status: 'active' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
  });

  useEffect(() => {
    if (program) {
      reset({
        name: program.name,
        code: program.code,
        departmentId: program.departmentId,
        degreeType: program.degreeType,
        duration: program.duration,
        totalSemesters: program.totalSemesters,
        totalCredits: program.totalCredits,
        description: program.description || '',
      });
    }
  }, [program, reset]);

  const onSubmit = async (data: ProgramFormData) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          router.push('/academic/programs');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Program Not Found</h1>
          <Button onClick={() => router.push('/academic/programs')} className="mt-4">
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Program</CardTitle>
            <CardDescription>
              Update program information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Program Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., B.Tech Computer Science"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Program Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., BTECH_CSE"
                    {...register('code')}
                  />
                  {errors.code && (
                    <p className="text-sm text-red-600">{errors.code.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentId">Department</Label>
                <select
                  id="departmentId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register('departmentId')}
                >
                  <option value="">Select Department</option>
                  {departments?.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="text-sm text-red-600">{errors.departmentId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="degreeType">Degree Type</Label>
                <select
                  id="degreeType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register('degreeType')}
                >
                  <option value="">Select Degree Type</option>
                  <option value="btech">B.Tech</option>
                  <option value="mtech">M.Tech</option>
                  <option value="diploma">Diploma</option>
                  <option value="phd">Ph.D</option>
                </select>
                {errors.degreeType && (
                  <p className="text-sm text-red-600">{errors.degreeType.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Years)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="4"
                    {...register('duration')}
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-600">{errors.duration.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalSemesters">Total Semesters</Label>
                  <Input
                    id="totalSemesters"
                    type="number"
                    placeholder="8"
                    {...register('totalSemesters')}
                  />
                  {errors.totalSemesters && (
                    <p className="text-sm text-red-600">{errors.totalSemesters.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalCredits">Total Credits</Label>
                  <Input
                    id="totalCredits"
                    type="number"
                    placeholder="160"
                    {...register('totalCredits')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the program"
                  rows={4}
                  {...register('description')}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Program'
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
