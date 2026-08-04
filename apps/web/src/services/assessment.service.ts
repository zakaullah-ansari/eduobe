import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Assessment {
  id: string;
  courseOfferingId: string;
  name: string;
  type: 'quiz' | 'midterm' | 'final' | 'assignment' | 'lab' | 'project' | 'other';
  maxMarks: number;
  weightage: number;
  date: string;
  description?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
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
  };
  _count?: {
    marks: number;
  };
}

export interface CreateAssessmentDto {
  courseOfferingId: string;
  name: string;
  type: 'quiz' | 'midterm' | 'final' | 'assignment' | 'lab' | 'project' | 'other';
  maxMarks: number;
  weightage: number;
  date: string;
  description?: string;
}

export interface UpdateAssessmentDto extends Partial<CreateAssessmentDto> {
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export const assessmentKeys = {
  all: ['assessments'] as const,
  lists: () => [...assessmentKeys.all, 'list'] as const,
  list: (filters: any) => [...assessmentKeys.lists(), filters] as const,
  details: () => [...assessmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...assessmentKeys.details(), id] as const,
};

export function useAssessments(filters?: any) {
  return useQuery({
    queryKey: assessmentKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/assessments', { params: filters });
      return response.data.data as Assessment[];
    },
  });
}

export function useAssessment(id: string) {
  return useQuery({
    queryKey: assessmentKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/assessments/${id}`);
      return response.data.data as Assessment;
    },
    enabled: !!id,
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAssessmentDto) => {
      const response = await apiClient.post('/assessments', data);
      return response.data.data as Assessment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.lists() });
      toast.success('Assessment created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create assessment');
    },
  });
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAssessmentDto }) => {
      const response = await apiClient.patch(`/assessments/${id}`, data);
      return response.data.data as Assessment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: assessmentKeys.detail(data.id) });
      toast.success('Assessment updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update assessment');
    },
  });
}

export function useDeleteAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/assessments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.lists() });
      toast.success('Assessment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete assessment');
    },
  });
}
