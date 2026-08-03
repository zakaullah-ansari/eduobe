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
import { Switch } from '@/components/ui/switch';
import { useAcademicYear, useUpdateAcademicYear } from '@/services/academic-year.service';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const academicYearSchema = z.object({
  name: z.string().min(4, 'Name must be at least 4 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isCurrent: z.boolean().default(false),
});

type AcademicYearFormData = z.infer<typeof academicYearSchema>;

export default function EditAcademicYearPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: academicYear, isLoading } = useAcademicYear(id);
  const updateMutation = useUpdateAcademicYear();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AcademicYearFormData>({
    resolver: zodResolver(academicYearSchema),
  });

  const isCurrent = watch('isCurrent');

  useEffect(() => {
    if (academicYear) {
      reset({
        name: academicYear.name,
        startDate: academicYear.startDate.split('T')[0],
        endDate: academicYear.endDate.split('T')[0],
        isCurrent: academicYear.isCurrent,
      });
    }
  }, [academicYear, reset]);

  const onSubmit = async (data: AcademicYearFormData) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          router.push('/academic/years');
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

  if (!academicYear) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Academic Year Not Found</h1>
          <Button onClick={() => router.push('/academic/years')} className="mt-4">
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
            <CardTitle>Edit Academic Year</CardTitle>
            <CardDescription>
              Update academic year information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Academic Year Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., 2024-25"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register('startDate')}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-600">{errors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register('endDate')}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-600">{errors.endDate.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isCurrent"
                  checked={isCurrent}
                  onCheckedChange={(checked) => setValue('isCurrent', checked)}
                />
                <Label htmlFor="isCurrent">Set as current academic year</Label>
              </div>
              {isCurrent && (
                <p className="text-sm text-muted-foreground">
                  Note: Setting this as current will unset any other current academic year.
                </p>
              )}

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
                    'Update Academic Year'
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
