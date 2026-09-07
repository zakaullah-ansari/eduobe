'use client';

import { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useGenerateContent } from '@/services/ai-content-generation.service';

const CONTENT_TYPES = [
  'lesson_plan',
  'quiz',
  'notes',
  'assignment',
  'question_paper',
  'mooc',
  'case_study',
  'study_guide',
  'rubric',
] as const;

export default function AiContentGenerationPage() {
  const [contentType, setContentType] = useState<string>('lesson_plan');
  const [topic, setTopic] = useState('');
  const [courseName, setCourseName] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [copied, setCopied] = useState<string | null>(null);
  const generate = useGenerateContent();

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error('Enter a topic to generate content');
      return;
    }
    generate.mutate({
      contentType,
      prompt: topic.trim(),
      topic: topic.trim(),
      courseName: courseName.trim() || undefined,
      difficulty,
      count: 1,
    });
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Generation</h1>
        <p className="text-muted-foreground">Generate lesson plans, quizzes, notes, and more with AI.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" /> Content Studio
          </CardTitle>
          <CardDescription>Describe the topic; the AI produces structured academic content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Content Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                {CONTENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Difficulty</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Data Structures" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="course">Course Name (optional)</Label>
              <Input id="course" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="CS-201" />
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={generate.isPending}>
            {generate.isPending ? 'Generating…' : 'Generate Content'}
          </Button>
        </CardContent>
      </Card>

      {generate.data && (
        <Card className="border-primary/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              Result <Badge variant="secondary">{generate.data.model}</Badge>
            </CardTitle>
            <CardDescription>{generate.data.contentType} · {generate.data.topic}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generate.data.items.map((item, index) => (
              <div key={index} className="relative rounded-md border p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => handleCopy(item, `item-${index}`)}
                >
                  {copied === `item-${index}` ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
                <pre className="whitespace-pre-wrap font-sans text-sm">{item}</pre>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
