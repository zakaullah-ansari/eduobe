import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Accreditation {
  id: string;
  type: 'nba' | 'naac' | 'nirf' | 'aicte' | 'other';
  title: string;
  description?: string;
  applicationDate?: string;
  visitDate?: string;
  reportDate?: string;
  status: 'planned' | 'application_submitted' | 'under_review' | 'visit_scheduled' | 'completed' | 'accredited' | 'not_accredited';
  grade?: string;
  score?: number;
  validityPeriod?: string;
  criteria?: any[];
  documents?: string[];
  departmentId?: string;
  programId?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  program?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface AccreditationCriteria {
  id: string;
  accreditationId: string;
  criteriaNumber: string;
  title: string;
  description?: string;
  weightage?: number;
  score?: number;
  maxScore?: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'verified';
  evidence?: string[];
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccreditationDto {
  type: 'nba' | 'naac' | 'nirf' | 'aicte' | 'other';
  title: string;
  description?: string;
  applicationDate?: string;
  visitDate?: string;
  reportDate?: string;
  grade?: string;
  score?: number;
  validityPeriod?: string;
  departmentId?: string;
  programId?: string;
  remarks?: string;
}

export interface UpdateAccreditationDto extends Partial<CreateAccreditationDto> {
  status?: 'planned' | 'application_submitted' | 'under_review' | 'visit_scheduled' | 'completed' | 'accredited' | 'not_accredited';
  criteria?: any[];
  documents?: string[];
}

export interface CreateCriteriaDto {
  accreditationId: string;
  criteriaNumber: string;
  title: string;
  description?: string;
  weightage?: number;
  score?: number;
  maxScore?: number;
  evidence?: string[];
  remarks?: string;
}

export interface UpdateCriteriaDto extends Partial<CreateCriteriaDto> {
  status?: 'not_started' | 'in_progress' | 'completed' | 'verified';
}

export const accreditationKeys = {
  all: ['accreditations'] as const,
  lists: () => [...accreditationKeys.all, 'list'] as const,
  list: (filters: any) => [...accreditationKeys.lists(), filters] as const,
  details: () => [...accreditationKeys.all, 'detail'] as const,
  detail: (id: string) => [...accreditationKeys.details(), id] as const,
  criteria: (accreditationId: string) => [...accreditationKeys.all, 'criteria', accreditationId] as const,
};

export function useAccreditations(filters?: any) {
  return useQuery({
    queryKey: accreditationKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/accreditations', { params: filters });
      return response.data.data as Accreditation[];
    },
  });
}

export function useAccreditation(id: string) {
  return useQuery({
    queryKey: accreditationKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/accreditations/${id}`);
      return response.data.data as Accreditation;
    },
    enabled: !!id,
  });
}

export function useAccreditationCriteria(accreditationId: string) {
  return useQuery({
    queryKey: accreditationKeys.criteria(accreditationId),
    queryFn: async () => {
      const response = await apiClient.get(`/accreditations/${accreditationId}/criteria`);
      return response.data.data as AccreditationCriteria[];
    },
    enabled: !!accreditationId,
  });
}

export function useCreateAccreditation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAccreditationDto) => {
      const response = await apiClient.post('/accreditations', data);
      return response.data.data as Accreditation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accreditationKeys.lists() });
      toast.success('Accreditation created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create accreditation');
    },
  });
}

export function useUpdateAccreditation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAccreditationDto }) => {
      const response = await apiClient.patch(`/accreditations/${id}`, data);
      return response.data.data as Accreditation;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: accreditationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accreditationKeys.detail(data.id) });
      toast.success('Accreditation updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update accreditation');
    },
  });
}

export function useDeleteAccreditation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/accreditations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accreditationKeys.lists() });
      toast.success('Accreditation deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete accreditation');
    },
  });
}

export function useCreateCriteria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCriteriaDto) => {
      const response = await apiClient.post('/accreditations/criteria', data);
      return response.data.data as AccreditationCriteria;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: accreditationKeys.criteria(data.accreditationId) });
      toast.success('Criteria added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add criteria');
    },
  });
}

export function useUpdateCriteria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCriteriaDto }) => {
      const response = await apiClient.patch(`/accreditations/criteria/${id}`, data);
      return response.data.data as AccreditationCriteria;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: accreditationKeys.criteria(data.accreditationId) });
      toast.success('Criteria updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update criteria');
    },
  });
}
