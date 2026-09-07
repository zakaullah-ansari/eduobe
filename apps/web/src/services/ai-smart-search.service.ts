import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface SmartSearchQuery {
  id: string;
  query: string;
  filters?: any;
  results?: any;
  resultCount: number;
  score?: number;
  latencyMs?: number;
  engine?: string;
  status: string;
  createdAt: string;
}

export interface SmartSearchDto {
  query: string;
  filters?: Record<string, any>;
  index?: Array<Record<string, any>>;
  limit?: number;
}

export interface SmartSearchResult {
  results: Array<{
    id?: string;
    score: number;
    snippet: string;
    document: Record<string, any>;
  }>;
  query: string;
  expandedTerms: string[];
  engine: string;
  resultCount: number;
}

export const aiSearchKeys = {
  all: ['ai-smart-search'] as const,
  lists: () => [...aiSearchKeys.all, 'list'] as const,
  list: (filters?: any) => [...aiSearchKeys.lists(), filters] as const,
};

export function useSmartSearches(filters?: any) {
  return useQuery({
    queryKey: aiSearchKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/ai/smart-search', { params: filters });
      return response.data.data as SmartSearchQuery[];
    },
  });
}

export function useSmartSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SmartSearchDto) => {
      const response = await apiClient.post('/ai/smart-search/search', data);
      return response.data.data as SmartSearchResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiSearchKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Smart search failed');
    },
  });
}

export function useSubmitSearchFeedback() {
  return useMutation({
    mutationFn: async (data: { queryId?: string; resultId?: string; relevant?: boolean; rating?: number; comment?: string }) => {
      const response = await apiClient.post('/ai/search-feedback', data);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Search feedback recorded');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record feedback');
    },
  });
}
