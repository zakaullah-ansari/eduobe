'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  useConversations,
  useConversationMessages,
  useSendChatMessage,
  useStartConversation,
  useSubmitChatFeedback,
} from '@/services/ai-chatbot.service';

interface LocalMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
  model?: string;
  latencyMs?: number;
}

export default function AiChatbotPage() {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  const [showPrompts, setShowPrompts] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations } = useConversations();
  const { data: history, isFetched } = useConversationMessages(activeConversationId ?? '');
  const startConversation = useStartConversation();
  const sendMessage = useSendChatMessage();
  const feedback = useSubmitChatFeedback();

  const suggestedPrompts = [
    'What is my attendance percentage?',
    'When is my next assessment?',
    'How do I track my CGPA?',
    'What placements are available?',
  ];

  // Load message history when a conversation is selected
  useEffect(() => {
    if (isFetched && activeConversationId && history) {
      setMessages(
        history.map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          model: m.metadata?.model,
          latencyMs: m.latencyMs,
        })),
      );
    }
  }, [history, isFetched, activeConversationId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || sendMessage.isPending) return;

    setInput('');
    setShowPrompts(false);
    const userMessage: LocalMessage = { id: `u-${Date.now()}`, role: 'user', content: text };
    const pendingMessage: LocalMessage = { id: `a-${Date.now()}`, role: 'assistant', content: '', pending: true };
    setMessages((prev) => [...prev, userMessage, pendingMessage]);

    let conversationId = activeConversationId;
    if (!conversationId) {
      try {
        const conversation = await startConversation.mutateAsync({ topic: 'general' });
        conversationId = conversation.id;
        setActiveConversationId(conversation.id);
      } catch {
        // continue without a persisted conversation
      }
    }

    sendMessage.mutate(
      { message: text, conversationId },
      {
        onSuccess: (data) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === pendingMessage.id
                ? {
                    ...m,
                    content: data.answer || 'I could not process that. Please try again.',
                    pending: false,
                    model: data.model,
                    latencyMs: data.latencyMs,
                  }
                : m,
            ),
          );
          if (data.conversation) setActiveConversationId(data.conversation.id);
        },
        onError: () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === pendingMessage.id
                ? { ...m, content: 'The AI service is temporarily unavailable. Please try again later.', pending: false }
                : m,
            ),
          );
        },
      },
    );
  };

  const handleFeedback = (messageId: string, type: 'helpful' | 'not_helpful') => {
    feedback.mutate({ messageId, feedbackType: type });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Chatbot</h1>
        <p className="text-muted-foreground">
          Conversational assistant for students, faculty, and administrators.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Conversation list */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Conversations</CardTitle>
            <CardDescription>Your recent AI chats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {conversations?.length ? (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setActiveConversationId(conversation.id)}
                  className={cn(
                    'w-full rounded-md border px-3 py-2 text-left text-sm transition-colors',
                    activeConversationId === conversation.id
                      ? 'border-primary bg-primary/10'
                      : 'hover:bg-accent',
                  )}
                >
                  <div className="flex items-center gap-2 font-medium">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {conversation.title || conversation.topic || 'General'}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{conversation.messageCount} messages</span>
                    <Badge variant="outline">{conversation.status}</Badge>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No conversations yet. Start chatting!</p>
            )}
          </CardContent>
        </Card>

        {/* Chat window */}
        <Card className="flex h-[620px] flex-col lg:col-span-3">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-5 w-5 text-primary" />
              EduOBE Assistant
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" /> Powered by the EduOBE AI microservice
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col gap-3 overflow-hidden p-0">
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.length === 0 && !sendMessage.isPending && (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <Bot className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Ask me anything about your academics</p>
                    <p className="text-sm text-muted-foreground">
                      Attendance, marks, syllabus, timetable, placements, fees…
                    </p>
                  </div>
                  {showPrompts && (
                    <div className="grid max-w-md gap-2 sm:grid-cols-2">
                      {suggestedPrompts.map((prompt) => (
                        <Button key={prompt} variant="outline" onClick={() => handleSend(prompt)}>
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-4 py-2.5 text-sm',
                      message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted',
                    )}
                  >
                    {message.pending ? (
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Thinking…
                      </span>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.role === 'assistant' && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            {message.model && <Badge variant="secondary">{message.model}</Badge>}
                            {message.latencyMs != null && <span>{message.latencyMs}ms</span>}
                            <div className="ml-auto flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleFeedback(message.id, 'helpful')}
                              >
                                <ThumbsUp className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleFeedback(message.id, 'not_helpful')}
                              >
                                <ThumbsDown className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4">
              <div className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your question…"
                  className="min-h-[52px] resize-none"
                  rows={3}
                />
                <Button size="icon" className="h-[52px] w-[52px]" onClick={() => handleSend()} disabled={!input.trim() || sendMessage.isPending}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
