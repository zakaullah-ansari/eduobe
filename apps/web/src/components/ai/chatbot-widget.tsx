'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Send, X, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSendChatMessage, useStartConversation } from '@/services/ai-chatbot.service';
import { cn } from '@/lib/utils';

interface WidgetMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
}

/**
 * Floating AI assistant widget available across the dashboard.
 * Mirrors the chatbot page but in a compact, always-available form.
 */
export function AiChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<WidgetMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hi! I am the EduOBE AI assistant. Ask me about attendance, marks, syllabus, placements, fees, or anything academic.',
    },
  ]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const startConversation = useStartConversation();
  const sendMessage = useSendChatMessage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sendMessage.isPending) return;

    setInput('');
    const userMessage: WidgetMessage = { id: `u-${Date.now()}`, role: 'user', content: text };
    const pendingMessage: WidgetMessage = { id: `a-${Date.now()}`, role: 'assistant', content: '', pending: true };
    setMessages((prev) => [...prev, userMessage, pendingMessage]);

    let activeConversationId = conversationId;
    if (!activeConversationId) {
      try {
        const conversation = await startConversation.mutateAsync({ topic: 'widget' });
        activeConversationId = conversation.id;
        setConversationId(conversation.id);
      } catch {
        // fall through: still attempt chat
      }
    }

    sendMessage.mutate(
      { message: text, conversationId: activeConversationId },
      {
        onSuccess: (data) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === pendingMessage.id
                ? { ...m, content: data.answer || 'No response received.', pending: false }
                : m,
            ),
          );
          if (data.conversation) {
            setConversationId(data.conversation.id);
          }
        },
        onError: () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === pendingMessage.id
                ? { ...m, content: 'The AI service is temporarily unavailable. Please try again shortly.', pending: false }
                : m,
            ),
          );
        },
      },
    );
  };

  return (
    <>
      {/* Launcher */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>

      {open && (
        <Card className="fixed bottom-24 right-6 z-50 flex h-[540px] w-[380px] flex-col shadow-2xl">
          <CardHeader className="border-b pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              EduOBE Assistant
            </CardTitle>
            <CardDescription className="text-xs">AI-powered academic help, 24/7</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3 overflow-hidden p-0">
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start',
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted',
                    )}
                  >
                    {message.pending ? (
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquare className="h-3 w-3 animate-pulse" /> Thinking…
                      </span>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-3">
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
                  placeholder="Ask a question…"
                  className="min-h-[44px] resize-none"
                  rows={2}
                />
                <Button size="icon" onClick={handleSend} disabled={!input.trim() || sendMessage.isPending}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
