'use client';

import { useState } from 'react';
import { Sparkles, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnalyzeSentiment, useSentimentAnalyses } from '@/services/ai-sentiment.service';

const sentimentColors: Record<string, string> = {
  positive: 'bg-green-500',
  neutral: 'bg-yellow-500',
  negative: 'bg-red-500',
  mixed: 'bg-blue-500',
};

const sentimentLabels: Record<string, string> = {
  positive: 'bg-green-100 text-green-800',
  neutral: 'bg-yellow-100 text-yellow-800',
  negative: 'bg-red-100 text-red-800',
  mixed: 'bg-blue-100 text-blue-800',
};

export default function AiSentimentPage() {
  const [text, setText] = useState('');
  const [courseOfferingId, setCourseOfferingId] = useState('');
  const analyze = useAnalyzeSentiment();
  const { data: history } = useSentimentAnalyses();

  const handleAnalyze = () => {
    if (!text.trim()) return;
    analyze.mutate({
      text: text.trim(),
      source: 'feedback',
      courseOfferingId: courseOfferingId.trim() || undefined,
    });
  };

  const distribution = analyze.data?.distribution ?? {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sentiment Analysis</h1>
        <p className="text-muted-foreground">Understand student feedback, surveys, and reviews.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" /> Analyze Text
            </CardTitle>
            <CardDescription>Paste feedback comments or a survey response.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="The course was engaging but the lab sessions felt rushed…"
              rows={6}
            />
            <div className="flex gap-2">
              <Button onClick={handleAnalyze} disabled={!text.trim() || analyze.isPending}>
                {analyze.isPending ? 'Analyzing…' : 'Analyze Sentiment'}
              </Button>
            </div>

            {analyze.data && (
              <div className="mt-4 space-y-3 rounded-md border p-4">
                {analyze.data.results.map((r, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={sentimentLabels[r.sentiment] ?? 'bg-muted'}>{r.sentiment}</Badge>
                      <span className="text-xs text-muted-foreground">
                        score {r.score} · confidence {(r.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    {r.keywords?.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Keywords: {r.keywords.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
                {analyze.data.summary && (
                  <p className="border-t pt-2 text-sm italic">{analyze.data.summary}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="h-4 w-4 text-primary" /> Distribution
            </CardTitle>
            <CardDescription>Overall sentiment breakdown of the latest analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(distribution).length ? (
              <div className="space-y-3">
                {Object.entries(distribution).map(([label, count]) => {
                  const total = Object.values(distribution).reduce((a, b) => Number(a) + Number(b), 0) || 1;
                  const pct = (Number(count) / Number(total)) * 100;
                  return (
                    <div key={label} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{label}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted">
                        <div className={`h-2.5 rounded-full ${sentimentColors[label] ?? 'bg-muted-foreground'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Run an analysis to see the distribution.</p>
            )}

            <div className="mt-6 border-t pt-4">
              <h3 className="mb-2 text-sm font-medium">Recent analyses</h3>
              {history?.length ? (
                <div className="space-y-2">
                  {history.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                      <span className="truncate">{item.text.slice(0, 60)}…</span>
                      <Badge className={sentimentLabels[item.sentiment]}>{item.sentiment}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No prior analyses.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
