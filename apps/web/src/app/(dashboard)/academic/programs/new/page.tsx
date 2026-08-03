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
import { useCreateProgram } from '@/services/program.service';
import { useDepartments } from '@/services/department.service';
import { Loader2 } from 'lucide-react';

const programSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters').max(20),
  departmentId: z.string().min(1, 'Department is required'),
  degreeType: z.enum(['btech', 'mtech', 'diploma', 'phd'], {
    required_error: 'Degree type is required',
  }),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 year').max(10),
  totalSemesters: z.coerce.number().min(1, 'Must have at least 1 semester').max(20),
  totalCredits: z.coerce.number().optional(),
  description: z.string().optional(),
});

type ProgramFormData = z.infer<typeof programSchema>;

export default function NewProgramPage() {
  const router = useRouter();
  const createMutation = useCreateProgram();
  const { data: departments } = useDepartments({ status: 'active' });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
  });

  const onSubmit = async (data: ProgramFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/academic/programs');
      },
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create Program</CardTitle>
            <CardDescription>
              Add a new academic program
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
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Program'
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
