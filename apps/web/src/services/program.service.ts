import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

// Types
export interface Program {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  degreeType: 'btech' | 'mtech' | 'diploma' | 'phd';
  duration: number;
  totalSemesters: number;
  totalCredits?: number;
  description?: string;
  status: 'active' | 'archived';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  _count?: {
    curricula: number;
    batches: number;
  };
}

export interface CreateProgramDto {
  name: string;
  code: string;
  departmentId: string;
  degreeType: 'btech' | 'mtech' | 'diploma' | 'phd';
  duration: number;
  totalSemesters: number;
  totalCredits?: number;
  description?: string;
}

export interface UpdateProgramDto {
  name?: string;
  code?: string;
  departmentId?: string;
  degreeType?: 'btech' | 'mtech' | 'diploma' | 'phd';
  duration?: number;
  totalSemesters?: number;
  totalCredits?: number;
  description?: string;
  status?: 'active' | 'archived';
}

// Query Keys
export const programKeys = {
  all: ['programs'] as const,
  lists: () => [...programKeys.all, 'list'] as const,
  list: (filters: any) => [...programKeys.lists(), filters] as const,
  details: () => [...programKeys.all, 'detail'] as const,
  detail: (id: string) => [...programKeys.details(), id] as const,
};

// Queries
export function usePrograms(filters?: any) {
  return useQuery({
    queryKey: programKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/programs', { params: filters });
      return response.data.data as Program[];
    },
  });
}

export function useProgram(id: string) {
  return useQuery({
    queryKey: programKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/programs/${id}`);
      return response.data.data as Program;
    },
    enabled: !!id,
  });
}

// Mutations
export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProgramDto) => {
      const response = await apiClient.post('/programs', data);
      return response.data.data as Program;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      toast.success('Program created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create program');
    },
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProgramDto }) => {
      const response = await apiClient.patch(`/programs/${id}`, data);
      return response.data.data as Program;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      queryClient.invalidateQueries({ queryKey: programKeys.detail(data.id) });
      toast.success('Program updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update program');
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/programs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      toast.success('Program archived successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to archive program');
    },
  });
}
