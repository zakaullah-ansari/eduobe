import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Audit {
  id: string;
  title: string;
  type: 'internal' | 'external' | 'academic' | 'financial' | 'quality' | 'other';
  description?: string;
  auditor?: string;
  auditFirm?: string;
  startDate: string;
  endDate?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  findings?: number;
  recommendations?: number;
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
  _count?: {
    findings: number;
  };
}

export interface AuditFinding {
  id: string;
  auditId: string;
  findingNumber: string;
  title: string;
  description?: string;
  category: 'major' | 'minor' | 'observation' | 'recommendation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'accepted';
  responsiblePerson?: string;
  targetDate?: string;
  resolvedDate?: string;
  actionTaken?: string;
  evidence?: string[];
  createdAt: string;
  updatedAt: string;
  audit?: {
    id: string;
    title: string;
    type: string;
  };
}

export interface CreateAuditDto {
  title: string;
  type: 'internal' | 'external' | 'academic' | 'financial' | 'quality' | 'other';
  description?: string;
  auditor?: string;
  auditFirm?: string;
  startDate: string;
  endDate?: string;
  departmentId?: string;
  programId?: string;
  remarks?: string;
}

export interface UpdateAuditDto extends Partial<CreateAuditDto> {
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  findings?: number;
  recommendations?: number;
}

export interface CreateFindingDto {
  auditId: string;
  findingNumber: string;
  title: string;
  description?: string;
  category: 'major' | 'minor' | 'observation' | 'recommendation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  responsiblePerson?: string;
  targetDate?: string;
  actionTaken?: string;
  evidence?: string[];
}

export interface UpdateFindingDto extends Partial<CreateFindingDto> {
  status?: 'open' | 'in_progress' | 'resolved' | 'closed' | 'accepted';
  resolvedDate?: string;
}

export const auditKeys = {
  all: ['audits'] as const,
  lists: () => [...auditKeys.all, 'list'] as const,
  list: (filters: any) => [...auditKeys.lists(), filters] as const,
  details: () => [...auditKeys.all, 'detail'] as const,
  detail: (id: string) => [...auditKeys.details(), id] as const,
  findings: (auditId: string) => [...auditKeys.all, 'findings', auditId] as const,
};

export function useAudits(filters?: any) {
  return useQuery({
    queryKey: auditKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/audits', { params: filters });
      return response.data.data as Audit[];
    },
  });
}

export function useAudit(id: string) {
  return useQuery({
    queryKey: auditKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/audits/${id}`);
      return response.data.data as Audit;
    },
    enabled: !!id,
  });
}

export function useAuditFindings(auditId: string) {
  return useQuery({
    queryKey: auditKeys.findings(auditId),
    queryFn: async () => {
      const response = await apiClient.get(`/audits/${auditId}/findings`);
      return response.data.data as AuditFinding[];
    },
    enabled: !!auditId,
  });
}

export function useCreateAudit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAuditDto) => {
      const response = await apiClient.post('/audits', data);
      return response.data.data as Audit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auditKeys.lists() });
      toast.success('Audit created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create audit');
    },
  });
}

export function useUpdateAudit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAuditDto }) => {
      const response = await apiClient.patch(`/audits/${id}`, data);
      return response.data.data as Audit;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: auditKeys.lists() });
      queryClient.invalidateQueries({ queryKey: auditKeys.detail(data.id) });
      toast.success('Audit updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update audit');
    },
  });
}

export function useDeleteAudit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/audits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auditKeys.lists() });
      toast.success('Audit deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete audit');
    },
  });
}

export function useCreateFinding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFindingDto) => {
      const response = await apiClient.post('/audits/findings', data);
      return response.data.data as AuditFinding;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: auditKeys.findings(data.auditId) });
      toast.success('Finding added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add finding');
    },
  });
}

export function useUpdateFinding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFindingDto }) => {
      const response = await apiClient.patch(`/audits/findings/${id}`, data);
      return response.data.data as AuditFinding;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: auditKeys.findings(data.auditId) });
      toast.success('Finding updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update finding');
    },
  });
}
