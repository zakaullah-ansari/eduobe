import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface ICCCommittee {
  id: string;
  name: string;
  description?: string;
  presidingOfficerId: string;
  members?: string[];
  externalMember?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: 'active' | 'inactive';
  tenureStart: string;
  tenureEnd?: string;
  createdAt: string;
  updatedAt: string;
  presidingOfficer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count?: {
    cases: number;
  };
}

export interface SexualHarassmentCase {
  id: string;
  caseNumber: string;
  complainantName: string;
  complainantEmail: string;
  complainantPhone?: string;
  complainantType: 'student' | 'faculty' | 'staff' | 'other';
  respondentName: string;
  respondentEmail?: string;
  respondentType: 'student' | 'faculty' | 'staff' | 'other';
  incidentDate: string;
  incidentLocation?: string;
  description: string;
  status: 'filed' | 'under_investigation' | 'conciliation' | 'inquiry' | 'resolved' | 'dismissed' | 'closed';
  committeeId?: string;
  investigationReport?: string;
  findings?: string;
  recommendations?: string;
  actionTaken?: string;
  resolutionDate?: string;
  confidentialityLevel: 'strict' | 'moderate' | 'standard';
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  committee?: {
    id: string;
    name: string;
  };
}

export interface CreateCommitteeDto {
  name: string;
  description?: string;
  presidingOfficerId: string;
  members?: string[];
  externalMember?: string;
  contactEmail?: string;
  contactPhone?: string;
  tenureStart: string;
  tenureEnd?: string;
}

export interface UpdateCommitteeDto extends Partial<CreateCommitteeDto> {
  status?: 'active' | 'inactive';
}

export interface CreateCaseDto {
  complainantName: string;
  complainantEmail: string;
  complainantPhone?: string;
  complainantType: 'student' | 'faculty' | 'staff' | 'other';
  respondentName: string;
  respondentEmail?: string;
  respondentType: 'student' | 'faculty' | 'staff' | 'other';
  incidentDate: string;
  incidentLocation?: string;
  description: string;
  committeeId?: string;
  confidentialityLevel: 'strict' | 'moderate' | 'standard';
  attachments?: string[];
}

export interface UpdateCaseDto extends Partial<CreateCaseDto> {
  status?: 'filed' | 'under_investigation' | 'conciliation' | 'inquiry' | 'resolved' | 'dismissed' | 'closed';
  investigationReport?: string;
  findings?: string;
  recommendations?: string;
  actionTaken?: string;
  resolutionDate?: string;
}

export const iccKeys = {
  all: ['icc'] as const,
  committees: () => [...iccKeys.all, 'committees'] as const,
  committee: (filters: any) => [...iccKeys.committees(), filters] as const,
  cases: () => [...iccKeys.all, 'cases'] as const,
  case: (filters: any) => [...iccKeys.cases(), filters] as const,
};

export function useICCCommittees(filters?: any) {
  return useQuery({
    queryKey: iccKeys.committee(filters),
    queryFn: async () => {
      const response = await apiClient.get('/icc/committees', { params: filters });
      return response.data.data as ICCCommittee[];
    },
  });
}

export function useSexualHarassmentCases(filters?: any) {
  return useQuery({
    queryKey: iccKeys.case(filters),
    queryFn: async () => {
      const response = await apiClient.get('/icc/cases', { params: filters });
      return response.data.data as SexualHarassmentCase[];
    },
  });
}

export function useCreateICCCommittee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommitteeDto) => {
      const response = await apiClient.post('/icc/committees', data);
      return response.data.data as ICCCommittee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: iccKeys.committees() });
      toast.success('ICC Committee created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create committee');
    },
  });
}

export function useUpdateICCCommittee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCommitteeDto }) => {
      const response = await apiClient.patch(`/icc/committees/${id}`, data);
      return response.data.data as ICCCommittee;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: iccKeys.committees() });
      queryClient.invalidateQueries({ queryKey: [...iccKeys.committees(), data.id] });
      toast.success('Committee updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update committee');
    },
  });
}

export function useFileCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCaseDto) => {
      const response = await apiClient.post('/icc/cases', data);
      return response.data.data as SexualHarassmentCase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: iccKeys.cases() });
      toast.success('Case filed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to file case');
    },
  });
}

export function useUpdateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCaseDto }) => {
      const response = await apiClient.patch(`/icc/cases/${id}`, data);
      return response.data.data as SexualHarassmentCase;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: iccKeys.cases() });
      queryClient.invalidateQueries({ queryKey: [...iccKeys.cases(), data.id] });
      toast.success('Case updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update case');
    },
  });
}

export function useUpdateCaseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, findings, recommendations, actionTaken }: { 
      id: string; 
      status: string;
      findings?: string;
      recommendations?: string;
      actionTaken?: string;
    }) => {
      const response = await apiClient.patch(`/icc/cases/${id}/status`, { 
        status, 
        findings, 
        recommendations, 
        actionTaken 
      });
      return response.data.data as SexualHarassmentCase;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: iccKeys.cases() });
      queryClient.invalidateQueries({ queryKey: [...iccKeys.cases(), data.id] });
      toast.success('Case status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update case status');
    },
  });
}
