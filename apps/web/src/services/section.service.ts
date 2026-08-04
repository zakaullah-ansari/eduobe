import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

// Types
export interface Section {
  id: string;
  name: string;
  batchId: string;
  maxStrength: number;
  currentStrength: number;
  status: 'active' | 'archived';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  batch?: { id: string; name: string };
  _count?: { students: number; courseOfferings: number };
}

export interface CreateSectionDto {
  name: string;
  batchId: string;
  maxStrength: number;
}

export interface UpdateSectionDto extends Partial<CreateSectionDto> {
  status?: 'active' | 'archived';
}

// Query Keys
export const sectionKeys = {
  all: ['sections'] as const,
  lists: () => [...sectionKeys.all, 'list'] as const,
  list: (filters: any) => [...sectionKeys.lists(), filters] as const,
  details: () => [...sectionKeys.all, 'detail'] as const,
  detail: (id: string) => [...sectionKeys.details(), id] as const,
};

// Queries
export function useSections(filters?: any) {
  return useQuery({
    queryKey: sectionKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/sections', { params: filters });
      return response.data.data as Section[];
    },
  });
}

export function useSection(id: string) {
  return useQuery({
    queryKey: sectionKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/sections/${id}`);
      return response.data.data as Section;
    },
    enabled: !!id,
  });
}

// Mutations
export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSectionDto) => {
      const response = await apiClient.post('/sections', data);
      return response.data.data as Section;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionKeys.lists() });
      toast.success('Section created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create section');
    },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSectionDto }) => {
      const response = await apiClient.patch(`/sections/${id}`, data);
      return response.data.data as Section;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: sectionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sectionKeys.detail(data.id) });
      toast.success('Section updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update section');
    },
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/sections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionKeys.lists() });
      toast.success('Section archived successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to archive section');
    },
  });
}
