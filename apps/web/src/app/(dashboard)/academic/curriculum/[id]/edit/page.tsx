'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCurriculum, useUpdateCurriculum } from '@/services/curriculum.service';
import { usePrograms } from '@/services/program.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useEffect } from 'react';

const curriculumSchema = z.object({
  version: z.string().min(1, 'Version is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  programId: z.string().min(1, 'Program is required'),
  effectiveFrom: z.string().min(1, 'Effective from date is required'),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']),
});

type CurriculumFormData = z.infer<typeof curriculumSchema>;

export default function EditCurriculumPage() {
  const params = useParams();
  const router = useRouter();
  const curriculumId = params.id as string;

  const { data: curriculum, isLoading: curriculumLoading } = useCurriculum(curriculumId);
  const { data: programs, isLoading: programsLoading } = usePrograms({ status: 'active' });
  const updateMutation = useUpdateCurriculum();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CurriculumFormData>({
    resolver: zodResolver(curriculumSchema),
  });

  useEffect(() => {
    if (curriculum) {
      reset({
        version: curriculum.version,
        name: curriculum.name,
        programId: curriculum.programId,
        effectiveFrom: curriculum.effectiveFrom,
        description: curriculum.description || '',
        status: curriculum.status,
      });
    }
  }, [curriculum, reset]);

  const onSubmit = (data: CurriculumFormData) => {
    updateMutation.mutate(
      {
        id: curriculumId,
        data: {
          ...data,
          description: data.description || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success('Curriculum updated successfully');
          router.push(`/academic/curriculum/${curriculumId}`);
        },
      }
    );
  };

  if (curriculumLoading || programsLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!curriculum) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Curriculum not found</h2>
          <Button asChild>
            <Link href="/academic/curriculum">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Curricula
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
          <Link href={`/academic/curriculum/${curriculumId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Curriculum
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Curriculum</h1>
        <p className="text-muted-foreground mt-1">Update curriculum information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Curriculum Details</CardTitle>
          <CardDescription>Update the curriculum information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="version">Version *</Label>
                <Input
                  id="version"
                  {...register('version')}
                  placeholder="e.g., R2023"
                />
                {errors.version && (
                  <p className="text-sm text-red-500">{errors.version.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="effectiveFrom">Effective From *</Label>
                <Input
                  id="effectiveFrom"
                  {...register('effectiveFrom')}
                  placeholder="e.g., 2023-24"
                />
                {errors.effectiveFrom && (
                  <p className="text-sm text-red-500">{errors.effectiveFrom.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Curriculum Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., B.Tech CSE Curriculum 2023"
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
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                {...register('status')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="draft">Draft</option>
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
                placeholder="Curriculum description..."
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
                  'Update Curriculum'
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/academic/curriculum/${curriculumId}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
