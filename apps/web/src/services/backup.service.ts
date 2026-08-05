import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Backup {
  id: string;
  backupNumber: string;
  type: 'full' | 'incremental' | 'partial';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startDate: string;
  endDate?: string;
  fileSize?: number;
  filePath?: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator?: { id: string; firstName: string; lastName: string; email: string };
}

export interface RestorePoint {
  id: string;
  restoreNumber: string;
  backupId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startDate: string;
  endDate?: string;
  description?: string;
  restoredBy: string;
  createdAt: string;
  updatedAt: string;
  backup?: { id: string; backupNumber: string; type: string };
  restorer?: { id: string; firstName: string; lastName: string; email: string };
}

export interface CreateBackupDto {
  type: 'full' | 'incremental' | 'partial';
  description?: string;
  tables?: string[];
}

export interface CreateRestoreDto {
  backupId: string;
  description?: string;
}

export const backupKeys = {
  all: ['backups'] as const,
  backups: () => [...backupKeys.all, 'backups'] as const,
  backup: (filters: any) => [...backupKeys.backups(), filters] as const,
  detail: (id: string) => [...backupKeys.all, 'detail', id] as const,
  restorePoints: () => [...backupKeys.all, 'restorePoints'] as const,
  restorePoint: (filters: any) => [...backupKeys.restorePoints(), filters] as const,
};

export function useBackups(filters?: any) {
  return useQuery({
    queryKey: backupKeys.backup(filters),
    queryFn: async () => {
      const response = await apiClient.get('/backups', { params: filters });
      return response.data.data as Backup[];
    },
  });
}

export function useBackup(id: string) {
  return useQuery({
    queryKey: backupKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/backups/${id}`);
      return response.data.data as Backup;
    },
    enabled: !!id,
  });
}

export function useRestorePoints(filters?: any) {
  return useQuery({
    queryKey: backupKeys.restorePoint(filters),
    queryFn: async () => {
      const response = await apiClient.get('/backups/restore-points', { params: filters });
      return response.data.data as RestorePoint[];
    },
  });
}

export function useCreateBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBackupDto) => {
      const response = await apiClient.post('/backups', data);
      return response.data.data as Backup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: backupKeys.backups() });
      toast.success('Backup created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create backup');
    },
  });
}

export function useDeleteBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/backups/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: backupKeys.backups() });
      toast.success('Backup deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete backup');
    },
  });
}

export function useDownloadBackup() {
  return async (id: string) => {
    const response = await apiClient.get(`/backups/${id}/download`, {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `backup-${id}-${Date.now()}.sql`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };
}

export function useRestoreBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRestoreDto) => {
      const response = await apiClient.post('/backups/restore', data);
      return response.data.data as RestorePoint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: backupKeys.restorePoints() });
      toast.success('Backup restore initiated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to restore backup');
    },
  });
}

export function useScheduleBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { type: 'full' | 'incremental'; schedule: string }) => {
      const response = await apiClient.post('/backups/schedule', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: backupKeys.backups() });
      toast.success('Backup scheduled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to schedule backup');
    },
  });
}
