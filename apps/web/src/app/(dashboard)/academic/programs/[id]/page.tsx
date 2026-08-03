'use client';

import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProgram } from '@/services/program.service';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Users, Calendar, Edit } from 'lucide-react';
import Link from 'next/link';

const degreeTypeLabels = {
  btech: 'B.Tech',
  mtech: 'M.Tech',
  diploma: 'Diploma',
  phd: 'Ph.D',
};

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: program, isLoading } = useProgram(id);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64 w-full" />
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{program.name}</h1>
              <Badge variant="outline">{program.code}</Badge>
              <Badge variant="secondary">
                {degreeTypeLabels[program.degreeType]}
              </Badge>
              <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                {program.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2">
              {program.department?.name}
            </p>
          </div>
          <Button asChild>
            <Link href={`/academic/programs/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Duration</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{program.duration} years</div>
                <p className="text-xs text-muted-foreground">
                  {program.totalSemesters} semesters
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Curricula</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {program._count?.curricula || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Curriculum versions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Batches</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {program._count?.batches || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active batches
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Program Details */}
          <Card>
            <CardHeader>
              <CardTitle>Program Details</CardTitle>
              <CardDescription>
                Academic structure and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-lg font-medium">
                    {program.totalCredits || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Degree Type</p>
                  <p className="text-lg font-medium">
                    {degreeTypeLabels[program.degreeType]}
                  </p>
                </div>
              </div>

              {program.description && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{program.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
              <CardDescription>
                System information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm">
                    {format(new Date(program.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm">
                    {format(new Date(program.updatedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
