'use client';

import { useState } from 'react';
import { useFeedbackSurveys, useCourseFeedbacks, useFacultyFeedbacks } from '@/services/feedback.service';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, ClipboardList, BookOpen, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  draft: 'secondary',
  active: 'default',
  completed: 'outline',
  cancelled: 'destructive',
  submitted: 'secondary',
  reviewed: 'default',
  acknowledged: 'outline',
} as const;

export default function FeedbackPage() {
  const [tab, setTab] = useState<'surveys' | 'course' | 'faculty'>('surveys');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: surveys, isLoading: surveysLoading } = useFeedbackSurveys();
  const { data: courseFeedbacks, isLoading: courseLoading } = useCourseFeedbacks();
  const { data: facultyFeedbacks, isLoading: facultyLoading } = useFacultyFeedbacks();

  const surveyColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'surveyNumber',
      header: 'Survey No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('surveyNumber')}</Badge>,
    },
    {
      accessorKey: 'title',
      header: 'Survey Title',
      cell: ({ row }) => {
        const survey = row.original;
        return (
          <Link
            href={`/campus/feedback/surveys/${survey.id}`}
            className="font-medium hover:underline"
          >
            {survey.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'surveyType',
      header: 'Type',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('surveyType')}</Badge>,
    },
    {
      accessorKey: 'targetAudience',
      header: 'Target Audience',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('targetAudience')}</Badge>,
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => format(new Date(row.original.startDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => format(new Date(row.original.endDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'responses',
      header: 'Responses',
      cell: ({ row }) => row.original._count?.responses || 0,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as keyof typeof statusColors;
        return (
          <Badge variant={statusColors[status] || 'default'}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const survey = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/campus/feedback/surveys/${survey.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/campus/feedback/surveys/${survey.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this survey?')) {
                    toast.success('Survey deleted successfully');
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const courseFeedbackColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'feedbackNumber',
      header: 'Feedback No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('feedbackNumber')}</Badge>,
    },
    {
      accessorKey: 'student',
      header: 'Student',
      cell: ({ row }) => {
        const student = row.original.student;
        return student ? (
          <div>
            <p className="font-medium">{student.firstName} {student.lastName}</p>
            <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
          </div>
        ) : 'N/A';
      },
    },
    {
      accessorKey: 'courseOffering',
      header: 'Course',
      cell: ({ row }) => {
        const offering = row.original.courseOffering;
        return offering ? (
          <div>
            <p className="font-medium">{offering.course?.name}</p>
            <p className="text-sm text-muted-foreground">{offering.course?.code}</p>
          </div>
        ) : 'N/A';
      },
    },
    {
      accessorKey: 'overallRating',
      header: 'Overall Rating',
      cell: ({ row }) => {
        const rating = row.original.overallRating;
        return rating ? `${rating}/5` : 'N/A';
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Submitted Date',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as keyof typeof statusColors;
        return (
          <Badge variant={statusColors[status] || 'default'}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const feedback = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/campus/feedback/course/${feedback.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const facultyFeedbackColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'feedbackNumber',
      header: 'Feedback No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('feedbackNumber')}</Badge>,
    },
    {
      accessorKey: 'faculty',
      header: 'Faculty',
      cell: ({ row }) => {
        const faculty = row.original.faculty;
        return faculty ? (
          <div>
            <p className="font-medium">{faculty.firstName} {faculty.lastName}</p>
            <p className="text-sm text-muted-foreground">{faculty.email}</p>
          </div>
        ) : 'N/A';
      },
    },
    {
      accessorKey: 'respondentType',
      header: 'Respondent Type',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('respondentType')}</Badge>,
    },
    {
      accessorKey: 'overallRating',
      header: 'Overall Rating',
      cell: ({ row }) => {
        const rating = row.original.overallRating;
        return rating ? `${rating}/5` : 'N/A';
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Submitted Date',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as keyof typeof statusColors;
        return (
          <Badge variant={statusColors[status] || 'default'}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const feedback = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/campus/feedback/faculty/${feedback.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredSurveys = surveys?.filter(
    (survey) =>
      survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.surveyType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourseFeedbacks = courseFeedbacks?.filter(
    (feedback) =>
      feedback.student?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.courseOffering?.course?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFacultyFeedbacks = facultyFeedbacks?.filter(
    (feedback) =>
      feedback.faculty?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.respondentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Feedback Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage feedback surveys, course feedback, and faculty feedback
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="course">Course Feedback</TabsTrigger>
          <TabsTrigger value="faculty">Faculty Feedback</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'surveys' ? 'Search surveys...' : tab === 'course' ? 'Search course feedback...' : 'Search faculty feedback...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'surveys' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/feedback/surveys/new">
                <ClipboardList className="mr-2 h-4 w-4" />
                Create Survey
              </Link>
            </Button>
          </div>
          <DataTable
            columns={surveyColumns}
            data={filteredSurveys || []}
            isLoading={surveysLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <ClipboardList className="inline h-4 w-4 mr-1" />
            Total: {filteredSurveys?.length || 0} surveys
          </div>
        </>
      )}

      {tab === 'course' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/feedback/course/new">
                <BookOpen className="mr-2 h-4 w-4" />
                Submit Course Feedback
              </Link>
            </Button>
          </div>
          <DataTable
            columns={courseFeedbackColumns}
            data={filteredCourseFeedbacks || []}
            isLoading={courseLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <BookOpen className="inline h-4 w-4 mr-1" />
            Total: {filteredCourseFeedbacks?.length || 0} course feedbacks
          </div>
        </>
      )}

      {tab === 'faculty' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/feedback/faculty/new">
                <UserCheck className="mr-2 h-4 w-4" />
                Submit Faculty Feedback
              </Link>
            </Button>
          </div>
          <DataTable
            columns={facultyFeedbackColumns}
            data={filteredFacultyFeedbacks || []}
            isLoading={facultyLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <UserCheck className="inline h-4 w-4 mr-1" />
            Total: {filteredFacultyFeedbacks?.length || 0} faculty feedbacks
          </div>
        </>
      )}
    </div>
  );
}
