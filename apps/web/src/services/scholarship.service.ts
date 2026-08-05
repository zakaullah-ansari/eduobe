import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface ScholarshipScheme {
  id: string;
  schemeNumber: string;
  name: string;
  description?: string;
  providerType: 'government' | 'private' | 'institutional' | 'ngo' | 'other';
  providerName: string;
  amount: number;
  eligibility?: string;
  applicationDeadline: string;
  renewalCriteria?: string;
  status: 'active' | 'inactive' | 'closed';
  createdAt: string;
  updatedAt: string;
  _count?: {
    applications: number;
    disbursements: number;
  };
}

export interface ScholarshipApplication {
  id: string;
  applicationNumber: string;
  studentId: string;
  schemeId: string;
  appliedDate: string;
  status: 'applied' | 'under_review' | 'approved' | 'rejected' | 'disbursed' | 'renewed';
  documents?: string[];
  remarks?: string;
  approvedDate?: string;
  approvedAmount?: number;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
    program?: {
      id: string;
      name: string;
    };
  };
  scheme?: {
    id: string;
    name: string;
    providerName: string;
    amount: number;
  };
}

export interface Disbursement {
  id: string;
  disbursementNumber: string;
  applicationId: string;
  amount: number;
  disbursementDate: string;
  paymentMethod: 'bank_transfer' | 'cheque' | 'cash' | 'online';
  transactionId?: string;
  bankName?: string;
  accountNumber?: string;
  status: 'pending' | 'processed' | 'completed' | 'failed';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  application?: {
    id: string;
    applicationNumber: string;
    student?: {
      id: string;
      firstName: string;
      lastName: string;
      rollNumber: string;
    };
    scheme?: {
      id: string;
      name: string;
    };
  };
}

export interface CreateSchemeDto {
  name: string;
  description?: string;
  providerType: 'government' | 'private' | 'institutional' | 'ngo' | 'other';
  providerName: string;
  amount: number;
  eligibility?: string;
  applicationDeadline: string;
  renewalCriteria?: string;
}

export interface UpdateSchemeDto extends Partial<CreateSchemeDto> {
  status?: 'active' | 'inactive' | 'closed';
}

export interface CreateApplicationDto {
  studentId: string;
  schemeId: string;
  documents?: string[];
  remarks?: string;
}

export interface UpdateApplicationDto extends Partial<CreateApplicationDto> {
  status?: 'applied' | 'under_review' | 'approved' | 'rejected' | 'disbursed' | 'renewed';
  approvedDate?: string;
  approvedAmount?: number;
}

export interface CreateDisbursementDto {
  applicationId: string;
  amount: number;
  disbursementDate: string;
  paymentMethod: 'bank_transfer' | 'cheque' | 'cash' | 'online';
  transactionId?: string;
  bankName?: string;
  accountNumber?: string;
  remarks?: string;
}

export interface UpdateDisbursementDto extends Partial<CreateDisbursementDto> {
  status?: 'pending' | 'processed' | 'completed' | 'failed';
}

export const scholarshipKeys = {
  all: ['scholarships'] as const,
  schemes: () => [...scholarshipKeys.all, 'schemes'] as const,
  scheme: (filters: any) => [...scholarshipKeys.schemes(), filters] as const,
  applications: () => [...scholarshipKeys.all, 'applications'] as const,
  application: (filters: any) => [...scholarshipKeys.applications(), filters] as const,
  disbursements: () => [...scholarshipKeys.all, 'disbursements'] as const,
  disbursement: (filters: any) => [...scholarshipKeys.disbursements(), filters] as const,
};

export function useScholarshipSchemes(filters?: any) {
  return useQuery({
    queryKey: scholarshipKeys.scheme(filters),
    queryFn: async () => {
      const response = await apiClient.get('/scholarships/schemes', { params: filters });
      return response.data.data as ScholarshipScheme[];
    },
  });
}

export function useScholarshipScheme(id: string) {
  return useQuery({
    queryKey: [...scholarshipKeys.schemes(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/scholarships/schemes/${id}`);
      return response.data.data as ScholarshipScheme;
    },
    enabled: !!id,
  });
}

export function useScholarshipApplications(filters?: any) {
  return useQuery({
    queryKey: scholarshipKeys.application(filters),
    queryFn: async () => {
      const response = await apiClient.get('/scholarships/applications', { params: filters });
      return response.data.data as ScholarshipApplication[];
    },
  });
}

export function useDisbursements(filters?: any) {
  return useQuery({
    queryKey: scholarshipKeys.disbursement(filters),
    queryFn: async () => {
      const response = await apiClient.get('/scholarships/disbursements', { params: filters });
      return response.data.data as Disbursement[];
    },
  });
}

export function useCreateScheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSchemeDto) => {
      const response = await apiClient.post('/scholarships/schemes', data);
      return response.data.data as ScholarshipScheme;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scholarshipKeys.schemes() });
      toast.success('Scholarship scheme created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create scheme');
    },
  });
}

export function useUpdateScheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSchemeDto }) => {
      const response = await apiClient.patch(`/scholarships/schemes/${id}`, data);
      return response.data.data as ScholarshipScheme;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: scholarshipKeys.schemes() });
      queryClient.invalidateQueries({ queryKey: [...scholarshipKeys.schemes(), data.id] });
      toast.success('Scheme updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update scheme');
    },
  });
}

export function useDeleteScheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/scholarships/schemes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scholarshipKeys.schemes() });
      toast.success('Scheme deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete scheme');
    },
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateApplicationDto) => {
      const response = await apiClient.post('/scholarships/applications', data);
      return response.data.data as ScholarshipApplication;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scholarshipKeys.applications() });
      toast.success('Application submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateApplicationDto }) => {
      const response = await apiClient.patch(`/scholarships/applications/${id}`, data);
      return response.data.data as ScholarshipApplication;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: scholarshipKeys.applications() });
      queryClient.invalidateQueries({ queryKey: [...scholarshipKeys.applications(), data.id] });
      toast.success('Application updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update application');
    },
  });
}

export function useCreateDisbursement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDisbursementDto) => {
      const response = await apiClient.post('/scholarships/disbursements', data);
      return response.data.data as Disbursement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scholarshipKeys.disbursements() });
      toast.success('Disbursement recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record disbursement');
    },
  });
}

export function useUpdateDisbursement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDisbursementDto }) => {
      const response = await apiClient.patch(`/scholarships/disbursements/${id}`, data);
      return response.data.data as Disbursement;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: scholarshipKeys.disbursements() });
      queryClient.invalidateQueries({ queryKey: [...scholarshipKeys.disbursements(), data.id] });
      toast.success('Disbursement updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update disbursement');
    },
  });
}
