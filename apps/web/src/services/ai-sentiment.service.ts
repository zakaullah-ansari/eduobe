import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface SentimentAnalysis {
  id: string;
  courseOfferingId?: string;
  source: string;
  sourceId?: string;
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  score: number;
  confidence: number;
  keywords?: any;
  summary?: string;
  analyzedAt: string;
}

export interface AnalyzeSentimentDto {
  texts?: string[];
  text?: string;
  courseOfferingId?: string;
  source?: string;
  sourceId?: string;
}

export interface SentimentResult {
  results: Array<{
    text: string;
    sentiment: string;
    score: number;
    confidence: number;
    keywords: string[];
  }>;
  distribution: Record<string, number>;
  summary?: string;
  model: string;
  usage: { inputTokens: number; outputTokens: number };
}

export const aiSentimentKeys = {
  all: ['ai-sentiment'] as const,
  lists: () => [...aiSentimentKeys.all, 'list'] as const,
  list: (filters?: any) => [...aiSentimentKeys.lists(), filters] as const,
};

export function useSentimentAnalyses(filters?: any) {
  return useQuery({
    queryKey: aiSentimentKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/ai/sentiment', { params: filters });
      return response.data.data as SentimentAnalysis[];
    },
  });
}

export function useAnalyzeSentiment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AnalyzeSentimentDto) => {
      const response = await apiClient.post('/ai/sentiment/analyze', data);
      return response.data.data as SentimentResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiSentimentKeys.lists() });
      toast.success('Sentiment analysis complete');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Sentiment analysis failed');
    },
  });
}
