import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

// Types
export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'active' | 'archived';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAcademicYearDto {
  name: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface UpdateAcademicYearDto {
  name?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  status?: 'active' | 'archived';
}

// Query Keys
export const academicYearKeys = {
  all: ['academic-years'] as const,
  lists: () => [...academicYearKeys.all, 'list'] as const,
  list: (filters: any) => [...academicYearKeys.lists(), filters] as const,
  details: () => [...academicYearKeys.all, 'detail'] as const,
  detail: (id: string) => [...academicYearKeys.details(), id] as const,
};

// Queries
export function useAcademicYears(filters?: any) {
  return useQuery({
    queryKey: academicYearKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/academic-years', { params: filters });
      return response.data.data as AcademicYear[];
    },
  });
}

export function useAcademicYear(id: string) {
  return useQuery({
    queryKey: academicYearKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/academic-years/${id}`);
      return response.data.data as AcademicYear;
    },
    enabled: !!id,
  });
}

// Mutations
export function useCreateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAcademicYearDto) => {
      const response = await apiClient.post('/academic-years', data);
      return response.data.data as AcademicYear;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.lists() });
      toast.success('Academic year created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create academic year');
    },
  });
}

export function useUpdateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAcademicYearDto }) => {
      const response = await apiClient.patch(`/academic-years/${id}`, data);
      return response.data.data as AcademicYear;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.lists() });
      queryClient.invalidateQueries({ queryKey: academicYearKeys.detail(data.id) });
      toast.success('Academic year updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update academic year');
    },
  });
}

export function useDeleteAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/academic-years/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.lists() });
      toast.success('Academic year archived successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to archive academic year');
    },
  });
}

export function useSetCurrentAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/academic-years/${id}/set-current`);
      return response.data.data as AcademicYear;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.lists() });
      toast.success('Current academic year updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to set current academic year');
    },
  });
}
