import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface AntiRaggingCommittee {
  id: string;
  name: string;
  description?: string;
  chairmanId: string;
  members?: string[];
  contactEmail?: string;
  contactPhone?: string;
  status: 'active' | 'inactive';
  tenureStart: string;
  tenureEnd?: string;
  createdAt: string;
  updatedAt: string;
  chairman?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count?: {
    incidents: number;
    campaigns: number;
  };
}

export interface RaggingIncident {
  id: string;
  incidentNumber: string;
  title: string;
  description: string;
  incidentDate: string;
  incidentTime?: string;
  location?: string;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  status: 'reported' | 'under_investigation' | 'resolved' | 'closed';
  reportedBy?: string;
  reporterType: 'student' | 'faculty' | 'staff' | 'parent' | 'anonymous' | 'other';
  victimNames?: string[];
  accusedNames?: string[];
  committeeId?: string;
  investigationReport?: string;
  actionTaken?: string;
  resolutionDate?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  committee?: {
    id: string;
    name: string;
  };
}

export interface AwarenessCampaign {
  id: string;
  title: string;
  description?: string;
  campaignDate: string;
  campaignType: 'workshop' | 'seminar' | 'poster' | 'video' | 'oath' | 'other';
  targetAudience: 'students' | 'faculty' | 'staff' | 'all';
  organizer?: string;
  venue?: string;
  participants?: number;
  materials?: string[];
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  outcomes?: string;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommitteeDto {
  name: string;
  description?: string;
  chairmanId: string;
  members?: string[];
  contactEmail?: string;
  contactPhone?: string;
  tenureStart: string;
  tenureEnd?: string;
}

export interface UpdateCommitteeDto extends Partial<CreateCommitteeDto> {
  status?: 'active' | 'inactive';
}

export interface CreateIncidentDto {
  title: string;
  description: string;
  incidentDate: string;
  incidentTime?: string;
  location?: string;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  reporterType: 'student' | 'faculty' | 'staff' | 'parent' | 'anonymous' | 'other';
  victimNames?: string[];
  accusedNames?: string[];
  committeeId?: string;
  attachments?: string[];
}

export interface UpdateIncidentDto extends Partial<CreateIncidentDto> {
  status?: 'reported' | 'under_investigation' | 'resolved' | 'closed';
  investigationReport?: string;
  actionTaken?: string;
  resolutionDate?: string;
}

export interface CreateCampaignDto {
  title: string;
  description?: string;
  campaignDate: string;
  campaignType: 'workshop' | 'seminar' | 'poster' | 'video' | 'oath' | 'other';
  targetAudience: 'students' | 'faculty' | 'staff' | 'all';
  organizer?: string;
  venue?: string;
  participants?: number;
  materials?: string[];
}

export interface UpdateCampaignDto extends Partial<CreateCampaignDto> {
  status?: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  outcomes?: string;
  feedback?: string;
}

export const antiRaggingKeys = {
  all: ['anti-ragging'] as const,
  committees: () => [...antiRaggingKeys.all, 'committees'] as const,
  committee: (filters: any) => [...antiRaggingKeys.committees(), filters] as const,
  incidents: () => [...antiRaggingKeys.all, 'incidents'] as const,
  incident: (filters: any) => [...antiRaggingKeys.incidents(), filters] as const,
  campaigns: () => [...antiRaggingKeys.all, 'campaigns'] as const,
  campaign: (filters: any) => [...antiRaggingKeys.campaigns(), filters] as const,
};

export function useAntiRaggingCommittees(filters?: any) {
  return useQuery({
    queryKey: antiRaggingKeys.committee(filters),
    queryFn: async () => {
      const response = await apiClient.get('/anti-ragging/committees', { params: filters });
      return response.data.data as AntiRaggingCommittee[];
    },
  });
}

export function useAntiRaggingIncidents(filters?: any) {
  return useQuery({
    queryKey: antiRaggingKeys.incident(filters),
    queryFn: async () => {
      const response = await apiClient.get('/anti-ragging/incidents', { params: filters });
      return response.data.data as RaggingIncident[];
    },
  });
}

export function useAwarenessCampaigns(filters?: any) {
  return useQuery({
    queryKey: antiRaggingKeys.campaign(filters),
    queryFn: async () => {
      const response = await apiClient.get('/anti-ragging/campaigns', { params: filters });
      return response.data.data as AwarenessCampaign[];
    },
  });
}

export function useCreateCommittee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommitteeDto) => {
      const response = await apiClient.post('/anti-ragging/committees', data);
      return response.data.data as AntiRaggingCommittee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: antiRaggingKeys.committees() });
      toast.success('Committee created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create committee');
    },
  });
}

export function useUpdateCommittee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCommitteeDto }) => {
      const response = await apiClient.patch(`/anti-ragging/committees/${id}`, data);
      return response.data.data as AntiRaggingCommittee;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: antiRaggingKeys.committees() });
      queryClient.invalidateQueries({ queryKey: [...antiRaggingKeys.committees(), data.id] });
      toast.success('Committee updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update committee');
    },
  });
}

export function useReportIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIncidentDto) => {
      const response = await apiClient.post('/anti-ragging/incidents', data);
      return response.data.data as RaggingIncident;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: antiRaggingKeys.incidents() });
      toast.success('Incident reported successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to report incident');
    },
  });
}

export function useUpdateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateIncidentDto }) => {
      const response = await apiClient.patch(`/anti-ragging/incidents/${id}`, data);
      return response.data.data as RaggingIncident;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: antiRaggingKeys.incidents() });
      queryClient.invalidateQueries({ queryKey: [...antiRaggingKeys.incidents(), data.id] });
      toast.success('Incident updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update incident');
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCampaignDto) => {
      const response = await apiClient.post('/anti-ragging/campaigns', data);
      return response.data.data as AwarenessCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: antiRaggingKeys.campaigns() });
      toast.success('Campaign created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create campaign');
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCampaignDto }) => {
      const response = await apiClient.patch(`/anti-ragging/campaigns/${id}`, data);
      return response.data.data as AwarenessCampaign;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: antiRaggingKeys.campaigns() });
      queryClient.invalidateQueries({ queryKey: [...antiRaggingKeys.campaigns(), data.id] });
      toast.success('Campaign updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update campaign');
    },
  });
}
