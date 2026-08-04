import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

// Types
export interface Curriculum {
  id: string;
  programId: string;
  version: string;
  name: string;
  effectiveFrom: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  program?: { id: string; name: string; code: string };
  _count?: { semesters: number };
}

export interface CreateCurriculumDto {
  programId: string;
  version: string;
  name: string;
  effectiveFrom: string;
  description?: string;
}

export interface UpdateCurriculumDto extends Partial<CreateCurriculumDto> {
  status?: 'draft' | 'active' | 'archived';
}

// Query Keys
export const curriculumKeys = {
  all: ['curricula'] as const,
  lists: () => [...curriculumKeys.all, 'list'] as const,
  list: (filters: any) => [...curriculumKeys.lists(), filters] as const,
  details: () => [...curriculumKeys.all, 'detail'] as const,
  detail: (id: string) => [...curriculumKeys.details(), id] as const,
};

// Queries
export function useCurricula(filters?: any) {
  return useQuery({
    queryKey: curriculumKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/curricula', { params: filters });
      return response.data.data as Curriculum[];
    },
  });
}

export function useCurriculum(id: string) {
  return useQuery({
    queryKey: curriculumKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/curricula/${id}`);
      return response.data.data as Curriculum;
    },
    enabled: !!id,
  });
}

// Mutations
export function useCreateCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCurriculumDto) => {
      const response = await apiClient.post('/curricula', data);
      return response.data.data as Curriculum;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: curriculumKeys.lists() });
      toast.success('Curriculum created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create curriculum');
    },
  });
}

export function useUpdateCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCurriculumDto }) => {
      const response = await apiClient.patch(`/curricula/${id}`, data);
      return response.data.data as Curriculum;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: curriculumKeys.lists() });
      queryClient.invalidateQueries({ queryKey: curriculumKeys.detail(data.id) });
      toast.success('Curriculum updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update curriculum');
    },
  });
}

export function useDeleteCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/curricula/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: curriculumKeys.lists() });
      toast.success('Curriculum archived successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to archive curriculum');
    },
  });
}
