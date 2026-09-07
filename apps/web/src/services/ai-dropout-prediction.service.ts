import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface DropoutPrediction {
  id: string;
  studentId: string;
  courseOfferingId?: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors?: any;
  intervention?: any;
  model?: string;
  modelVersion?: string;
  predictedAt: string;
  status: string;
}

export interface AtRiskStudent {
  id: string;
  studentId: string;
  courseOfferingId?: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons?: any;
  attendancePercent?: number;
  marksAverage?: number;
  status: string;
  interventionPlan?: any;
  lastEvaluatedAt: string;
}

export interface PredictDropoutDto {
  studentId: string;
  courseOfferingId?: string;
  attendancePercent?: number;
  marksAverage?: number;
  previousSemestersFailed?: number;
  assignmentsCompletedPercent?: number;
  engagementScore?: number;
  features?: Record<string, number>;
}

export interface PredictionResult {
  riskScore: number;
  riskLevel: string;
  probability: number;
  factors: Array<{ feature: string; value: any; impact: string }>;
  interventions: string[];
  model: string;
  modelVersion: string;
  usage: { inputTokens: number; outputTokens: number };
}

export const aiDropoutKeys = {
  all: ['ai-dropout'] as const,
  lists: () => [...aiDropoutKeys.all, 'list'] as const,
  list: (filters?: any) => [...aiDropoutKeys.lists(), filters] as const,
  atRisk: (filters?: any) => [...aiDropoutKeys.all, 'at-risk', filters] as const,
};

export function usePredictions(filters?: any) {
  return useQuery({
    queryKey: aiDropoutKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/ai/dropout-prediction', { params: filters });
      return response.data.data as DropoutPrediction[];
    },
  });
}

export function useAtRiskStudents(filters?: any) {
  return useQuery({
    queryKey: aiDropoutKeys.atRisk(filters),
    queryFn: async () => {
      const response = await apiClient.get('/ai/at-risk', { params: filters });
      return response.data.data as AtRiskStudent[];
    },
  });
}

export function usePredictDropout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PredictDropoutDto) => {
      const response = await apiClient.post('/ai/dropout-prediction/predict', data);
      return response.data.data as PredictionResult & { record: DropoutPrediction };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiDropoutKeys.lists() });
      queryClient.invalidateQueries({ queryKey: aiDropoutKeys.atRisk() });
      toast.success('Risk prediction complete');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Prediction failed');
    },
  });
}

export function useRefreshAtRisk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PredictDropoutDto) => {
      const response = await apiClient.post('/ai/at-risk/refresh', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiDropoutKeys.atRisk() });
      toast.success('At-risk list refreshed');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Refresh failed');
    },
  });
}
