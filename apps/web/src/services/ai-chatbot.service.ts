import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

// Types
export interface StartConversationDto {
  topic?: string;
  context?: Record<string, any>;
}

export interface ChatDto {
  conversationId?: string;
  message: string;
  context?: Record<string, any>;
}

export interface ChatFeedbackDto {
  messageId: string;
  feedbackType?: string;
  rating?: number;
  comment?: string;
}

export interface ChatResponse {
  answer: string;
  model: string;
  suggestedPrompts: string[];
  metadata: Record<string, any>;
  usage: { inputTokens: number; outputTokens: number };
  latencyMs: number;
}

export interface AIConversation {
  id: string;
  title?: string;
  topic?: string;
  context?: Record<string, any>;
  status: string;
  messageCount: number;
  lastMessageAt?: string;
  createdAt: string;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens?: number;
  latencyMs?: number;
  metadata?: Record<string, any>;
  createdAt: string;
}

// Query keys
export const aiChatbotKeys = {
  all: ['ai-chatbot'] as const,
  conversations: (params?: any) => [...aiChatbotKeys.all, 'conversations', params] as const,
  messages: (conversationId: string) => [...aiChatbotKeys.all, 'messages', conversationId] as const,
};

export function useConversations(params?: any) {
  return useQuery({
    queryKey: aiChatbotKeys.conversations(params),
    queryFn: async () => {
      const response = await apiClient.get('/ai/chatbot/conversations', { params });
      return response.data.data as AIConversation[];
    },
  });
}

export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: aiChatbotKeys.messages(conversationId),
    queryFn: async () => {
      const response = await apiClient.get(`/ai/chatbot/conversations/${conversationId}/messages`);
      return response.data.data as AIMessage[];
    },
    enabled: !!conversationId,
  });
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: StartConversationDto) => {
      const response = await apiClient.post('/ai/chatbot/start', data);
      return response.data.data as AIConversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiChatbotKeys.conversations() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start conversation');
    },
  });
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ChatDto) => {
      const response = await apiClient.post('/ai/chatbot/chat', data);
      return response.data.data as ChatResponse & { conversation: AIConversation };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: aiChatbotKeys.conversations() });
      if (data.conversation) {
        queryClient.invalidateQueries({ queryKey: aiChatbotKeys.messages(data.conversation.id) });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send message');
    },
  });
}

export function useSubmitChatFeedback() {
  return useMutation({
    mutationFn: async (data: ChatFeedbackDto) => {
      const response = await apiClient.post('/ai/chatbot/feedback', data);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Feedback submitted. Thank you!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    },
  });
}
