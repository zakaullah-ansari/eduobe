import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface DisciplinaryCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  accusedId: string;
  accusedType: 'student' | 'faculty' | 'staff';
  violationType: 'academic_misconduct' | 'behavioral' | 'attendance' | 'ragging' | 'harassment' | 'property_damage' | 'other';
  severity: 'minor' | 'moderate' | 'major' | 'severe';
  status: 'reported' | 'under_investigation' | 'hearing_scheduled' | 'hearing_completed' | 'decision_pending' | 'resolved' | 'appeal_filed' | 'closed';
  incidentDate: string;
  reportedBy?: string;
  reporterType: 'faculty' | 'staff' | 'student' | 'parent' | 'other';
  investigationReport?: string;
  hearingDate?: string;
  hearingNotes?: string;
  decision?: string;
  actionTaken?: string;
  penalty?: string;
  resolutionDate?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  accused?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    rollNumber?: string;
    employeeId?: string;
  };
}

export interface DisciplinaryProceeding {
  id: string;
  caseId: string;
  proceedingNumber: string;
  date: string;
  type: 'inquiry' | 'hearing' | 'review' | 'appeal';
  presidingOfficer?: string;
  attendees?: string[];
  proceedings?: string;
  evidence?: string[];
  outcome?: string;
  nextHearingDate?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  case?: {
    id: string;
    caseNumber: string;
    title: string;
  };
}

