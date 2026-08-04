import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Report {
  id: string;
  name: string;
  type: 'attendance' | 'marks' | 'enrollment' | 'faculty-workload' | 'custom';
  description?: string;
  filters?: any;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  fileUrl?: string;
  generatedAt?: string;
  generatedBy?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface GenerateReportDto {
  name: string;
  type: 'attendance' | 'marks' | 'enrollment' | 'faculty-workload' | 'custom';
  description?: string;
  filters?: {
    courseOfferingId?: string;
    batchId?: string;
    departmentId?: string;
    startDate?: string;
    endDate?: string;
    academicYear?: string;
  };
  format?: 'pdf' | 'excel' | 'csv';
}

export const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (filters: any) => [...reportKeys.lists(), filters] as const,
  details: () => [...reportKeys.all, 'detail'] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
};

export function useReports(filters?: any) {
  return useQuery({
    queryKey: reportKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/reports', { params: filters });
      return response.data.data as Report[];
    },
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/reports/${id}`);
      return response.data.data as Report;
    },
    enabled: !!id,
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GenerateReportDto) => {
      const response = await apiClient.post('/reports/generate', data);
      return response.data.data as Report;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      toast.success('Report generation started');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate report');
    },
  });
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.get(`/reports/${id}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${id}-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success('Report downloaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to download report');
    },
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/reports/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      toast.success('Report deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete report');
    },
  });
}
