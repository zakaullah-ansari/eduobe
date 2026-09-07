'use client';

import { useState } from 'react';
import { Sparkles, BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  useRecommendations,
  useGenerateRecommendations,
  useUpdateRecommendationStatus,
} from '@/services/ai-recommender.service';

export default function AiRecommendationsPage() {
  const [studentId, setStudentId] = useState('');
  const [interests, setInterests] = useState('');
  const { data: recommendations, isLoading } = useRecommendations();
  const generate = useGenerateRecommendations();
  const updateStatus = useUpdateRecommendationStatus();

  const handleGenerate = () => {
    if (!studentId.trim()) {
      toast.error('Enter a student ID to generate recommendations');
      return;
    }
    generate.mutate({
      studentId: studentId.trim(),
      interests: interests.split(',').map((s) => s.trim()).filter(Boolean),
      limit: 5,
    });
  };

  const handleStatus = (id: string, status: string) => {
    updateStatus.mutate({ id, status });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Course Recommendations</h1>
        <p className="text-muted-foreground">Personalized course suggestions powered by AI.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" /> Generate Recommendations
          </CardTitle>
          <CardDescription>Recommend courses based on interests and academic history.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="student">Student ID</Label>
            <Input id="student" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="stu_…" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="interests">Interests (comma separated)</Label>
            <Input
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="AI, Machine Learning, Cloud"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleGenerate} disabled={generate.isPending} className="w-full">
              {generate.isPending ? 'Generating…' : 'Generate'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generate.data && (
        <Card className="border-primary/40">
          <CardHeader>
            <CardTitle className="text-base">New Recommendations</CardTitle>
            <CardDescription>Model: {generate.data.model}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {generate.data.recommendations.map((rec) => (
              <div key={`${rec.courseId}-${rec.rank}`} className="flex items-center gap-3 rounded-md border p-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{rec.name}</p>
                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                </div>
                <Badge variant={rec.score > 0.5 ? 'default' : 'secondary'}>{(rec.score * 100).toFixed(0)}% match</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommendation History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : recommendations?.length ? (
            <div className="space-y-2">
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-center gap-3 rounded-md border p-3">
                  <div className="flex-1">
                    <p className="font-medium">{rec.reason || `Student ${rec.studentId}`}</p>
                    <p className="text-sm text-muted-foreground">
                      {rec.model || 'model unknown'} · {new Date(rec.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">{rec.status}</Badge>
                  {rec.status === 'pending' && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Accept"
                        onClick={() => handleStatus(rec.id, 'accepted')}
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Dismiss"
                        onClick={() => handleStatus(rec.id, 'dismissed')}
                      >
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recommendations recorded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
