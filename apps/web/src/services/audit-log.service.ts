import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface AuditLog {
  id: string;
  logNumber: string;
  userId: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'export' | 'import';
  entityType: string;
  entityId: string;
  description: string;
  changes?: { field: string; oldValue: any; newValue: any }[];
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  createdAt: string;
  user?: { id: string; firstName: string; lastName: string; email: string; role?: string };
}

export interface AuditLogFilter {
  userId?: string;
  action?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export const auditLogKeys = {
  all: ['audit-logs'] as const,
  logs: () => [...auditLogKeys.all, 'logs'] as const,
  log: (filters: any) => [...auditLogKeys.logs(), filters] as const,
  detail: (id: string) => [...auditLogKeys.all, 'detail', id] as const,
};

export function useAuditLogs(filters?: AuditLogFilter) {
  return useQuery({
    queryKey: auditLogKeys.log(filters),
    queryFn: async () => {
      const response = await apiClient.get('/audit-logs', { params: filters });
      return response.data.data as AuditLog[];
    },
  });
}

export function useAuditLog(id: string) {
  return useQuery({
    queryKey: auditLogKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/audit-logs/${id}`);
      return response.data.data as AuditLog;
    },
    enabled: !!id,
  });
}

export function useExportAuditLogs() {
  return async (filters?: AuditLogFilter) => {
    const response = await apiClient.get('/audit-logs/export', {
      params: filters,
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audit-logs-${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };
}

export function useCleanupAuditLogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (daysToKeep: number) => {
      const response = await apiClient.post('/audit-logs/cleanup', { daysToKeep });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: auditLogKeys.logs() });
      toast.success(`Cleaned up ${data.deletedCount} old audit logs`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cleanup audit logs');
    },
  });
}
