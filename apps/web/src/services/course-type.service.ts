import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

// Types
export interface CourseType {
  id: string;
  name: string;
  code: string;
  attendanceMode: 'daily' | 'batch_wise' | 'experiment_wise';
  planType: 'teaching' | 'practical' | 'project' | 'none';
  hasPractical: boolean;
  hasProject: boolean;
  description?: string;
  status: 'active' | 'archived';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { courses: number };
}

export interface CreateCourseTypeDto {
  name: string;
  code: string;
  attendanceMode: 'daily' | 'batch_wise' | 'experiment_wise';
  planType: 'teaching' | 'practical' | 'project' | 'none';
  hasPractical?: boolean;
  hasProject?: boolean;
  description?: string;
}

export interface UpdateCourseTypeDto extends Partial<CreateCourseTypeDto> {
  status?: 'active' | 'archived';
}

// Query Keys
export const courseTypeKeys = {
  all: ['course-types'] as const,
  lists: () => [...courseTypeKeys.all, 'list'] as const,
  list: (filters: any) => [...courseTypeKeys.lists(), filters] as const,
  details: () => [...courseTypeKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseTypeKeys.details(), id] as const,
};

// Queries
export function useCourseTypes(filters?: any) {
  return useQuery({
    queryKey: courseTypeKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/course-types', { params: filters });
      return response.data.data as CourseType[];
    },
  });
}

export function useCourseType(id: string) {
  return useQuery({
    queryKey: courseTypeKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/course-types/${id}`);
      return response.data.data as CourseType;
    },
    enabled: !!id,
  });
}

// Mutations
export function useCreateCourseType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCourseTypeDto) => {
      const response = await apiClient.post('/course-types', data);
      return response.data.data as CourseType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseTypeKeys.lists() });
      toast.success('Course type created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create course type');
    },
  });
}

export function useUpdateCourseType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCourseTypeDto }) => {
      const response = await apiClient.patch(`/course-types/${id}`, data);
      return response.data.data as CourseType;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: courseTypeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseTypeKeys.detail(data.id) });
      toast.success('Course type updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update course type');
    },
  });
}

export function useDeleteCourseType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/course-types/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseTypeKeys.lists() });
      toast.success('Course type archived successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to archive course type');
    },
  });
}
