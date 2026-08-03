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
import { useDepartment, useUpdateDepartment } from '@/services/department.service';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const departmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters').max(10),
  hodId: z.string().optional(),
  description: z.string().optional(),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

export default function EditDepartmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: department, isLoading } = useDepartment(id);
  const updateMutation = useUpdateDepartment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
  });

  useEffect(() => {
    if (department) {
      reset({
        name: department.name,
        code: department.code,
        hodId: department.hodId || '',
        description: department.description || '',
      });
    }
  }, [department, reset]);

  const onSubmit = async (data: DepartmentFormData) => {
    updateMutation.mutate(
      {
        id,
        data: {
          ...data,
          hodId: data.hodId || undefined,
        },
      },
      {
        onSuccess: () => {
          router.push('/academic/departments');
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

  if (!department) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Department Not Found</h1>
          <Button onClick={() => router.push('/academic/departments')} className="mt-4">
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
            <CardTitle>Edit Department</CardTitle>
            <CardDescription>
              Update department information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Computer Science & Engineering"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Department Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., CSE"
                    {...register('code')}
                  />
                  {errors.code && (
                    <p className="text-sm text-red-600">{errors.code.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hodId">HOD ID (Optional)</Label>
                <Input
                  id="hodId"
                  placeholder="Enter HOD user ID"
                  {...register('hodId')}
                />
                {errors.hodId && (
                  <p className="text-sm text-red-600">{errors.hodId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the department"
                  rows={4}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
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
                    'Update Department'
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
