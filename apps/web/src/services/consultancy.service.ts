import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface ConsultancyProject {
  id: string;
  title: string;
  client: string;
  description?: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: 'ongoing' | 'completed' | 'cancelled' | 'proposed';
  type: 'technical' | 'management' | 'research' | 'training' | 'other';
  principalConsultant?: string;
  coConsultants?: string[];
  departmentId?: string;
  deliverables?: string[];
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface ConsultancyClient {
  id: string;
  name: string;
  industry: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  _count?: {
    projects: number;
  };
}

export interface CreateProjectDto {
  title: string;
  client: string;
  description?: string;
  startDate: string;
  endDate: string;
  amount: number;
  type: 'technical' | 'management' | 'research' | 'training' | 'other';
  principalConsultant?: string;
  coConsultants?: string[];
  departmentId?: string;
  deliverables?: string[];
  remarks?: string;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {
  status?: 'ongoing' | 'completed' | 'cancelled' | 'proposed';
}

export interface CreateClientDto {
  name: string;
  industry: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {
  status?: 'active' | 'inactive';
}

export const consultancyKeys = {
  all: ['consultancy'] as const,
  projects: () => [...consultancyKeys.all, 'projects'] as const,
  project: (filters: any) => [...consultancyKeys.projects(), filters] as const,
  clients: () => [...consultancyKeys.all, 'clients'] as const,
  client: (filters: any) => [...consultancyKeys.clients(), filters] as const,
};

export function useConsultancyProjects(filters?: any) {
  return useQuery({
    queryKey: consultancyKeys.project(filters),
    queryFn: async () => {
      const response = await apiClient.get('/consultancy/projects', { params: filters });
      return response.data.data as ConsultancyProject[];
    },
  });
}

export function useConsultancyProject(id: string) {
  return useQuery({
    queryKey: [...consultancyKeys.projects(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/consultancy/projects/${id}`);
      return response.data.data as ConsultancyProject;
    },
    enabled: !!id,
  });
}

export function useConsultancyClients(filters?: any) {
  return useQuery({
    queryKey: consultancyKeys.client(filters),
    queryFn: async () => {
      const response = await apiClient.get('/consultancy/clients', { params: filters });
      return response.data.data as ConsultancyClient[];
    },
  });
}

export function useCreateConsultancyProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectDto) => {
      const response = await apiClient.post('/consultancy/projects', data);
      return response.data.data as ConsultancyProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultancyKeys.projects() });
      toast.success('Consultancy project created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    },
  });
}

export function useUpdateConsultancyProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectDto }) => {
      const response = await apiClient.patch(`/consultancy/projects/${id}`, data);
      return response.data.data as ConsultancyProject;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: consultancyKeys.projects() });
      queryClient.invalidateQueries({ queryKey: [...consultancyKeys.projects(), data.id] });
      toast.success('Project updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update project');
    },
  });
}

export function useDeleteConsultancyProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/consultancy/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultancyKeys.projects() });
      toast.success('Project deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    },
  });
}

export function useCreateConsultancyClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClientDto) => {
      const response = await apiClient.post('/consultancy/clients', data);
      return response.data.data as ConsultancyClient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultancyKeys.clients() });
      toast.success('Client added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add client');
    },
  });
}

export function useUpdateConsultancyClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateClientDto }) => {
      const response = await apiClient.patch(`/consultancy/clients/${id}`, data);
      return response.data.data as ConsultancyClient;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: consultancyKeys.clients() });
      queryClient.invalidateQueries({ queryKey: [...consultancyKeys.clients(), data.id] });
      toast.success('Client updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update client');
    },
  });
}
