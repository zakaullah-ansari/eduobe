'use client';

import { useState } from 'react';
import { AlertTriangle, Activity, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePredictDropout, usePredictions, useAtRiskStudents } from '@/services/ai-dropout-prediction.service';

const riskStyles: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const riskColors: Record<string, string> = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

export default function AiDropoutPage() {
  const [studentId, setStudentId] = useState('');
  const [attendance, setAttendance] = useState('85');
  const [marks, setMarks] = useState('65');
  const [previousFailures, setPreviousFailures] = useState('0');
  const [engagement, setEngagement] = useState('0.5');

  const predict = usePredictDropout();
  const { data: predictions } = usePredictions();
  const { data: atRisk } = useAtRiskStudents();

  const handlePredict = () => {
    if (!studentId.trim()) return;
    predict.mutate({
      studentId: studentId.trim(),
      attendancePercent: Number(attendance),
      marksAverage: Number(marks),
      previousSemestersFailed: Number(previousFailures),
      engagementScore: Number(engagement),
    });
  };

  const riskProbability = predict.data?.riskScore != null ? predict.data.riskScore * 100 : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dropout Prediction</h1>
        <p className="text-muted-foreground">
          Early warning system that flags students who may need intervention.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" /> Student Risk Check
            </CardTitle>
            <CardDescription>Infer risk from academic signals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="student">Student ID</Label>
              <Input id="student" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="stu_…" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Attendance %</Label>
                <Input value={attendance} onChange={(e) => setAttendance(e.target.value)} type="number" min={0} max={100} />
              </div>
              <div className="space-y-1.5">
                <Label>Avg Marks %</Label>
                <Input value={marks} onChange={(e) => setMarks(e.target.value)} type="number" min={0} max={100} />
              </div>
              <div className="space-y-1.5">
                <Label>Previous Failures</Label>
                <Input value={previousFailures} onChange={(e) => setPreviousFailures(e.target.value)} type="number" min={0} />
              </div>
              <div className="space-y-1.5">
                <Label>Engagement</Label>
                <Input value={engagement} onChange={(e) => setEngagement(e.target.value)} type="number" step={0.1} min={0} max={1} />
              </div>
            </div>
            <Button className="w-full" onClick={handlePredict} disabled={!studentId.trim() || predict.isPending}>
              {predict.isPending ? 'Predicting…' : 'Predict Risk'}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-primary" /> Prediction Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            {predict.data ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative h-32 w-32">
                    <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" strokeWidth="10" className="stroke-muted" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        strokeWidth="10"
                        strokeLinecap="round"
                        className={riskColors[predict.data.riskLevel] ?? 'stroke-muted-foreground'}
                        strokeDasharray={`${(riskProbability ?? 0) * 2.64} 264`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{riskProbability?.toFixed(0)}%</span>
                      <Badge className={riskStyles[predict.data.riskLevel] ?? ''}>{predict.data.riskLevel}</Badge>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Model: {predict.data.model} v{predict.data.modelVersion}
                    </p>
                    <h3 className="text-sm font-medium">Risk factors</h3>
                    {predict.data.factors.map((factor, i) => (
                      <div key={i} className="rounded-md border p-2 text-sm">
                        <span className="font-medium capitalize">{factor.feature.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-muted-foreground"> — {factor.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="mb-2 text-sm font-medium">Suggested interventions</h3>
                  <ul className="space-y-1.5">
                    {predict.data.interventions.map((intervention, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                        {intervention}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Run a prediction to see an early-warning assessment.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">At-Risk Students</CardTitle>
            <CardDescription>Students currently flagged for intervention.</CardDescription>
          </CardHeader>
          <CardContent>
            {atRisk?.length ? (
              <div className="space-y-2">
                {atRisk.map((student) => (
                  <div key={student.id} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{student.studentId}</p>
                      <p className="text-xs text-muted-foreground">
                        Attendance {student.attendancePercent ?? '—'}% · Marks {student.marksAverage ?? '—'}%
                      </p>
                    </div>
                    <Badge className={riskStyles[student.riskLevel]}>{student.riskLevel}</Badge>
                    <span className="text-xs text-muted-foreground">{(student.riskScore * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No students flagged right now.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Prediction History</CardTitle>
          </CardHeader>
          <CardContent>
            {predictions?.length ? (
              <div className="space-y-2">
                {predictions.slice(0, 8).map((prediction) => (
                  <div key={prediction.id} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{prediction.studentId}</p>
                      <p className="text-xs text-muted-foreground">{new Date(prediction.predictedAt).toLocaleString()}</p>
                    </div>
                    <Badge className={riskStyles[prediction.riskLevel]}>{prediction.riskLevel}</Badge>
                    <Badge variant="outline">{prediction.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No predictions yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
