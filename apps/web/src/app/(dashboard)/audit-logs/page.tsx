'use client';

import { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useAuditLogs, useExportAuditLogs } from '@/services/audit-log.service';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { toast } from 'sonner';

const actionColors = {
  CREATE: 'default',
  UPDATE: 'secondary',
  DELETE: 'destructive',
  LOGIN: 'outline',
  LOGOUT: 'outline',
} as const;

export default function AuditLogsPage() {
  const [filters, setFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { data: logs, isLoading } = useAuditLogs(filters);
  const exportLogs = useExportAuditLogs();

  const handleExport = async () => {
    try {
      await exportLogs(filters);
      toast.success('Audit logs exported successfully');
    } catch (error) {
      toast.error('Failed to export audit logs');
    }
  };

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'timestamp',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Timestamp
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = row.getValue('timestamp') as string;
          return format(new Date(date), 'MMM dd, yyyy HH:mm:ss');
        },
      },
      {
        accessorKey: 'user',
        header: 'User',
        cell: ({ row }) => {
          const user = row.original.user;
          return user ? (
            <div>
              <p className="font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          ) : (
            <span className="text-muted-foreground">System</span>
          );
        },
      },
      {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => {
          const action = row.getValue('action') as string;
          return (
            <Badge variant={actionColors[action as keyof typeof actionColors] || 'outline'}>
              {action}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'entity',
        header: 'Entity',
        cell: ({ row }) => {
          const entity = row.getValue('entity') as string;
          return <Badge variant="outline">{entity}</Badge>;
        },
      },
      {
        accessorKey: 'entityId',
        header: 'Entity ID',
        cell: ({ row }) => {
          const id = row.getValue('entityId') as string;
          return <code className="text-xs bg-muted px-2 py-1 rounded">{id.substring(0, 8)}...</code>;
        },
      },
      {
        accessorKey: 'ipAddress',
        header: 'IP Address',
        cell: ({ row }) => row.getValue('ipAddress') || 'N/A',
      },
    ],
    []
  );

  const filteredLogs = useMemo(() => {
    if (!searchQuery) return logs || [];
    
    const query = searchQuery.toLowerCase();
    return (logs || []).filter(
      (log) =>
        log.user?.firstName.toLowerCase().includes(query) ||
        log.user?.lastName.toLowerCase().includes(query) ||
        log.user?.email.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.entity.toLowerCase().includes(query)
    );
  }, [logs, searchQuery]);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">
            Track all system activities and changes
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user, action, or entity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Action</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.action || ''}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    action: e.target.value || undefined,
                  }))
                }
              >
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="LOGIN">Login</option>
                <option value="LOGOUT">Logout</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Entity</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.entity || ''}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    entity: e.target.value || undefined,
                  }))
                }
              >
                <option value="">All Entities</option>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Course">Course</option>
                <option value="Batch">Batch</option>
                <option value="User">User</option>
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
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={filteredLogs}
        isLoading={isLoading}
      />

      <div className="mt-4 text-sm text-muted-foreground text-center">
        Total: {filteredLogs.length} log entries
      </div>
    </div>
  );
}
