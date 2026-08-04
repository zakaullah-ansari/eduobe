'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCurriculum, useDeleteCurriculum } from '@/services/curriculum.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Trash2, ArrowLeft, BookOpen, Calendar, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const statusColors = {
  draft: 'secondary',
  active: 'default',
  archived: 'outline',
} as const;

export default function CurriculumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const curriculumId = params.id as string;

  const { data: curriculum, isLoading, error } = useCurriculum(curriculumId);
  const deleteMutation = useDeleteCurriculum();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to archive this curriculum?')) {
      return;
    }

    deleteMutation.mutate(curriculumId, {
      onSuccess: () => {
        toast.success('Curriculum archived successfully');
        router.push('/academic/curriculum');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error || !curriculum) {
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
          <Link href="/academic/curriculum">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Curricula
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{curriculum.name}</h1>
              <Badge variant="outline">{curriculum.version}</Badge>
              <Badge variant={statusColors[curriculum.status] || 'default'}>
                {curriculum.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {curriculum.program?.name} • Effective from {curriculum.effectiveFrom}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/academic/curriculum/${curriculumId}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Archive
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4" />
              Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{curriculum.program?.name || 'N/A'}</p>
            <p className="text-sm text-muted-foreground">{curriculum.program?.code}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Effective From
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{curriculum.effectiveFrom}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4" />
              Semesters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{curriculum._count?.semesters || 0}</p>
          </CardContent>
        </Card>
      </div>

      {curriculum.description && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{curriculum.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
