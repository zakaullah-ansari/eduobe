import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface QualityMetric {
  id: string;
  name: string;
  category: 'teaching' | 'research' | 'infrastructure' | 'governance' | 'student_support' | 'other';
  description?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  measurementFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semester' | 'annual';
  lastMeasuredDate?: string;
  status: 'on_track' | 'needs_attention' | 'critical' | 'achieved';
  departmentId?: string;
  programId?: string;
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  program?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface BestPractice {
  id: string;
  title: string;
  description?: string;
  category: 'teaching' | 'research' | 'administration' | 'student_welfare' | 'industry_interaction' | 'other';
  implementationDate?: string;
  impact?: string;
  evidence?: string[];
  status: 'planned' | 'implemented' | 'monitoring' | 'completed';
  departmentId?: string;
  programId?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface StakeholderFeedback {
  id: string;
  stakeholderType: 'student' | 'faculty' | 'parent' | 'employer' | 'alumni' | 'other';
  surveyTitle: string;
  description?: string;
  startDate: string;
  endDate: string;
  totalResponses?: number;
  averageRating?: number;
  status: 'draft' | 'active' | 'completed' | 'analysed';
  departmentId?: string;
  programId?: string;
  questions?: any[];
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface CreateMetricDto {
  name: string;
  category: 'teaching' | 'research' | 'infrastructure' | 'governance' | 'student_support' | 'other';
  description?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  measurementFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semester' | 'annual';
  departmentId?: string;
  programId?: string;
}

export interface UpdateMetricDto extends Partial<CreateMetricDto> {
  status?: 'on_track' | 'needs_attention' | 'critical' | 'achieved';
  lastMeasuredDate?: string;
}

export interface CreatePracticeDto {
  title: string;
  description?: string;
  category: 'teaching' | 'research' | 'administration' | 'student_welfare' | 'industry_interaction' | 'other';
  implementationDate?: string;
  impact?: string;
  evidence?: string[];
  departmentId?: string;
  programId?: string;
  remarks?: string;
}

export interface UpdatePracticeDto extends Partial<CreatePracticeDto> {
  status?: 'planned' | 'implemented' | 'monitoring' | 'completed';
}

export interface CreateFeedbackDto {
  stakeholderType: 'student' | 'faculty' | 'parent' | 'employer' | 'alumni' | 'other';
  surveyTitle: string;
  description?: string;
  startDate: string;
  endDate: string;
  departmentId?: string;
  programId?: string;
  questions?: any[];
}

export interface UpdateFeedbackDto extends Partial<CreateFeedbackDto> {
  status?: 'draft' | 'active' | 'completed' | 'analysed';
  totalResponses?: number;
  averageRating?: number;
}

export const qualityKeys = {
  all: ['quality'] as const,
  metrics: () => [...qualityKeys.all, 'metrics'] as const,
  metric: (filters: any) => [...qualityKeys.metrics(), filters] as const,
  practices: () => [...qualityKeys.all, 'practices'] as const,
  practice: (filters: any) => [...qualityKeys.practices(), filters] as const,
  feedbacks: () => [...qualityKeys.all, 'feedbacks'] as const,
  feedback: (filters: any) => [...qualityKeys.feedbacks(), filters] as const,
};

export function useQualityMetrics(filters?: any) {
  return useQuery({
    queryKey: qualityKeys.metric(filters),
    queryFn: async () => {
      const response = await apiClient.get('/quality/metrics', { params: filters });
      return response.data.data as QualityMetric[];
    },
  });
}

export function useQualityMetric(id: string) {
  return useQuery({
    queryKey: [...qualityKeys.metrics(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/quality/metrics/${id}`);
      return response.data.data as QualityMetric;
    },
    enabled: !!id,
  });
}

export function useBestPractices(filters?: any) {
  return useQuery({
    queryKey: qualityKeys.practice(filters),
    queryFn: async () => {
      const response = await apiClient.get('/quality/practices', { params: filters });
      return response.data.data as BestPractice[];
    },
  });
}

export function useStakeholderFeedbacks(filters?: any) {
  return useQuery({
    queryKey: qualityKeys.feedback(filters),
    queryFn: async () => {
      const response = await apiClient.get('/quality/feedbacks', { params: filters });
      return response.data.data as StakeholderFeedback[];
    },
  });
}

export function useCreateMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMetricDto) => {
      const response = await apiClient.post('/quality/metrics', data);
      return response.data.data as QualityMetric;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qualityKeys.metrics() });
      toast.success('Quality metric created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create metric');
    },
  });
}

export function useUpdateMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateMetricDto }) => {
      const response = await apiClient.patch(`/quality/metrics/${id}`, data);
      return response.data.data as QualityMetric;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: qualityKeys.metrics() });
      queryClient.invalidateQueries({ queryKey: [...qualityKeys.metrics(), data.id] });
      toast.success('Metric updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update metric');
    },
  });
}

export function useDeleteMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/quality/metrics/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qualityKeys.metrics() });
      toast.success('Metric deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete metric');
    },
  });
}

export function useCreatePractice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePracticeDto) => {
      const response = await apiClient.post('/quality/practices', data);
      return response.data.data as BestPractice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qualityKeys.practices() });
      toast.success('Best practice created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create practice');
    },
  });
}

export function useUpdatePractice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePracticeDto }) => {
      const response = await apiClient.patch(`/quality/practices/${id}`, data);
      return response.data.data as BestPractice;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: qualityKeys.practices() });
      queryClient.invalidateQueries({ queryKey: [...qualityKeys.practices(), data.id] });
      toast.success('Practice updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update practice');
    },
  });
}

export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFeedbackDto) => {
      const response = await apiClient.post('/quality/feedbacks', data);
      return response.data.data as StakeholderFeedback;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qualityKeys.feedbacks() });
      toast.success('Feedback survey created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create feedback survey');
    },
  });
}

export function useUpdateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFeedbackDto }) => {
      const response = await apiClient.patch(`/quality/feedbacks/${id}`, data);
      return response.data.data as StakeholderFeedback;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: qualityKeys.feedbacks() });
      queryClient.invalidateQueries({ queryKey: [...qualityKeys.feedbacks(), data.id] });
      toast.success('Feedback survey updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update feedback survey');
    },
  });
}
