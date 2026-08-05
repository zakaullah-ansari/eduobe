'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAcademicYear, useUpdateAcademicYear } from '@/services/academic-year.service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useEffect } from 'react';

const academicYearSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.enum(['active', 'archived']),
});

type AcademicYearFormData = z.infer<typeof academicYearSchema>;

export default function EditAcademicYearPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: academicYear, isLoading } = useAcademicYear(id);
  const updateAcademicYear = useUpdateAcademicYear();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AcademicYearFormData>({
    resolver: zodResolver(academicYearSchema),
  });

  useEffect(() => {
    if (academicYear) {
      reset({
        name: academicYear.name,
        startDate: academicYear.startDate.split('T')[0],
        endDate: academicYear.endDate.split('T')[0],
        status: academicYear.status,
      });
    }
  }, [academicYear, reset]);

  const onSubmit = async (data: AcademicYearFormData) => {
    updateAcademicYear.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast.success('Academic year updated successfully');
          router.push(`/academic/years/${id}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!academicYear) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center py-10">
          <p className="text-muted-foreground">Academic year not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/academic/years/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Academic Year
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Academic Year</h1>
        <p className="text-muted-foreground mt-1">Update academic year details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Year Information</CardTitle>
          <CardDescription>Update the academic year details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register('startDate')} />
                {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" {...register('endDate')} />
                {errors.endDate && <p className="text-sm text-destructive">{errors.endDate.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select {...register('status')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={updateAcademicYear.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {updateAcademicYear.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/academic/years/${id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
