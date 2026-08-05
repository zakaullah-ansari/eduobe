import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface MOU {
  id: string;
  title: string;
  partnerOrganization: string;
  partnerType: 'industry' | 'academic' | 'government' | 'international' | 'ngo';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'terminated' | 'proposed';
  scope?: string;
  objectives?: string[];
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  departmentId?: string;
  outcomes?: string[];
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface Partnership {
  id: string;
  title: string;
  partnerOrganization: string;
  type: 'research' | 'academic' | 'industry' | 'community' | 'international';
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'proposed' | 'completed';
  description?: string;
  activities?: string[];
  benefits?: string[];
  contactPerson?: string;
  contactEmail?: string;
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

export interface CreateMOUDto {
  title: string;
  partnerOrganization: string;
  partnerType: 'industry' | 'academic' | 'government' | 'international' | 'ngo';
  startDate: string;
  endDate: string;
  scope?: string;
  objectives?: string[];
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  departmentId?: string;
  outcomes?: string[];
  remarks?: string;
}

export interface UpdateMOUDto extends Partial<CreateMOUDto> {
  status?: 'active' | 'expired' | 'terminated' | 'proposed';
}

export interface CreatePartnershipDto {
  title: string;
  partnerOrganization: string;
  type: 'research' | 'academic' | 'industry' | 'community' | 'international';
  startDate: string;
  endDate?: string;
  description?: string;
  activities?: string[];
  benefits?: string[];
  contactPerson?: string;
  contactEmail?: string;
  departmentId?: string;
  remarks?: string;
}

export interface UpdatePartnershipDto extends Partial<CreatePartnershipDto> {
  status?: 'active' | 'inactive' | 'proposed' | 'completed';
}

export const industryKeys = {
  all: ['industry'] as const,
  mous: () => [...industryKeys.all, 'mous'] as const,
  mou: (filters: any) => [...industryKeys.mous(), filters] as const,
  partnerships: () => [...industryKeys.all, 'partnerships'] as const,
  partnership: (filters: any) => [...industryKeys.partnerships(), filters] as const,
};

export function useMOUs(filters?: any) {
  return useQuery({
    queryKey: industryKeys.mou(filters),
    queryFn: async () => {
      const response = await apiClient.get('/industry/mous', { params: filters });
      return response.data.data as MOU[];
    },
  });
}

export function useMOU(id: string) {
  return useQuery({
    queryKey: [...industryKeys.mous(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/industry/mous/${id}`);
      return response.data.data as MOU;
    },
    enabled: !!id,
  });
}

export function usePartnerships(filters?: any) {
  return useQuery({
    queryKey: industryKeys.partnership(filters),
    queryFn: async () => {
      const response = await apiClient.get('/industry/partnerships', { params: filters });
      return response.data.data as Partnership[];
    },
  });
}

export function usePartnership(id: string) {
  return useQuery({
    queryKey: [...industryKeys.partnerships(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/industry/partnerships/${id}`);
      return response.data.data as Partnership;
    },
    enabled: !!id,
  });
}

export function useCreateMOU() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMOUDto) => {
      const response = await apiClient.post('/industry/mous', data);
      return response.data.data as MOU;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryKeys.mous() });
      toast.success('MOU created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create MOU');
    },
  });
}

export function useUpdateMOU() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateMOUDto }) => {
      const response = await apiClient.patch(`/industry/mous/${id}`, data);
      return response.data.data as MOU;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: industryKeys.mous() });
      queryClient.invalidateQueries({ queryKey: [...industryKeys.mous(), data.id] });
      toast.success('MOU updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update MOU');
    },
  });
}

export function useDeleteMOU() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/industry/mous/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryKeys.mous() });
      toast.success('MOU deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete MOU');
    },
  });
}

export function useCreatePartnership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePartnershipDto) => {
      const response = await apiClient.post('/industry/partnerships', data);
      return response.data.data as Partnership;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryKeys.partnerships() });
      toast.success('Partnership created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create partnership');
    },
  });
}

export function useUpdatePartnership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePartnershipDto }) => {
      const response = await apiClient.patch(`/industry/partnerships/${id}`, data);
      return response.data.data as Partnership;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: industryKeys.partnerships() });
      queryClient.invalidateQueries({ queryKey: [...industryKeys.partnerships(), data.id] });
      toast.success('Partnership updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update partnership');
    },
  });
}

export function useDeletePartnership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/industry/partnerships/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryKeys.partnerships() });
      toast.success('Partnership deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete partnership');
    },
  });
}