export interface DisciplinaryAppeal {
  id: string;
  caseId: string;
  appealNumber: string;
  appellantId: string;
  appellantType: 'student' | 'faculty' | 'staff';
  grounds: string;
  status: 'filed' | 'under_review' | 'hearing_scheduled' | 'disposed' | 'rejected';
  filedDate: string;
  hearingDate?: string;
  disposalDate?: string;
  decision?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  case?: {
    id: string;
    caseNumber: string;
    title: string;
  };
  appellant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateCaseDto {
  title: string;
  description: string;
  accusedId: string;
  accusedType: 'student' | 'faculty' | 'staff';
  violationType: 'academic_misconduct' | 'behavioral' | 'attendance' | 'ragging' | 'harassment' | 'property_damage' | 'other';
  severity: 'minor' | 'moderate' | 'major' | 'severe';
  incidentDate: string;
  reportedBy?: string;
  reporterType: 'faculty' | 'staff' | 'student' | 'parent' | 'other';
  attachments?: string[];
}

export interface UpdateCaseDto extends Partial<CreateCaseDto> {
  status?: 'reported' | 'under_investigation' | 'hearing_scheduled' | 'hearing_completed' | 'decision_pending' | 'resolved' | 'appeal_filed' | 'closed';
  investigationReport?: string;
  hearingDate?: string;
  hearingNotes?: string;
  decision?: string;
  actionTaken?: string;
  penalty?: string;
  resolutionDate?: string;
}

export interface CreateProceedingDto {
  caseId: string;
  date: string;
  type: 'inquiry' | 'hearing' | 'review' | 'appeal';
  presidingOfficer?: string;
  attendees?: string[];
  proceedings?: string;
  evidence?: string[];
  outcome?: string;
  nextHearingDate?: string;
  attachments?: string[];
}

export interface UpdateProceedingDto extends Partial<CreateProceedingDto> {}

export interface CreateAppealDto {
  caseId: string;
  appellantId: string;
  appellantType: 'student' | 'faculty' | 'staff';
  grounds: string;
  attachments?: string[];
}

export interface UpdateAppealDto extends Partial<CreateAppealDto> {
  status?: 'filed' | 'under_review' | 'hearing_scheduled' | 'disposed' | 'rejected';
  hearingDate?: string;
  disposalDate?: string;
  decision?: string;
}

export const disciplinaryKeys = {
  all: ['disciplinary'] as const,
  cases: () => [...disciplinaryKeys.all, 'cases'] as const,
  case: (filters: any) => [...disciplinaryKeys.cases(), filters] as const,
  proceedings: () => [...disciplinaryKeys.all, 'proceedings'] as const,
  proceeding: (filters: any) => [...disciplinaryKeys.proceedings(), filters] as const,
  appeals: () => [...disciplinaryKeys.all, 'appeals'] as const,
  appeal: (filters: any) => [...disciplinaryKeys.appeals(), filters] as const,
};

export function useDisciplinaryCases(filters?: any) {
  return useQuery({
    queryKey: disciplinaryKeys.case(filters),
    queryFn: async () => {
      const response = await apiClient.get('/disciplinary/cases', { params: filters });
      return response.data.data as DisciplinaryCase[];
    },
  });
}

export function useDisciplinaryCase(id: string) {
  return useQuery({
    queryKey: [...disciplinaryKeys.cases(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/disciplinary/cases/${id}`);
      return response.data.data as DisciplinaryCase;
    },
    enabled: !!id,
  });
}

export function useDisciplinaryProceedings(filters?: any) {
  return useQuery({
    queryKey: disciplinaryKeys.proceeding(filters),
    queryFn: async () => {
      const response = await apiClient.get('/disciplinary/proceedings', { params: filters });
      return response.data.data as DisciplinaryProceeding[];
    },
  });
}

export function useDisciplinaryAppeals(filters?: any) {
  return useQuery({
    queryKey: disciplinaryKeys.appeal(filters),
    queryFn: async () => {
      const response = await apiClient.get('/disciplinary/appeals', { params: filters });
      return response.data.data as DisciplinaryAppeal[];
    },
  });
}

export function useCreateDisciplinaryCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCaseDto) => {
      const response = await apiClient.post('/disciplinary/cases', data);
      return response.data.data as DisciplinaryCase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: disciplinaryKeys.cases() });
      toast.success('Disciplinary case created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create case');
    },
  });
}

export function useUpdateDisciplinaryCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCaseDto }) => {
      const response = await apiClient.patch(`/disciplinary/cases/${id}`, data);
      return response.data.data as DisciplinaryCase;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: disciplinaryKeys.cases() });
      queryClient.invalidateQueries({ queryKey: [...disciplinaryKeys.cases(), data.id] });
      toast.success('Case updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update case');
    },
  });
}

export function useDeleteDisciplinaryCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/disciplinary/cases/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: disciplinaryKeys.cases() });
      toast.success('Case deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete case');
    },
  });
}

export function useCreateProceeding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProceedingDto) => {
      const response = await apiClient.post('/disciplinary/proceedings', data);
      return response.data.data as DisciplinaryProceeding;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: disciplinaryKeys.proceedings() });
      toast.success('Proceeding recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record proceeding');
    },
  });
}

export function useUpdateProceeding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProceedingDto }) => {
      const response = await apiClient.patch(`/disciplinary/proceedings/${id}`, data);
      return response.data.data as DisciplinaryProceeding;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: disciplinaryKeys.proceedings() });
      queryClient.invalidateQueries({ queryKey: [...disciplinaryKeys.proceedings(), data.id] });
      toast.success('Proceeding updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update proceeding');
    },
  });
}

export function useCreateAppeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppealDto) => {
      const response = await apiClient.post('/disciplinary/appeals', data);
      return response.data.data as DisciplinaryAppeal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: disciplinaryKeys.appeals() });
      toast.success('Appeal filed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to file appeal');
    },
  });
}

export function useUpdateAppeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAppealDto }) => {
      const response = await apiClient.patch(`/disciplinary/appeals/${id}`, data);
      return response.data.data as DisciplinaryAppeal;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: disciplinaryKeys.appeals() });
      queryClient.invalidateQueries({ queryKey: [...disciplinaryKeys.appeals(), data.id] });
      toast.success('Appeal updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update appeal');
    },
  });
}
