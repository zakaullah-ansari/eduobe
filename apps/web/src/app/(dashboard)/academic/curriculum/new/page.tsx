'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateCurriculum } from '@/services/curriculum.service';
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

const curriculumSchema = z.object({
  version: z.string().min(1, 'Version is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  programId: z.string().min(1, 'Program is required'),
  effectiveFrom: z.string().min(1, 'Effective from date is required'),
  description: z.string().optional(),
});

type CurriculumFormData = z.infer<typeof curriculumSchema>;

export default function NewCurriculumPage() {
  const router = useRouter();
  const { data: programs, isLoading: programsLoading } = usePrograms({ status: 'active' });
  const createMutation = useCreateCurriculum();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CurriculumFormData>({
    resolver: zodResolver(curriculumSchema),
  });

  const onSubmit = (data: CurriculumFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Curriculum created successfully');
        router.push('/academic/curriculum');
      },
    });
  };

  if (programsLoading) {
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
          <Link href="/academic/curriculum">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Curricula
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create Curriculum</h1>
        <p className="text-muted-foreground mt-1">Add a new curriculum version</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Curriculum Details</CardTitle>
          <CardDescription>Fill in the curriculum information below</CardDescription>
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
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Curriculum'
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/academic/curriculum">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
