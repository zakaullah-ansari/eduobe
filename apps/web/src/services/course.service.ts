import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

// Types
export interface Course {
  id: string;
  code: string;
  name: string;
  shortName?: string;
  semesterId: string;
  curriculumId: string;
  courseTypeId: string;
  credits: number;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  prerequisites?: string[];
  syllabusUrl?: string;
  description?: string;
  status: 'active' | 'archived';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  semester?: { id: string; number: number; name: string };
  courseType?: { id: string; name: string; code: string };
  _count?: { courseOfferings: number };
}

export interface CreateCourseDto {
  code: string;
  name: string;
  shortName?: string;
  semesterId: string;
  curriculumId: string;
  courseTypeId: string;
  credits: number;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  prerequisites?: string[];
  syllabusUrl?: string;
  description?: string;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {
  status?: 'active' | 'archived';
}

// Query Keys
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters: any) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
};

// Queries
export function useCourses(filters?: any) {
  return useQuery({
    queryKey: courseKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/courses', { params: filters });
      return response.data.data as Course[];
    },
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/courses/${id}`);
      return response.data.data as Course;
    },
    enabled: !!id,
  });
}

// Mutations
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCourseDto) => {
      const response = await apiClient.post('/courses', data);
      return response.data.data as Course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      toast.success('Course created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create course');
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCourseDto }) => {
      const response = await apiClient.patch(`/courses/${id}`, data);
      return response.data.data as Course;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(data.id) });
      toast.success('Course updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update course');
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      toast.success('Course archived successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to archive course');
    },
  });
}
