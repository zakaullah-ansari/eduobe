import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface SummarizeDto {
  text: string;
  maxSentences?: number;
  bullet?: boolean;
  title?: string;
  courseId?: string;
}

export interface SummarizeResult {
  summary: string;
  sentences: number;
  originalWords: number;
  compression: number;
  model: string;
}

export function useSummarizeText() {
  return useMutation({
    mutationFn: async (data: SummarizeDto) => {
      const response = await apiClient.post('/ai/summarization/summarize', data);
      return response.data.data as SummarizeResult;
    },
    onSuccess: () => {
      toast.success('Summarized successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Summarization failed');
    },
  });
}
