'use client';
import { useState } from 'react';
import { useAuditLogs, useExportAuditLogs, useCleanupAuditLogs } from '@/services/audit-log.service';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, FileText, Download, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

const actionColors = { create: 'default', update: 'secondary', delete: 'destructive', login: 'outline', logout: 'outline', export: 'secondary', import: 'secondary' } as const;

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: logs, isLoading } = useAuditLogs();
  const exportLogs = useExportAuditLogs();
  const cleanupLogs = useCleanupAuditLogs();

  const handleExport = async () => {
    try {
      await exportLogs();
    } catch (error) {
      toast.error('Failed to export audit logs');
    }
  };

  const handleCleanup = () => {
    if (confirm('Are you sure you want to cleanup old audit logs (older than 90 days)?')) {
      cleanupLogs.mutate(90);
    }
  };

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'logNumber', header: 'Log No.', cell: ({ row }) => <Badge variant="outline">{row.getValue('logNumber')}</Badge> },
    { accessorKey: 'user', header: 'User', cell: ({ row }) => row.original.user ? `${row.original.user.firstName} ${row.original.user.lastName}` : 'N/A' },
    { accessorKey: 'action', header: 'Action', cell: ({ row }) => <Badge variant={actionColors[row.getValue('action') as keyof typeof actionColors] || 'default'}>{row.getValue('action')}</Badge> },
    { accessorKey: 'entityType', header: 'Entity Type', cell: ({ row }) => <Badge variant="secondary">{row.getValue('entityType')}</Badge> },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'timestamp', header: 'Timestamp', cell: ({ row }) => format(new Date(row.original.timestamp), 'MMM dd, yyyy HH:mm') },
    { id: 'actions', cell: ({ row }) => (<DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuItem asChild><Link href={`/audit-logs/${row.original.id}`}>View Details</Link></DropdownMenuItem></DropdownMenuContent></DropdownMenu>) },
  ];

  const filteredLogs = logs?.filter(l => l.description.toLowerCase().includes(searchQuery.toLowerCase()) || l.user?.firstName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between"><div><h1 className="text-3xl font-bold">Audit Logs</h1><p className="text-muted-foreground mt-1">Complete audit trail of all system activities</p></div><div className="flex gap-2"><Button onClick={handleExport} variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button><Button onClick={handleCleanup} variant="outline"><Trash2 className="mr-2 h-4 w-4" />Cleanup Old Logs</Button></div></div>
      <Card className="mb-6"><CardContent className="pt-6"><Input placeholder="Search audit logs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></CardContent></Card>
      <DataTable columns={columns} data={filteredLogs || []} isLoading={isLoading} />
      <div className="mt-4 text-sm text-muted-foreground text-center">Total: {filteredLogs?.length || 0} audit logs</div>
    </div>
  );
}
