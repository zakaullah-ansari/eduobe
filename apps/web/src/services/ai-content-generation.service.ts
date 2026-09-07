import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface GeneratedContent {
  id: string;
  requestId?: string;
  courseId?: string;
  contentType: string;
  title?: string;
  content: string;
  format: string;
  tokens?: number;
  model?: string;
  status: string;
  createdAt: string;
}

export interface GenerateContentDto {
  contentType: string;
  prompt: string;
  title?: string;
  topic?: string;
  courseId?: string;
  courseName?: string;
  difficulty?: string;
  count?: number;
  parameters?: Record<string, any>;
}

export interface ContentResult {
  items: string[];
  contentType: string;
  topic: string;
  model: string;
  usage: { inputTokens: number; outputTokens: number };
  metadata: Record<string, any>;
}

export const aiContentKeys = {
  all: ['ai-content-generation'] as const,
  lists: () => [...aiContentKeys.all, 'list'] as const,
  list: (filters?: any) => [...aiContentKeys.lists(), filters] as const,
};

export function useGeneratedContents(filters?: any) {
  return useQuery({
    queryKey: aiContentKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/ai/content-generation', { params: filters });
      return response.data.data as GeneratedContent[];
    },
  });
}

export function useGenerateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GenerateContentDto) => {
      const response = await apiClient.post('/ai/content-generation/generate', data);
      return response.data.data as ContentResult & { record: GeneratedContent };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiContentKeys.lists() });
      toast.success('Content generated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Content generation failed');
    },
  });
}
