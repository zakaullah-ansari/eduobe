'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStudent, useDeleteStudent } from '@/services/student.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Trash2, ArrowLeft, User, Mail, Phone, Calendar, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { format } from 'date-fns';

const statusColors = {
  active: 'default',
  graduated: 'secondary',
  dropped: 'destructive',
  archived: 'outline',
} as const;

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const { data: student, isLoading, error } = useStudent(studentId);
  const deleteMutation = useDeleteStudent();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to archive this student?')) {
      return;
    }

    deleteMutation.mutate(studentId, {
      onSuccess: () => {
        toast.success('Student archived successfully');
        router.push('/academic/students');
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

  if (error || !student) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Student not found</h2>
          <Button asChild>
            <Link href="/academic/students">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Students
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
          <Link href="/academic/students">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">
                {student.firstName} {student.lastName}
              </h1>
              <Badge variant="outline">{student.rollNumber}</Badge>
              <Badge variant={statusColors[student.status] || 'default'}>
                {student.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {student.batch?.name} • {student.batch?.program?.name} • Sem {student.currentSemester}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/academic/students/${studentId}/edit`}>
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
              <Mail className="h-4 w-4" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{student.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4" />
              Phone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{student.phone || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4" />
              CGPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{student.cgpa ? student.cgpa.toFixed(2) : 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Admission Year
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{student.admissionYear}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">
                {student.dateOfBirth ? format(new Date(student.dateOfBirth), 'MMM dd, yyyy') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium capitalize">{student.gender || 'N/A'}</p>
            </div>
            {student.address && (
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{student.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Batch</p>
              <p className="font-medium">{student.batch?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Program</p>
              <p className="font-medium">{student.batch?.program?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Section</p>
              <p className="font-medium">{student.section?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Semester</p>
              <p className="font-medium">Semester {student.currentSemester}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
