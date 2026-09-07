import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface CourseRecommendation {
  id: string;
  studentId: string;
  courseId?: string;
  recommendedCourseIds?: any;
  reason?: string;
  score?: number;
  model?: string;
  source?: string;
  status: string;
  consumedAt?: string;
  createdAt: string;
}

export interface GenerateRecommendationsDto {
  studentId: string;
  courseId?: string;
  interests?: string[];
  completedCourseIds?: string[];
  limit?: number;
  payload?: Record<string, any>;
}

export interface RecommendationResult {
  recommendations: Array<{
    courseId?: string;
    name: string;
    score: number;
    reason: string;
    rank: number;
  }>;
  model: string;
  usage?: { inputTokens: number; outputTokens: number };
}

export interface RecommendationFeedbackDto {
  recommendationId: string;
  feedback: string;
  rating?: number;
}

export const aiRecommenderKeys = {
  all: ['ai-recommender'] as const,
  lists: () => [...aiRecommenderKeys.all, 'list'] as const,
  list: (filters?: any) => [...aiRecommenderKeys.lists(), filters] as const,
};

export function useRecommendations(filters?: any) {
  return useQuery({
    queryKey: aiRecommenderKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/ai/recommender', { params: filters });
      return response.data.data as CourseRecommendation[];
    },
  });
}

export function useGenerateRecommendations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GenerateRecommendationsDto) => {
      const response = await apiClient.post('/ai/recommender/generate', data);
      return response.data.data as RecommendationResult & { record: CourseRecommendation };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiRecommenderKeys.lists() });
      toast.success('Recommendations generated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate recommendations');
    },
  });
}

export function useUpdateRecommendationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.patch(`/ai/recommender/${id}`, { status });
      return response.data.data as CourseRecommendation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiRecommenderKeys.lists() });
      toast.success('Recommendation updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update recommendation');
    },
  });
}

export function useSubmitRecommendationFeedback() {
  return useMutation({
    mutationFn: async (data: RecommendationFeedbackDto) => {
      const response = await apiClient.post('/ai/recommendation-feedback', data);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Feedback recorded');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record feedback');
    },
  });
}
