'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSemester, useDeleteSemester } from '@/services/semester.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Trash2, ArrowLeft, BookOpen, Hash, Award } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SemesterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const semesterId = params.id as string;

  const { data: semester, isLoading, error } = useSemester(semesterId);
  const deleteMutation = useDeleteSemester();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to archive this semester?')) {
      return;
    }

    deleteMutation.mutate(semesterId, {
      onSuccess: () => {
        toast.success('Semester archived successfully');
        router.push('/academic/semesters');
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

  if (error || !semester) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Semester not found</h2>
          <Button asChild>
            <Link href="/academic/semesters">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Semesters
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
          <Link href="/academic/semesters">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Semesters
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{semester.name}</h1>
              <Badge variant="outline">Sem {semester.number}</Badge>
              <Badge variant={semester.status === 'active' ? 'default' : 'secondary'}>
                {semester.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {semester.curriculum?.name} ({semester.curriculum?.version})
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/academic/semesters/${semesterId}/edit`}>
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
              <Hash className="h-4 w-4" />
              Semester Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{semester.number}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4" />
              Total Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{semester.totalCredits || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4" />
              Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{semester._count?.courses || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
