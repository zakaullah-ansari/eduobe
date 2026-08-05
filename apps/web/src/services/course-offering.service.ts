import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface CourseOffering {
  id: string;
  courseId: string;
  facultyId: string;
  batchId: string;
  sectionId?: string;
  semester: number;
  academicYear: string;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  maxStudents?: number;
  classroom?: string;
  schedule?: string;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: string;
    code: string;
    name: string;
    credits: number;
  };
  faculty?: {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
  };
  batch?: {
    id: string;
    name: string;
    program?: {
      id: string;
      name: string;
      code: string;
    };
  };
  section?: {
    id: string;
    name: string;
  };
  _count?: {
    enrollments: number;
    assessments: number;
  };
}

export interface CreateCourseOfferingDto {
  courseId: string;
  facultyId: string;
  batchId: string;
  sectionId?: string;
  semester: number;
  academicYear: string;
  maxStudents?: number;
  classroom?: string;
  schedule?: string;
}

export interface UpdateCourseOfferingDto extends Partial<CreateCourseOfferingDto> {
  status?: 'planned' | 'ongoing' | 'completed' | 'cancelled';
}

export const courseOfferingKeys = {
  all: ['course-offerings'] as const,
  lists: () => [...courseOfferingKeys.all, 'list'] as const,
  list: (filters: any) => [...courseOfferingKeys.lists(), filters] as const,
  details: () => [...courseOfferingKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseOfferingKeys.details(), id] as const,
};

export function useCourseOfferings(filters?: any) {
  return useQuery({
    queryKey: courseOfferingKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/course-offerings', { params: filters });
      return response.data.data as CourseOffering[];
    },
  });
}

export function useCourseOffering(id: string) {
  return useQuery({
    queryKey: courseOfferingKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/course-offerings/${id}`);
      return response.data.data as CourseOffering;
    },
    enabled: !!id,
  });
}

export function useCreateCourseOffering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCourseOfferingDto) => {
      const response = await apiClient.post('/course-offerings', data);
      return response.data.data as CourseOffering;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseOfferingKeys.lists() });
      toast.success('Course offering created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create course offering');
    },
  });
}

export function useUpdateCourseOffering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCourseOfferingDto }) => {
      const response = await apiClient.patch(`/course-offerings/${id}`, data);
      return response.data.data as CourseOffering;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: courseOfferingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseOfferingKeys.detail(data.id) });
      toast.success('Course offering updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update course offering');
    },
  });
}

export function useDeleteCourseOffering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/course-offerings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseOfferingKeys.lists() });
      toast.success('Course offering deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete course offering');
    },
  });
}
