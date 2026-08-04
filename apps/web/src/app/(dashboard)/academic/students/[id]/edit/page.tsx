'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStudent, useUpdateStudent } from '@/services/student.service';
import { useBatches } from '@/services/batch.service';
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

const studentSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().optional(),
  batchId: z.string().min(1, 'Batch is required'),
  sectionId: z.string().optional(),
  admissionYear: z.coerce.number().min(2000).max(2100),
  currentSemester: z.coerce.number().min(1).max(12),
  status: z.enum(['active', 'graduated', 'dropped', 'archived']),
  cgpa: z.coerce.number().min(0).max(10).optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const { data: student, isLoading: studentLoading } = useStudent(studentId);
  const { data: batches, isLoading: batchesLoading } = useBatches({ status: 'active' });
  const updateMutation = useUpdateStudent();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  useEffect(() => {
    if (student) {
      reset({
        rollNumber: student.rollNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone || '',
        dateOfBirth: student.dateOfBirth || '',
        gender: student.gender,
        address: student.address || '',
        batchId: student.batchId,
        sectionId: student.sectionId || '',
        admissionYear: student.admissionYear,
        currentSemester: student.currentSemester,
        status: student.status,
        cgpa: student.cgpa,
      });
    }
  }, [student, reset]);

  const onSubmit = (data: StudentFormData) => {
    updateMutation.mutate(
      { id: studentId, data },
      {
        onSuccess: () => {
          router.push(`/academic/students/${studentId}`);
        },
      }
    );
  };

  if (studentLoading || batchesLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!student) {
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
          <Link href={`/academic/students/${studentId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Student
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Student</h1>
        <p className="text-muted-foreground mt-1">Update student information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
          <CardDescription>Update the student information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number *</Label>
                <Input
                  id="rollNumber"
                  {...register('rollNumber')}
                />
                {errors.rollNumber && (
                  <p className="text-sm text-red-500">{errors.rollNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  {...register('gender')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                {...register('address')}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="batchId">Batch *</Label>
                <select
                  id="batchId"
                  {...register('batchId')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a batch</option>
                  {batches?.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name} ({batch.program?.name})
                    </option>
                  ))}
                </select>
                {errors.batchId && (
                  <p className="text-sm text-red-500">{errors.batchId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sectionId">Section</Label>
                <Input
                  id="sectionId"
                  {...register('sectionId')}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="admissionYear">Admission Year *</Label>
                <Input
                  id="admissionYear"
                  type="number"
                  {...register('admissionYear')}
                />
                {errors.admissionYear && (
                  <p className="text-sm text-red-500">{errors.admissionYear.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentSemester">Current Semester *</Label>
                <Input
                  id="currentSemester"
                  type="number"
                  {...register('currentSemester')}
                />
                {errors.currentSemester && (
                  <p className="text-sm text-red-500">{errors.currentSemester.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cgpa">CGPA</Label>
                <Input
                  id="cgpa"
                  type="number"
                  step="0.01"
                  {...register('cgpa')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                {...register('status')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="active">Active</option>
                <option value="graduated">Graduated</option>
                <option value="dropped">Dropped</option>
                <option value="archived">Archived</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
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
                  'Update Student'
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/academic/students/${studentId}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
