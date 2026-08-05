'use client';
import { useState } from 'react';
import { useBackups, useRestorePoints, useCreateBackup, useDownloadBackup, useRestoreBackup, useScheduleBackup } from '@/services/backup.service';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Database, Download, RotateCcw, Clock } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = { pending: 'secondary', in_progress: 'default', completed: 'outline', failed: 'destructive' } as const;

export default function BackupPage() {
  const [tab, setTab] = useState<'backups' | 'restore-points'>('backups');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: backups, isLoading: backupsLoading } = useBackups();
  const { data: restorePoints, isLoading: restoreLoading } = useRestorePoints();

  const backupColumns: ColumnDef<any>[] = [
    { accessorKey: 'backupNumber', header: 'Backup No.', cell: ({ row }) => <Badge variant="outline">{row.getValue('backupNumber')}</Badge> },
    { accessorKey: 'type', header: 'Type', cell: ({ row }) => <Badge variant="secondary">{row.getValue('type')}</Badge> },
    { accessorKey: 'startDate', header: 'Start Date', cell: ({ row }) => format(new Date(row.original.startDate), 'MMM dd, yyyy HH:mm') },
    { accessorKey: 'endDate', header: 'End Date', cell: ({ row }) => row.original.endDate ? format(new Date(row.original.endDate), 'MMM dd, yyyy HH:mm') : 'N/A' },
    { accessorKey: 'fileSize', header: 'File Size', cell: ({ row }) => row.original.fileSize ? `${(row.original.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={statusColors[row.getValue('status') as keyof typeof statusColors] || 'default'}>{row.getValue('status')}</Badge> },
    { id: 'actions', cell: ({ row }) => (<DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuItem asChild><Link href={`/backup/${row.original.id}`}>View Details</Link></DropdownMenuItem>{row.original.status === 'completed' && <DropdownMenuItem><Download className="mr-2 h-4 w-4" />Download</DropdownMenuItem>}{row.original.status === 'completed' && <DropdownMenuItem><RotateCcw className="mr-2 h-4 w-4" />Restore</DropdownMenuItem>}<DropdownMenuSeparator /><DropdownMenuItem className="text-red-600" onClick={() => { if (confirm('Delete?')) toast.success('Deleted'); }}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu>) },
  ];

  const restoreColumns: ColumnDef<any>[] = [
    { accessorKey: 'restoreNumber', header: 'Restore No.', cell: ({ row }) => <Badge variant="outline">{row.getValue('restoreNumber')}</Badge> },
    { accessorKey: 'backup', header: 'Backup', cell: ({ row }) => row.original.backup?.backupNumber || 'N/A' },
    { accessorKey: 'startDate', header: 'Start Date', cell: ({ row }) => format(new Date(row.original.startDate), 'MMM dd, yyyy HH:mm') },
    { accessorKey: 'endDate', header: 'End Date', cell: ({ row }) => row.original.endDate ? format(new Date(row.original.endDate), 'MMM dd, yyyy HH:mm') : 'N/A' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={statusColors[row.getValue('status') as keyof typeof statusColors] || 'default'}>{row.getValue('status')}</Badge> },
    { id: 'actions', cell: ({ row }) => (<DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuItem asChild><Link href={`/backup/restore-points/${row.original.id}`}>View Details</Link></DropdownMenuItem></DropdownMenuContent></DropdownMenu>) },
  ];

  const filteredBackups = backups?.filter(b => b.backupNumber.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredRestore = restorePoints?.filter(r => r.restoreNumber.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6"><h1 className="text-3xl font-bold">Backup & Restore</h1><p className="text-muted-foreground mt-1">Manage database backups and restore points</p></div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6"><TabsList><TabsTrigger value="backups">Backups</TabsTrigger><TabsTrigger value="restore-points">Restore Points</TabsTrigger></TabsList></Tabs>
      <Card className="mb-6"><CardContent className="pt-6"><Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></CardContent></Card>
      {tab === 'backups' && (<><div className="mb-4 flex justify-end gap-2"><Button variant="outline"><Clock className="mr-2 h-4 w-4" />Schedule Backup</Button><Button asChild><Link href="/backup/new"><Database className="mr-2 h-4 w-4" />Create Backup</Link></Button></div><DataTable columns={backupColumns} data={filteredBackups || []} isLoading={backupsLoading} /><div className="mt-4 text-sm text-muted-foreground text-center">Total: {filteredBackups?.length || 0} backups</div></>)}
      {tab === 'restore-points' && (<><DataTable columns={restoreColumns} data={filteredRestore || []} isLoading={restoreLoading} /><div className="mt-4 text-sm text-muted-foreground text-center">Total: {filteredRestore?.length || 0} restore points</div></>)}
    </div>
  );
}
