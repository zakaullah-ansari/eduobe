'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, BookOpen, BookCopy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { useBooks, useBookIssues, useDeleteBook } from '@/services/library.service';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  available: 'default',
  unavailable: 'secondary',
  lost: 'destructive',
  damaged: 'outline',
} as const;

const issueStatusColors = {
  issued: 'default',
  returned: 'secondary',
  overdue: 'destructive',
  lost: 'outline',
} as const;

export default function LibraryPage() {
  const [tab, setTab] = useState<'books' | 'issues'>('books');
  const [filters, setFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { data: books, isLoading: booksLoading } = useBooks(filters);
  const { data: issues, isLoading: issuesLoading } = useBookIssues(filters);
  const deleteMutation = useDeleteBook();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const bookColumns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Title
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const book = row.original;
          return (
            <div>
              <Link
                href={`/academic/library/books/${book.id}`}
                className="font-medium hover:underline"
              >
                {book.title}
              </Link>
              <p className="text-sm text-muted-foreground">by {book.author}</p>
            </div>
          );
        },
      },
      {
        accessorKey: 'isbn',
        header: 'ISBN',
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue('isbn')}</Badge>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
      },
      {
        accessorKey: 'copies',
        header: () => (
          <div className="flex items-center">
            <BookCopy className="mr-2 h-4 w-4" />
            Copies
          </div>
        ),
        cell: ({ row }) => {
          const book = row.original;
          return `${book.availableCopies}/${book.totalCopies}`;
        },
      },
      {
        accessorKey: 'rackNumber',
        header: 'Rack',
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
          const book = row.original;
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
                  <Link href={`/academic/library/books/${book.id}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/library/books/${book.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/library/issue?bookId=${book.id}`}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Issue Book
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDelete(book.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [deleteMutation]
  );

  const issueColumns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'book',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Book
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const issue = row.original;
          return (
            <div>
              <p className="font-medium">{issue.book?.title}</p>
              <p className="text-sm text-muted-foreground">
                {issue.book?.author}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: 'student',
        header: 'Student',
        cell: ({ row }) => {
          const issue = row.original;
          return (
            <div>
              <p className="font-medium">
                {issue.student?.firstName} {issue.student?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {issue.student?.rollNumber}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: 'issueDate',
        header: 'Issue Date',
        cell: ({ row }) => {
          const date = row.getValue('issueDate') as string;
          return format(new Date(date), 'MMM dd, yyyy');
        },
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date',
        cell: ({ row }) => {
          const date = row.getValue('dueDate') as string;
          return format(new Date(date), 'MMM dd, yyyy');
        },
      },
      {
        accessorKey: 'returnDate',
        header: 'Return Date',
        cell: ({ row }) => {
          const date = row.getValue('returnDate') as string;
          return date ? format(new Date(date), 'MMM dd, yyyy') : 'Not returned';
        },
      },
      {
        accessorKey: 'fineAmount',
        header: 'Fine',
        cell: ({ row }) => {
          const amount = row.getValue('fineAmount') as number;
          return amount > 0 ? `₹${amount}` : 'No fine';
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as keyof typeof issueStatusColors;
          return (
            <Badge variant={issueStatusColors[status] || 'default'}>
              {status}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const issue = row.original;
          const canReturn = issue.status === 'issued' || issue.status === 'overdue';
          const canRenew = issue.status === 'issued' && issue.renewedCount < 2;
          
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
                  <Link href={`/academic/library/issues/${issue.id}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                {canReturn && (
                  <DropdownMenuItem asChild>
                    <Link href={`/academic/library/return?issueId=${issue.id}`}>
                      Return Book
                    </Link>
                  </DropdownMenuItem>
                )}
                {canRenew && (
                  <DropdownMenuItem asChild>
                    <Link href={`/academic/library/renew?issueId=${issue.id}`}>
                      Renew
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const filteredBooks = useMemo(() => {
    if (!searchQuery) return books || [];
    
    const query = searchQuery.toLowerCase();
    return (books || []).filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        (book.isbn ?? '').toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)
    );
  }, [books, searchQuery]);

  const filteredIssues = useMemo(() => {
    if (!searchQuery) return issues || [];
    
    const query = searchQuery.toLowerCase();
    return (issues || []).filter(
      (issue) =>
        issue.book?.title.toLowerCase().includes(query) ||
        issue.student?.firstName.toLowerCase().includes(query) ||
        issue.student?.lastName.toLowerCase().includes(query) ||
        issue.student?.rollNumber.toLowerCase().includes(query)
    );
  }, [issues, searchQuery]);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Library Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage books and track issues
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder={tab === 'books' ? 'Search by title, author, or ISBN...' : 'Search by book or student...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {tab === 'books' && (
              <>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={filters.category || ''}
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        category: e.target.value || undefined,
                      }))
                    }
                  >
                    <option value="">All Categories</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fiction">Fiction</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={filters.status || ''}
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        status: e.target.value || undefined,
                      }))
                    }
                  >
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="lost">Lost</option>
                    <option value="damaged">Damaged</option>
                  </select>
                </div>
              </>
            )}

            {tab === 'issues' && (
              <>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={filters.status || ''}
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        status: e.target.value || undefined,
                      }))
                    }
                  >
                    <option value="">All Status</option>
                    <option value="issued">Issued</option>
                    <option value="returned">Returned</option>
                    <option value="overdue">Overdue</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        startDate: e.target.value || undefined,
                      }))
                    }
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {tab === 'books' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/academic/library/books/new">
                <BookOpen className="mr-2 h-4 w-4" />
                Add Book
              </Link>
            </Button>
          </div>
          <DataTable
            columns={bookColumns}
            data={filteredBooks}
            isLoading={booksLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <BookOpen className="inline h-4 w-4 mr-1" />
            Total: {filteredBooks.length} books
          </div>
        </>
      )}

      {tab === 'issues' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/academic/library/issue">
                <BookCopy className="mr-2 h-4 w-4" />
                Issue Book
              </Link>
            </Button>
          </div>
          <DataTable
            columns={issueColumns}
            data={filteredIssues}
            isLoading={issuesLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <BookCopy className="inline h-4 w-4 mr-1" />
            Total: {filteredIssues.length} issues
          </div>
        </>
      )}
    </div>
  );
}
