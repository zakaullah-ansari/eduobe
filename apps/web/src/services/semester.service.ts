import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

// Types
export interface Semester {
  id: string;
  curriculumId: string;
  number: number;
  name: string;
  totalCredits?: number;
  status: 'active' | 'archived';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  curriculum?: { id: string; name: string; version: string };
  _count?: { courses: number };
}

export interface CreateSemesterDto {
  curriculumId: string;
  number: number;
  name: string;
  totalCredits?: number;
}

export interface UpdateSemesterDto extends Partial<CreateSemesterDto> {
  status?: 'active' | 'archived';
}

// Query Keys
export const semesterKeys = {
  all: ['semesters'] as const,
  lists: () => [...semesterKeys.all, 'list'] as const,
  list: (filters: any) => [...semesterKeys.lists(), filters] as const,
  details: () => [...semesterKeys.all, 'detail'] as const,
  detail: (id: string) => [...semesterKeys.details(), id] as const,
};

// Queries
export function useSemesters(filters?: any) {
  return useQuery({
    queryKey: semesterKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/semesters', { params: filters });
      return response.data.data as Semester[];
    },
  });
}

export function useSemester(id: string) {
  return useQuery({
    queryKey: semesterKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/semesters/${id}`);
      return response.data.data as Semester;
    },
    enabled: !!id,
  });
}

// Mutations
export function useCreateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSemesterDto) => {
      const response = await apiClient.post('/semesters', data);
      return response.data.data as Semester;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: semesterKeys.lists() });
      toast.success('Semester created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create semester');
    },
  });
}

export function useUpdateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSemesterDto }) => {
      const response = await apiClient.patch(`/semesters/${id}`, data);
      return response.data.data as Semester;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: semesterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: semesterKeys.detail(data.id) });
      toast.success('Semester updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update semester');
    },
  });
}

export function useDeleteSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/semesters/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: semesterKeys.lists() });
      toast.success('Semester archived successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to archive semester');
    },
  });
}
