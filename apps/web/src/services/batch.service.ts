import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

// Types
export interface Batch {
  id: string;
  name: string;
  programId: string;
  academicYearId: string;
  admissionYear: number;
  currentSemester: number;
  status: 'active' | 'graduated' | 'archived';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  program?: { id: string; name: string; code: string };
  academicYear?: { id: string; name: string };
  _count?: { sections: number; students: number };
}

export interface CreateBatchDto {
  name: string;
  programId: string;
  academicYearId: string;
  admissionYear: number;
  currentSemester: number;
}

export interface UpdateBatchDto extends Partial<CreateBatchDto> {
  status?: 'active' | 'graduated' | 'archived';
}

// Query Keys
export const batchKeys = {
  all: ['batches'] as const,
  lists: () => [...batchKeys.all, 'list'] as const,
  list: (filters: any) => [...batchKeys.lists(), filters] as const,
  details: () => [...batchKeys.all, 'detail'] as const,
  detail: (id: string) => [...batchKeys.details(), id] as const,
};

// Queries
export function useBatches(filters?: any) {
  return useQuery({
    queryKey: batchKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/batches', { params: filters });
      return response.data.data as Batch[];
    },
  });
}

export function useBatch(id: string) {
  return useQuery({
    queryKey: batchKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/batches/${id}`);
      return response.data.data as Batch;
    },
    enabled: !!id,
  });
}

// Mutations
export function useCreateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBatchDto) => {
      const response = await apiClient.post('/batches', data);
      return response.data.data as Batch;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
      toast.success('Batch created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create batch');
    },
  });
}

export function useUpdateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBatchDto }) => {
      const response = await apiClient.patch(`/batches/${id}`, data);
      return response.data.data as Batch;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
      queryClient.invalidateQueries({ queryKey: batchKeys.detail(data.id) });
      toast.success('Batch updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update batch');
    },
  });
}

export function useDeleteBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/batches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
      toast.success('Batch archived successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to archive batch');
    },
  });
}
