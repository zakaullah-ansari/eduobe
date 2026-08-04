import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Patent {
  id: string;
  title: string;
  inventors?: string[];
  applicationNumber: string;
  applicationDate: string;
  patentNumber?: string;
  grantDate?: string;
  status: 'filed' | 'published' | 'granted' | 'rejected' | 'abandoned';
  type: 'provisional' | 'complete' | 'pct' | 'national';
  category: string;
  abstract?: string;
  facultyId?: string;
  departmentId?: string;
  commercializationStatus?: 'not_started' | 'in_progress' | 'licensed' | 'sold';
  licenseAmount?: number;
  createdAt: string;
  updatedAt: string;
  faculty?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface CreatePatentDto {
  title: string;
  inventors?: string[];
  applicationNumber: string;
  applicationDate: string;
  patentNumber?: string;
  grantDate?: string;
  type: 'provisional' | 'complete' | 'pct' | 'national';
  category: string;
  abstract?: string;
  facultyId?: string;
  departmentId?: string;
  commercializationStatus?: 'not_started' | 'in_progress' | 'licensed' | 'sold';
  licenseAmount?: number;
}

export interface UpdatePatentDto extends Partial<CreatePatentDto> {
  status?: 'filed' | 'published' | 'granted' | 'rejected' | 'abandoned';
}

export const patentKeys = {
  all: ['patents'] as const,
  lists: () => [...patentKeys.all, 'list'] as const,
  list: (filters: any) => [...patentKeys.lists(), filters] as const,
  details: () => [...patentKeys.all, 'detail'] as const,
  detail: (id: string) => [...patentKeys.details(), id] as const,
};

export function usePatents(filters?: any) {
  return useQuery({
    queryKey: patentKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/patents', { params: filters });
      return response.data.data as Patent[];
    },
  });
}

export function usePatent(id: string) {
  return useQuery({
    queryKey: patentKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/patents/${id}`);
      return response.data.data as Patent;
    },
    enabled: !!id,
  });
}

export function useCreatePatent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePatentDto) => {
      const response = await apiClient.post('/patents', data);
      return response.data.data as Patent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patentKeys.lists() });
      toast.success('Patent filed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to file patent');
    },
  });
}

export function useUpdatePatent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePatentDto }) => {
      const response = await apiClient.patch(`/patents/${id}`, data);
      return response.data.data as Patent;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: patentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: patentKeys.detail(data.id) });
      toast.success('Patent updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update patent');
    },
  });
}

export function useDeletePatent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/patents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patentKeys.lists() });
      toast.success('Patent deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete patent');
    },
  });
}
