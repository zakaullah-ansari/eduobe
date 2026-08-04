import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Publication {
  id: string;
  title: string;
  authors?: string[];
  journal?: string;
  conference?: string;
  year: number;
  doi?: string;
  url?: string;
  abstract?: string;
  type: 'journal' | 'conference' | 'book' | 'chapter' | 'patent' | 'other';
  category: 'scopus' | 'web_of_science' | 'scie' | 'sci' | 'esci' | 'peer_reviewed' | 'other';
  impactFactor?: number;
  citations?: number;
  facultyId?: string;
  departmentId?: string;
  status: 'published' | 'accepted' | 'submitted' | 'in_review' | 'rejected';
  publishedDate?: string;
  createdAt: string;
  updatedAt: string;
  faculty?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  department?: {
    id: string;
    name: string;
    code: string;
  };
  _count?: {
    citations: number;
  };
}

export interface ResearchProject {
  id: string;
  title: string;
  description?: string;
  principalInvestigator?: string;
  coInvestigators?: string[];
  fundingAgency?: string;
  grantAmount?: number;
  startDate: string;
  endDate: string;
  status: 'ongoing' | 'completed' | 'approved' | 'submitted' | 'rejected';
  type: 'government' | 'industry' | 'internal' | 'international';
  departmentId?: string;
  outcomes?: string[];
  publications?: number;
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  _count?: {
    publications: number;
    citations: number;
  };
}

export interface Grant {
  id: string;
  title: string;
  fundingAgency: string;
  amount: number;
  duration: number;
  startDate: string;
  endDate: string;
  principalInvestigator?: string;
  coInvestigators?: string[];
  status: 'applied' | 'approved' | 'rejected' | 'ongoing' | 'completed';
  type: 'government' | 'industry' | 'international' | 'internal';
  departmentId?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface CreatePublicationDto {
  title: string;
  authors?: string[];
  journal?: string;
  conference?: string;
  year: number;
  doi?: string;
  url?: string;
  abstract?: string;
  type: 'journal' | 'conference' | 'book' | 'chapter' | 'patent' | 'other';
  category: 'scopus' | 'web_of_science' | 'scie' | 'sci' | 'esci' | 'peer_reviewed' | 'other';
  impactFactor?: number;
  citations?: number;
  facultyId?: string;
  departmentId?: string;
  publishedDate?: string;
}

export interface UpdatePublicationDto extends Partial<CreatePublicationDto> {
  status?: 'published' | 'accepted' | 'submitted' | 'in_review' | 'rejected';
}

export interface CreateProjectDto {
  title: string;
  description?: string;
  principalInvestigator?: string;
  coInvestigators?: string[];
  fundingAgency?: string;
  grantAmount?: number;
  startDate: string;
  endDate: string;
  type: 'government' | 'industry' | 'internal' | 'international';
  departmentId?: string;
  outcomes?: string[];
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {
  status?: 'ongoing' | 'completed' | 'approved' | 'submitted' | 'rejected';
  publications?: number;
}

export interface CreateGrantDto {
  title: string;
  fundingAgency: string;
  amount: number;
  duration: number;
  startDate: string;
  endDate: string;
  principalInvestigator?: string;
  coInvestigators?: string[];
  type: 'government' | 'industry' | 'international' | 'internal';
  departmentId?: string;
  remarks?: string;
}

export interface UpdateGrantDto extends Partial<CreateGrantDto> {
  status?: 'applied' | 'approved' | 'rejected' | 'ongoing' | 'completed';
}

export const researchKeys = {
  all: ['research'] as const,
  publications: () => [...researchKeys.all, 'publications'] as const,
  publication: (filters: any) => [...researchKeys.publications(), filters] as const,
  projects: () => [...researchKeys.all, 'projects'] as const,
  project: (filters: any) => [...researchKeys.projects(), filters] as const,
  grants: () => [...researchKeys.all, 'grants'] as const,
  grant: (filters: any) => [...researchKeys.grants(), filters] as const,
};

export function usePublications(filters?: any) {
  return useQuery({
    queryKey: researchKeys.publication(filters),
    queryFn: async () => {
      const response = await apiClient.get('/research/publications', { params: filters });
      return response.data.data as Publication[];
    },
  });
}

export function usePublication(id: string) {
  return useQuery({
    queryKey: [...researchKeys.publications(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/research/publications/${id}`);
      return response.data.data as Publication;
    },
    enabled: !!id,
  });
}

export function useResearchProjects(filters?: any) {
  return useQuery({
    queryKey: researchKeys.project(filters),
    queryFn: async () => {
      const response = await apiClient.get('/research/projects', { params: filters });
      return response.data.data as ResearchProject[];
    },
  });
}

export function useResearchProject(id: string) {
  return useQuery({
    queryKey: [...researchKeys.projects(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/research/projects/${id}`);
      return response.data.data as ResearchProject;
    },
    enabled: !!id,
  });
}

export function useGrants(filters?: any) {
  return useQuery({
    queryKey: researchKeys.grant(filters),
    queryFn: async () => {
      const response = await apiClient.get('/research/grants', { params: filters });
      return response.data.data as Grant[];
    },
  });
}

export function useCreatePublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePublicationDto) => {
      const response = await apiClient.post('/research/publications', data);
      return response.data.data as Publication;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.publications() });
      toast.success('Publication added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add publication');
    },
  });
}

export function useUpdatePublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePublicationDto }) => {
      const response = await apiClient.patch(`/research/publications/${id}`, data);
      return response.data.data as Publication;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: researchKeys.publications() });
      queryClient.invalidateQueries({ queryKey: [...researchKeys.publications(), data.id] });
      toast.success('Publication updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update publication');
    },
  });
}

export function useDeletePublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/research/publications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.publications() });
      toast.success('Publication deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete publication');
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectDto) => {
      const response = await apiClient.post('/research/projects', data);
      return response.data.data as ResearchProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.projects() });
      toast.success('Research project created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectDto }) => {
      const response = await apiClient.patch(`/research/projects/${id}`, data);
      return response.data.data as ResearchProject;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: researchKeys.projects() });
      queryClient.invalidateQueries({ queryKey: [...researchKeys.projects(), data.id] });
      toast.success('Project updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update project');
    },
  });
}

export function useCreateGrant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGrantDto) => {
      const response = await apiClient.post('/research/grants', data);
      return response.data.data as Grant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.grants() });
      toast.success('Grant application created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create grant application');
    },
  });
}

export function useUpdateGrant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateGrantDto }) => {
      const response = await apiClient.patch(`/research/grants/${id}`, data);
      return response.data.data as Grant;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: researchKeys.grants() });
      queryClient.invalidateQueries({ queryKey: [...researchKeys.grants(), data.id] });
      toast.success('Grant updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update grant');
    },
  });
}
