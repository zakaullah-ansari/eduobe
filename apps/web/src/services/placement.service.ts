import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Company {
  id: string;
  name: string;
  industry: string;
  website?: string;
  location?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  description?: string;
  status: 'active' | 'inactive' | 'blacklisted';
  createdAt: string;
  updatedAt: string;
  _count?: {
    drives: number;
    offers: number;
  };
}

export interface PlacementDrive {
  id: string;
  driveNumber: string;
  companyId: string;
  title: string;
  description?: string;
  driveDate: string;
  driveType: 'campus' | 'virtual' | 'off_campus';
  eligibility?: string;
  packageOffered?: number;
  positionsAvailable?: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  venue?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
    industry: string;
  };
  _count?: {
    applications: number;
    selections: number;
  };
}

export interface Application {
  id: string;
  applicationNumber: string;
  studentId: string;
  driveId: string;
  appliedDate: string;
  status: 'applied' | 'shortlisted' | 'rejected' | 'selected' | 'offered' | 'joined' | 'declined';
  resumeUrl?: string;
  interviewDate?: string;
  interviewFeedback?: string;
  offeredPackage?: number;
  joiningDate?: string;
  remarks?: string;
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
  drive?: {
    id: string;
    title: string;
    company?: {
      id: string;
      name: string;
    };
  };
}

export interface CreateCompanyDto {
  name: string;
  industry: string;
  website?: string;
  location?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  description?: string;
}

export interface UpdateCompanyDto extends Partial<CreateCompanyDto> {
  status?: 'active' | 'inactive' | 'blacklisted';
}

export interface CreateDriveDto {
  companyId: string;
  title: string;
  description?: string;
  driveDate: string;
  driveType: 'campus' | 'virtual' | 'off_campus';
  eligibility?: string;
  packageOffered?: number;
  positionsAvailable?: number;
  venue?: string;
  attachments?: string[];
}

export interface UpdateDriveDto extends Partial<CreateDriveDto> {
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface CreateApplicationDto {
  studentId: string;
  driveId: string;
  resumeUrl?: string;
  remarks?: string;
}

export interface UpdateApplicationDto extends Partial<CreateApplicationDto> {
  status?: 'applied' | 'shortlisted' | 'rejected' | 'selected' | 'offered' | 'joined' | 'declined';
  interviewDate?: string;
  interviewFeedback?: string;
  offeredPackage?: number;
  joiningDate?: string;
}

export const placementKeys = {
  all: ['placements'] as const,
  companies: () => [...placementKeys.all, 'companies'] as const,
  company: (filters: any) => [...placementKeys.companies(), filters] as const,
  drives: () => [...placementKeys.all, 'drives'] as const,
  drive: (filters: any) => [...placementKeys.drives(), filters] as const,
  applications: () => [...placementKeys.all, 'applications'] as const,
  application: (filters: any) => [...placementKeys.applications(), filters] as const,
};

export function useCompanies(filters?: any) {
  return useQuery({
    queryKey: placementKeys.company(filters),
    queryFn: async () => {
      const response = await apiClient.get('/placements/companies', { params: filters });
      return response.data.data as Company[];
    },
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: [...placementKeys.companies(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/placements/companies/${id}`);
      return response.data.data as Company;
    },
    enabled: !!id,
  });
}

export function usePlacementDrives(filters?: any) {
  return useQuery({
    queryKey: placementKeys.drive(filters),
    queryFn: async () => {
      const response = await apiClient.get('/placements/drives', { params: filters });
      return response.data.data as PlacementDrive[];
    },
  });
}

export function usePlacementDrive(id: string) {
  return useQuery({
    queryKey: [...placementKeys.drives(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/placements/drives/${id}`);
      return response.data.data as PlacementDrive;
    },
    enabled: !!id,
  });
}

export function useApplications(filters?: any) {
  return useQuery({
    queryKey: placementKeys.application(filters),
    queryFn: async () => {
      const response = await apiClient.get('/placements/applications', { params: filters });
      return response.data.data as Application[];
    },
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCompanyDto) => {
      const response = await apiClient.post('/placements/companies', data);
      return response.data.data as Company;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: placementKeys.companies() });
      toast.success('Company added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add company');
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCompanyDto }) => {
      const response = await apiClient.patch(`/placements/companies/${id}`, data);
      return response.data.data as Company;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: placementKeys.companies() });
      queryClient.invalidateQueries({ queryKey: [...placementKeys.companies(), data.id] });
      toast.success('Company updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update company');
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/placements/companies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: placementKeys.companies() });
      toast.success('Company deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete company');
    },
  });
}

export function useCreateDrive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDriveDto) => {
      const response = await apiClient.post('/placements/drives', data);
      return response.data.data as PlacementDrive;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: placementKeys.drives() });
      toast.success('Placement drive scheduled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to schedule drive');
    },
  });
}

export function useUpdateDrive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDriveDto }) => {
      const response = await apiClient.patch(`/placements/drives/${id}`, data);
      return response.data.data as PlacementDrive;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: placementKeys.drives() });
      queryClient.invalidateQueries({ queryKey: [...placementKeys.drives(), data.id] });
      toast.success('Drive updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update drive');
    },
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateApplicationDto) => {
      const response = await apiClient.post('/placements/applications', data);
      return response.data.data as Application;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: placementKeys.applications() });
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
      const response = await apiClient.patch(`/placements/applications/${id}`, data);
      return response.data.data as Application;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: placementKeys.applications() });
      queryClient.invalidateQueries({ queryKey: [...placementKeys.applications(), data.id] });
      toast.success('Application updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update application');
    },
  });
}
