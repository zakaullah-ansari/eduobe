'use client';

import { useParams, useRouter } from 'next/navigation';
import { useBatch, useDeleteBatch } from '@/services/batch.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Trash2, ArrowLeft, Users, Calendar, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const statusColors = {
  active: 'default',
  graduated: 'secondary',
  archived: 'outline',
} as const;

export default function BatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params.id as string;

  const { data: batch, isLoading, error } = useBatch(batchId);
  const deleteMutation = useDeleteBatch();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to archive this batch?')) {
      return;
    }

    deleteMutation.mutate(batchId, {
      onSuccess: () => {
        toast.success('Batch archived successfully');
        router.push('/academic/batches');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error || !batch) {
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
          <Link href="/academic/batches">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Batches
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{batch.name}</h1>
              <Badge variant={statusColors[batch.status] || 'default'}>
                {batch.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {batch.program?.name} • Admission Year {batch.admissionYear}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/academic/batches/${batchId}/edit`}>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Academic Year
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{batch.academicYear?.name || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Current Semester
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Sem {batch.currentSemester}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <LayoutGrid className="h-4 w-4" />
              Sections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{batch._count?.sections || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{batch._count?.students || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
