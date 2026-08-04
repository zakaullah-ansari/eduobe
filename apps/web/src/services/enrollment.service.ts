import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Enrollment {
  id: string;
  studentId: string;
  courseOfferingId: string;
  enrollmentDate: string;
  status: 'enrolled' | 'dropped' | 'completed' | 'failed';
  grade?: string;
  gradePoints?: number;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    rollNumber: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  courseOffering?: {
    id: string;
    course?: {
      id: string;
      code: string;
      name: string;
    };
    faculty?: {
      id: string;
      firstName: string;
      lastName: string;
    };
    batch?: {
      id: string;
      name: string;
    };
  };
}

export interface CreateEnrollmentDto {
  studentId: string;
  courseOfferingId: string;
  enrollmentDate?: string;
}

export interface BulkEnrollmentDto {
  studentIds: string[];
  courseOfferingId: string;
  enrollmentDate?: string;
}

export interface UpdateEnrollmentDto {
  status?: 'enrolled' | 'dropped' | 'completed' | 'failed';
  grade?: string;
  gradePoints?: number;
}

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  lists: () => [...enrollmentKeys.all, 'list'] as const,
  list: (filters: any) => [...enrollmentKeys.lists(), filters] as const,
  details: () => [...enrollmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...enrollmentKeys.details(), id] as const,
};

export function useEnrollments(filters?: any) {
  return useQuery({
    queryKey: enrollmentKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/enrollments', { params: filters });
      return response.data.data as Enrollment[];
    },
  });
}

export function useEnrollment(id: string) {
  return useQuery({
    queryKey: enrollmentKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/enrollments/${id}`);
      return response.data.data as Enrollment;
    },
    enabled: !!id,
  });
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEnrollmentDto) => {
      const response = await apiClient.post('/enrollments', data);
      return response.data.data as Enrollment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists() });
      toast.success('Student enrolled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to enroll student');
    },
  });
}

export function useBulkEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BulkEnrollmentDto) => {
      const response = await apiClient.post('/enrollments/bulk', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists() });
      toast.success(`Successfully enrolled ${data.enrolled} students`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to enroll students');
    },
  });
}

export function useUpdateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEnrollmentDto }) => {
      const response = await apiClient.patch(`/enrollments/${id}`, data);
      return response.data.data as Enrollment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.detail(data.id) });
      toast.success('Enrollment updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update enrollment');
    },
  });
}

export function useDeleteEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/enrollments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists() });
      toast.success('Enrollment removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove enrollment');
    },
  });
}
