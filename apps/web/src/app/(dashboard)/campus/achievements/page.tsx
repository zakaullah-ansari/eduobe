'use client';

import { useState } from 'react';
import { useAchievements, useAwards } from '@/services/achievement.service';
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
import { MoreHorizontal, Pencil, Trash2, Trophy, Award, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  reported: 'secondary',
  verified: 'default',
  published: 'outline',
  rejected: 'destructive',
  nominated: 'secondary',
  selected: 'default',
  awarded: 'outline',
  declined: 'destructive',
} as const;

const levelColors = {
  department: 'secondary',
  college: 'default',
  university: 'outline',
  state: 'default',
  national: 'default',
  international: 'outline',
} as const;

export default function AchievementsPage() {
  const [tab, setTab] = useState<'achievements' | 'awards'>('achievements');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: achievements, isLoading: achievementsLoading } = useAchievements();
  const { data: awards, isLoading: awardsLoading } = useAwards();

  const achievementColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'achievementNumber',
      header: 'Achievement No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('achievementNumber')}</Badge>,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const achievement = row.original;
        return (
          <Link
            href={`/campus/achievements/${achievement.id}`}
            className="font-medium hover:underline"
          >
            {achievement.title}
          </Link>
        );
      },
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
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('category')}</Badge>,
    },
    {
      accessorKey: 'level',
      header: 'Level',
      cell: ({ row }) => {
        const level = row.getValue('level') as keyof typeof levelColors;
        return (
          <Badge variant={levelColors[level] || 'default'}>
            {level}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'achievementDate',
      header: 'Achievement Date',
      cell: ({ row }) => format(new Date(row.original.achievementDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'position',
      header: 'Position',
      cell: ({ row }) => row.original.position || 'N/A',
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
        const achievement = row.original;
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
                <Link href={`/campus/achievements/${achievement.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/campus/achievements/${achievement.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  toast.success('Achievement verified successfully');
                }}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Verify
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this achievement?')) {
                    toast.success('Achievement deleted successfully');
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

  const awardColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'awardNumber',
      header: 'Award No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('awardNumber')}</Badge>,
    },
    {
      accessorKey: 'title',
      header: 'Award Title',
      cell: ({ row }) => {
        const award = row.original;
        return (
          <Link
            href={`/campus/achievements/awards/${award.id}`}
            className="font-medium hover:underline"
          >
            {award.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'recipient',
      header: 'Recipient',
      cell: ({ row }) => {
        const recipient = row.original.recipient;
        return recipient ? (
          <div>
            <p className="font-medium">{recipient.firstName} {recipient.lastName}</p>
            <p className="text-sm text-muted-foreground">{recipient.email}</p>
          </div>
        ) : 'N/A';
      },
    },
    {
      accessorKey: 'recipientType',
      header: 'Recipient Type',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('recipientType')}</Badge>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('category').replace('_', ' ')}</Badge>,
    },
    {
      accessorKey: 'awardDate',
      header: 'Award Date',
      cell: ({ row }) => format(new Date(row.original.awardDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'awardingAuthority',
      header: 'Awarding Authority',
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
        const award = row.original;
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
                <Link href={`/campus/achievements/awards/${award.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/campus/achievements/awards/${award.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this award?')) {
                    toast.success('Award deleted successfully');
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

  const filteredAchievements = achievements?.filter(
    (achievement) =>
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.student?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAwards = awards?.filter(
    (award) =>
      award.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      award.recipient?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      award.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Achievements & Awards</h1>
        <p className="text-muted-foreground mt-1">
          Track student achievements and institutional awards
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="awards">Awards</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'achievements' ? 'Search achievements...' : 'Search awards...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'achievements' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/achievements/new">
                <Trophy className="mr-2 h-4 w-4" />
                Report Achievement
              </Link>
            </Button>
          </div>
          <DataTable
            columns={achievementColumns}
            data={filteredAchievements || []}
            isLoading={achievementsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Trophy className="inline h-4 w-4 mr-1" />
            Total: {filteredAchievements?.length || 0} achievements
          </div>
        </>
      )}

      {tab === 'awards' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/achievements/awards/new">
                <Award className="mr-2 h-4 w-4" />
                Create Award
              </Link>
            </Button>
          </div>
          <DataTable
            columns={awardColumns}
            data={filteredAwards || []}
            isLoading={awardsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Award className="inline h-4 w-4 mr-1" />
            Total: {filteredAwards?.length || 0} awards
          </div>
        </>
      )}
    </div>
  );
}
