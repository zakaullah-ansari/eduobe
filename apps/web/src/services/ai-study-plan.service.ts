import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface PersonalizedStudyPlan {
  id: string;
  studentId?: string;
  programId?: string;
  courseId?: string;
  title: string;
  weekRange?: string;
  schedule?: any;
  tasks?: any;
  status: string;
  generatedBy?: string;
  createdAt: string;
}

export interface StudyPlanDto {
  studentId?: string;
  courseId?: string;
  topics?: string[];
  hoursPerWeek?: number;
  weeks?: number;
  priorityTopics?: string[];
  goal?: string;
  title?: string;
}

export interface StudyPlanResult {
  plan: Array<{
    week: number;
    goal: string;
    tasks: Array<{ topic: string; phase: string; hours: number; activity: string; priority: boolean; milestone: string }>;
  }>;
  summary: Record<string, any>;
  scheduleSuggestion: string[];
  model: string;
}

export interface SkillGapAnalysis {
  id: string;
  studentId?: string;
  title: string;
  detectedSkills?: any;
  missingSkills?: any;
  suggestions?: any;
  score?: number;
  status: string;
  analyzedAt: string;
}

export interface LearningPath {
  id: string;
  studentId?: string;
  programId?: string;
  title: string;
  description?: string;
  goal?: string;
  durationWeeks?: number;
  difficulty: string;
  status: string;
  model?: string;
  createdAt: string;
}

export const aiStudyPlanKeys = {
  all: ['ai-study-plan'] as const,
  plans: (filters?: any) => [...aiStudyPlanKeys.all, 'plans', filters] as const,
  paths: (filters?: any) => [...aiStudyPlanKeys.all, 'paths', filters] as const,
  skills: (filters?: any) => [...aiStudyPlanKeys.all, 'skills', filters] as const,
};

export function useStudyPlans(filters?: any) {
  return useQuery({
    queryKey: aiStudyPlanKeys.plans(filters),
    queryFn: async () => {
      const response = await apiClient.get('/ai/study-plans', { params: filters });
      return response.data.data as PersonalizedStudyPlan[];
    },
  });
}

export function useLearningPaths(filters?: any) {
  return useQuery({
    queryKey: aiStudyPlanKeys.paths(filters),
    queryFn: async () => {
      const response = await apiClient.get('/ai/learning-paths', { params: filters });
      return response.data.data as LearningPath[];
    },
  });
}

export function useSkillGapAnalyses(filters?: any) {
  return useQuery({
    queryKey: aiStudyPlanKeys.skills(filters),
    queryFn: async () => {
      const response = await apiClient.get('/ai/skill-gaps', { params: filters });
      return response.data.data as SkillGapAnalysis[];
    },
  });
}

export function useGenerateStudyPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: StudyPlanDto) => {
      const response = await apiClient.post('/ai/study-plans/generate', data);
      return response.data.data as StudyPlanResult & { record: PersonalizedStudyPlan };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiStudyPlanKeys.plans() });
      toast.success('Study plan generated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate study plan');
    },
  });
}

export function useGenerateLearningPath() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      goal?: string;
      currentLevel?: string;
      targetLevel?: string;
      availableCourses?: Array<Record<string, any>>;
      weeks?: number;
      studentId?: string;
    }) => {
      const response = await apiClient.post('/ai/learning-paths/generate', data);
      return response.data.data as { phases: any[]; roadmapSummary?: string; model?: string; record: LearningPath };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiStudyPlanKeys.paths() });
      toast.success('Learning path generated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate learning path');
    },
  });
}

export function useAnalyzeSkillGap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      studentId?: string;
      studentSkills: string[];
      targetSkills: string[];
      coursework?: string[];
      title?: string;
    }) => {
      const response = await apiClient.post('/ai/skill-gaps/analyze', data);
      return response.data.data as {
        detectedSkills: string[];
        missingSkills: string[];
        suggestions: string[];
        gapScore: number;
        coverage: number;
        record: SkillGapAnalysis;
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiStudyPlanKeys.skills() });
      toast.success('Skill gap analysis complete');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Skill gap analysis failed');
    },
  });
}
