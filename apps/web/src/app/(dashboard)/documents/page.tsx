'use client';

import { useState } from 'react';
import { useDocuments, useDeleteDocument } from '@/services/document.service';
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
import { MoreHorizontal, Pencil, Trash2, FileText, Download, History } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  draft: 'secondary',
  published: 'default',
  archived: 'outline',
  obsolete: 'destructive',
} as const;

const accessLevelColors = {
  public: 'default',
  internal: 'secondary',
  restricted: 'outline',
  confidential: 'destructive',
} as const;

export default function DocumentsPage() {
  const [tab, setTab] = useState<'all' | 'policy' | 'procedure' | 'report' | 'manual'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: documents, isLoading } = useDocuments(tab !== 'all' ? { category: tab } : {});
  const deleteMutation = useDeleteDocument();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Document Title',
      cell: ({ row }) => {
        const document = row.original;
        return (
          <Link
            href={`/documents/${document.id}`}
            className="font-medium hover:underline"
          >
            {document.title}
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
      accessorKey: 'fileName',
      header: 'File Name',
    },
    {
      accessorKey: 'version',
      header: 'Version',
      cell: ({ row }) => <Badge variant="secondary">v{row.getValue('version')}</Badge>,
    },
    {
      accessorKey: 'accessLevel',
      header: 'Access Level',
      cell: ({ row }) => {
        const level = row.getValue('accessLevel') as keyof typeof accessLevelColors;
        return (
          <Badge variant={accessLevelColors[level] || 'default'}>
            {level}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => format(new Date(row.original.updatedAt), 'MMM dd, yyyy'),
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
        const document = row.original;
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
                <Link href={`/documents/${document.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/documents/${document.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/documents/${document.id}/versions`}>
                  <History className="mr-2 h-4 w-4" />
                  Version History
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(document.id)}
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

  const filteredDocuments = documents?.filter(
    (document) =>
      document.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Document Management</h1>
        <p className="text-muted-foreground mt-1">
          Centralized document repository with version control
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="policy">Policies</TabsTrigger>
          <TabsTrigger value="procedure">Procedures</TabsTrigger>
          <TabsTrigger value="report">Reports</TabsTrigger>
          <TabsTrigger value="manual">Manuals</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 flex justify-end">
        <Button asChild>
          <Link href="/documents/new">
            <FileText className="mr-2 h-4 w-4" />
            Upload Document
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredDocuments || []}
        isLoading={isLoading}
      />

      <div className="mt-4 text-sm text-muted-foreground text-center">
        <FileText className="inline h-4 w-4 mr-1" />
        Total: {filteredDocuments?.length || 0} documents
      </div>
    </div>
  );
}
