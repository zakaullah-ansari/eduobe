import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface ComplianceRequirement {
  id: string;
  title: string;
  category: 'aicte' | 'university' | 'government' | 'statutory' | 'other';
  description?: string;
  regulation?: string;
  effectiveDate?: string;
  deadlineDate?: string;
  status: 'pending' | 'in_progress' | 'compliant' | 'non_compliant' | 'exempted';
  evidence?: string[];
  remarks?: string;
  departmentId?: string;
  programId?: string;
  responsiblePerson?: string;
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface ComplianceReport {
  id: string;
  title: string;
  reportingPeriod: string;
  category: 'aicte' | 'university' | 'government' | 'statutory' | 'other';
  submittedDate?: string;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
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
}

export interface CreateRequirementDto {
  title: string;
  category: 'aicte' | 'university' | 'government' | 'statutory' | 'other';
  description?: string;
  regulation?: string;
  effectiveDate?: string;
  deadlineDate?: string;
  evidence?: string[];
  remarks?: string;
  departmentId?: string;
  programId?: string;
  responsiblePerson?: string;
}

export interface UpdateRequirementDto extends Partial<CreateRequirementDto> {
  status?: 'pending' | 'in_progress' | 'compliant' | 'non_compliant' | 'exempted';
}

export interface CreateReportDto {
  title: string;
  reportingPeriod: string;
  category: 'aicte' | 'university' | 'government' | 'statutory' | 'other';
  submittedDate?: string;
  departmentId?: string;
  programId?: string;
  remarks?: string;
}

export interface UpdateReportDto extends Partial<CreateReportDto> {
  status?: 'draft' | 'submitted' | 'accepted' | 'rejected';
}

export const complianceKeys = {
  all: ['compliance'] as const,
  requirements: () => [...complianceKeys.all, 'requirements'] as const,
  requirement: (filters: any) => [...complianceKeys.requirements(), filters] as const,
  reports: () => [...complianceKeys.all, 'reports'] as const,
  report: (filters: any) => [...complianceKeys.reports(), filters] as const,
};

export function useComplianceRequirements(filters?: any) {
  return useQuery({
    queryKey: complianceKeys.requirement(filters),
    queryFn: async () => {
      const response = await apiClient.get('/compliance/requirements', { params: filters });
      return response.data.data as ComplianceRequirement[];
    },
  });
}

export function useComplianceRequirement(id: string) {
  return useQuery({
    queryKey: [...complianceKeys.requirements(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/compliance/requirements/${id}`);
      return response.data.data as ComplianceRequirement;
    },
    enabled: !!id,
  });
}

export function useComplianceReports(filters?: any) {
  return useQuery({
    queryKey: complianceKeys.report(filters),
    queryFn: async () => {
      const response = await apiClient.get('/compliance/reports', { params: filters });
      return response.data.data as ComplianceReport[];
    },
  });
}

export function useCreateRequirement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRequirementDto) => {
      const response = await apiClient.post('/compliance/requirements', data);
      return response.data.data as ComplianceRequirement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.requirements() });
      toast.success('Compliance requirement created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create requirement');
    },
  });
}

export function useUpdateRequirement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRequirementDto }) => {
      const response = await apiClient.patch(`/compliance/requirements/${id}`, data);
      return response.data.data as ComplianceRequirement;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.requirements() });
      queryClient.invalidateQueries({ queryKey: [...complianceKeys.requirements(), data.id] });
      toast.success('Requirement updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update requirement');
    },
  });
}

export function useDeleteRequirement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/compliance/requirements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.requirements() });
      toast.success('Requirement deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete requirement');
    },
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReportDto) => {
      const response = await apiClient.post('/compliance/reports', data);
      return response.data.data as ComplianceReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.reports() });
      toast.success('Compliance report created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create report');
    },
  });
}

export function useUpdateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateReportDto }) => {
      const response = await apiClient.patch(`/compliance/reports/${id}`, data);
      return response.data.data as ComplianceReport;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.reports() });
      queryClient.invalidateQueries({ queryKey: [...complianceKeys.reports(), data.id] });
      toast.success('Report updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update report');
    },
  });
}
