'use client';

import { useState } from 'react';
import { useQualityMetrics, useBestPractices, useStakeholderFeedbacks, useDeleteMetric } from '@/services/quality.service';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, TrendingUp, Lightbulb, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  on_track: 'default',
  needs_attention: 'secondary',
  critical: 'destructive',
  achieved: 'outline',
  planned: 'secondary',
  implemented: 'default',
  monitoring: 'outline',
  completed: 'outline',
  draft: 'secondary',
  active: 'default',
  analysed: 'outline',
} as const;

export default function QualityPage() {
  const [tab, setTab] = useState<'metrics' | 'practices' | 'feedback'>('metrics');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: metrics, isLoading: metricsLoading } = useQualityMetrics();
  const { data: practices, isLoading: practicesLoading } = useBestPractices();
  const { data: feedbacks, isLoading: feedbacksLoading } = useStakeholderFeedbacks();
  const deleteMutation = useDeleteMetric();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this metric?')) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const metricColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Metric Name',
      cell: ({ row }) => {
        const metric = row.original;
        return (
          <Link
            href={`/quality/metrics/${metric.id}`}
            className="font-medium hover:underline"
          >
            {metric.name}
          </Link>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('category')}</Badge>,
    },
    {
      accessorKey: 'targetValue',
      header: 'Target',
      cell: ({ row }) => {
        const metric = row.original;
        return metric.targetValue ? `${metric.targetValue} ${metric.unit || ''}` : 'N/A';
      },
    },
    {
      accessorKey: 'currentValue',
      header: 'Current',
      cell: ({ row }) => {
        const metric = row.original;
        return metric.currentValue ? `${metric.currentValue} ${metric.unit || ''}` : 'N/A';
      },
    },
    {
      accessorKey: 'measurementFrequency',
      header: 'Frequency',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('measurementFrequency')}</Badge>,
    },
    {
      accessorKey: 'lastMeasuredDate',
      header: 'Last Measured',
      cell: ({ row }) => {
        const date = row.original.lastMeasuredDate;
        return date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A';
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as keyof typeof statusColors;
        return (
          <Badge variant={statusColors[status] || 'default'}>
            {status.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const metric = row.original;
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
                <Link href={`/quality/metrics/${metric.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/quality/metrics/${metric.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(metric.id)}
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

  const practiceColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Practice Title',
      cell: ({ row }) => {
        const practice = row.original;
        return (
          <Link
            href={`/quality/practices/${practice.id}`}
            className="font-medium hover:underline"
          >
            {practice.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('category')}</Badge>,
    },
    {
      accessorKey: 'implementationDate',
      header: 'Implementation Date',
      cell: ({ row }) => {
        const date = row.original.implementationDate;
        return date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A';
      },
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
        const practice = row.original;
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
                <Link href={`/quality/practices/${practice.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/quality/practices/${practice.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const feedbackColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'surveyTitle',
      header: 'Survey Title',
      cell: ({ row }) => {
        const feedback = row.original;
        return (
          <Link
            href={`/quality/feedbacks/${feedback.id}`}
            className="font-medium hover:underline"
          >
            {feedback.surveyTitle}
          </Link>
        );
      },
    },
    {
      accessorKey: 'stakeholderType',
      header: 'Stakeholder Type',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('stakeholderType')}</Badge>,
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
      accessorKey: 'totalResponses',
      header: 'Responses',
      cell: ({ row }) => row.original.totalResponses || 0,
    },
    {
      accessorKey: 'averageRating',
      header: 'Avg Rating',
      cell: ({ row }) => {
        const rating = row.original.averageRating;
        return rating ? `${rating.toFixed(1)}/5` : 'N/A';
      },
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
                <Link href={`/quality/feedbacks/${feedback.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/quality/feedbacks/${feedback.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredMetrics = metrics?.filter(
    (metric) =>
      metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPractices = practices?.filter(
    (practice) =>
      practice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      practice.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeedbacks = feedbacks?.filter(
    (feedback) =>
      feedback.surveyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.stakeholderType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quality Assurance (IQAC)</h1>
        <p className="text-muted-foreground mt-1">
          Manage quality metrics, best practices, and stakeholder feedback
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="practices">Best Practices</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'metrics' ? 'Search metrics...' : tab === 'practices' ? 'Search practices...' : 'Search feedback...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'metrics' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/quality/metrics/new">
                <TrendingUp className="mr-2 h-4 w-4" />
                Add Metric
              </Link>
            </Button>
          </div>
          <DataTable
            columns={metricColumns}
            data={filteredMetrics || []}
            isLoading={metricsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <TrendingUp className="inline h-4 w-4 mr-1" />
            Total: {filteredMetrics?.length || 0} metrics
          </div>
        </>
      )}

      {tab === 'practices' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/quality/practices/new">
                <Lightbulb className="mr-2 h-4 w-4" />
                Add Practice
              </Link>
            </Button>
          </div>
          <DataTable
            columns={practiceColumns}
            data={filteredPractices || []}
            isLoading={practicesLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Lightbulb className="inline h-4 w-4 mr-1" />
            Total: {filteredPractices?.length || 0} practices
          </div>
        </>
      )}

      {tab === 'feedback' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/quality/feedbacks/new">
                <MessageSquare className="mr-2 h-4 w-4" />
                Create Survey
              </Link>
            </Button>
          </div>
          <DataTable
            columns={feedbackColumns}
            data={filteredFeedbacks || []}
            isLoading={feedbacksLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <MessageSquare className="inline h-4 w-4 mr-1" />
            Total: {filteredFeedbacks?.length || 0} surveys
          </div>
        </>
      )}
    </div>
  );
}
