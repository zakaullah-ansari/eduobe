import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface InnovationProject {
  id: string;
  title: string;
  description?: string;
  studentTeam?: string[];
  facultyMentor?: string;
  category: 'product' | 'service' | 'process' | 'research' | 'social';
  stage: 'ideation' | 'prototype' | 'testing' | 'launch' | 'completed' | 'abandoned';
  startDate: string;
  endDate?: string;
  fundingAmount?: number;
  fundingSource?: string;
  departmentId?: string;
  achievements?: string[];
  patents?: number;
  publications?: number;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface Startup {
  id: string;
  name: string;
  description?: string;
  founders?: string[];
  industry: string;
  stage: 'idea' | 'pre-seed' | 'seed' | 'series_a' | 'series_b' | 'growth' | 'exit';
  incorporationDate?: string;
  website?: string;
  fundingRaised?: number;
  valuation?: number;
  incubationStatus: 'applied' | 'incubated' | 'graduated' | 'rejected';
  departmentId?: string;
  mentors?: string[];
  achievements?: string[];
  status: 'active' | 'inactive' | 'acquired' | 'closed';
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface InnovationChallenge {
  id: string;
  title: string;
  description?: string;
  organizer?: string;
  startDate: string;
  endDate: string;
  prizeAmount?: number;
  maxTeams?: number;
  eligibility?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  type: 'hackathon' | 'competition' | 'challenge' | 'workshop';
  departmentId?: string;
  winners?: string[];
  participants?: number;
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  _count?: {
    teams: number;
  };
}

export interface CreateProjectDto {
  title: string;
  description?: string;
  studentTeam?: string[];
  facultyMentor?: string;
  category: 'product' | 'service' | 'process' | 'research' | 'social';
  stage: 'ideation' | 'prototype' | 'testing' | 'launch' | 'completed' | 'abandoned';
  startDate: string;
  endDate?: string;
  fundingAmount?: number;
  fundingSource?: string;
  departmentId?: string;
  achievements?: string[];
  patents?: number;
  publications?: number;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {
  status?: 'active' | 'completed' | 'on_hold' | 'cancelled';
}

export interface CreateStartupDto {
  name: string;
  description?: string;
  founders?: string[];
  industry: string;
  stage: 'idea' | 'pre-seed' | 'seed' | 'series_a' | 'series_b' | 'growth' | 'exit';
  incorporationDate?: string;
  website?: string;
  fundingRaised?: number;
  valuation?: number;
  incubationStatus: 'applied' | 'incubated' | 'graduated' | 'rejected';
  departmentId?: string;
  mentors?: string[];
  achievements?: string[];
}

export interface UpdateStartupDto extends Partial<CreateStartupDto> {
  status?: 'active' | 'inactive' | 'acquired' | 'closed';
}

export interface CreateChallengeDto {
  title: string;
  description?: string;
  organizer?: string;
  startDate: string;
  endDate: string;
  prizeAmount?: number;
  maxTeams?: number;
  eligibility?: string;
  type: 'hackathon' | 'competition' | 'challenge' | 'workshop';
  departmentId?: string;
}

export interface UpdateChallengeDto extends Partial<CreateChallengeDto> {
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  winners?: string[];
  participants?: number;
}

export const innovationKeys = {
  all: ['innovation'] as const,
  projects: () => [...innovationKeys.all, 'projects'] as const,
  project: (filters: any) => [...innovationKeys.projects(), filters] as const,
  startups: () => [...innovationKeys.all, 'startups'] as const,
  startup: (filters: any) => [...innovationKeys.startups(), filters] as const,
  challenges: () => [...innovationKeys.all, 'challenges'] as const,
  challenge: (filters: any) => [...innovationKeys.challenges(), filters] as const,
};

export function useInnovationProjects(filters?: any) {
  return useQuery({
    queryKey: innovationKeys.project(filters),
    queryFn: async () => {
      const response = await apiClient.get('/innovation/projects', { params: filters });
      return response.data.data as InnovationProject[];
    },
  });
}

export function useInnovationProject(id: string) {
  return useQuery({
    queryKey: [...innovationKeys.projects(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/innovation/projects/${id}`);
      return response.data.data as InnovationProject;
    },
    enabled: !!id,
  });
}

export function useStartups(filters?: any) {
  return useQuery({
    queryKey: innovationKeys.startup(filters),
    queryFn: async () => {
      const response = await apiClient.get('/innovation/startups', { params: filters });
      return response.data.data as Startup[];
    },
  });
}

export function useInnovationChallenges(filters?: any) {
  return useQuery({
    queryKey: innovationKeys.challenge(filters),
    queryFn: async () => {
      const response = await apiClient.get('/innovation/challenges', { params: filters });
      return response.data.data as InnovationChallenge[];
    },
  });
}

export function useCreateInnovationProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectDto) => {
      const response = await apiClient.post('/innovation/projects', data);
      return response.data.data as InnovationProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: innovationKeys.projects() });
      toast.success('Innovation project created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    },
  });
}

export function useUpdateInnovationProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectDto }) => {
      const response = await apiClient.patch(`/innovation/projects/${id}`, data);
      return response.data.data as InnovationProject;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: innovationKeys.projects() });
      queryClient.invalidateQueries({ queryKey: [...innovationKeys.projects(), data.id] });
      toast.success('Project updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update project');
    },
  });
}

export function useCreateStartup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStartupDto) => {
      const response = await apiClient.post('/innovation/startups', data);
      return response.data.data as Startup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: innovationKeys.startups() });
      toast.success('Startup registered successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to register startup');
    },
  });
}

export function useUpdateStartup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStartupDto }) => {
      const response = await apiClient.patch(`/innovation/startups/${id}`, data);
      return response.data.data as Startup;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: innovationKeys.startups() });
      queryClient.invalidateQueries({ queryKey: [...innovationKeys.startups(), data.id] });
      toast.success('Startup updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update startup');
    },
  });
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateChallengeDto) => {
      const response = await apiClient.post('/innovation/challenges', data);
      return response.data.data as InnovationChallenge;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: innovationKeys.challenges() });
      toast.success('Challenge created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create challenge');
    },
  });
}

export function useUpdateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateChallengeDto }) => {
      const response = await apiClient.patch(`/innovation/challenges/${id}`, data);
      return response.data.data as InnovationChallenge;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: innovationKeys.challenges() });
      queryClient.invalidateQueries({ queryKey: [...innovationKeys.challenges(), data.id] });
      toast.success('Challenge updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update challenge');
    },
  });
}
