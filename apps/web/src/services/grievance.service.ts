import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Grievance {
  id: string;
  grievanceNumber: string;
  title: string;
  description: string;
  category: 'academic' | 'administrative' | 'infrastructure' | 'hostel' | 'transport' | 'library' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'submitted' | 'under_review' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
  submittedBy: string;
  submittedByType: 'student' | 'faculty' | 'staff' | 'parent' | 'other';
  departmentId?: string;
  programId?: string;
  assignedTo?: string;
  assignedDate?: string;
  resolvedDate?: string;
  resolution?: string;
  satisfactionRating?: number;
  feedback?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateGrievanceDto {
  title: string;
  description: string;
  category: 'academic' | 'administrative' | 'infrastructure' | 'hostel' | 'transport' | 'library' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedByType: 'student' | 'faculty' | 'staff' | 'parent' | 'other';
  departmentId?: string;
  programId?: string;
  attachments?: string[];
}

export interface UpdateGrievanceDto extends Partial<CreateGrievanceDto> {
  status?: 'submitted' | 'under_review' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
  assignedTo?: string;
  assignedDate?: string;
  resolvedDate?: string;
  resolution?: string;
  satisfactionRating?: number;
  feedback?: string;
}

export const grievanceKeys = {
  all: ['grievances'] as const,
  lists: () => [...grievanceKeys.all, 'list'] as const,
  list: (filters: any) => [...grievanceKeys.lists(), filters] as const,
  details: () => [...grievanceKeys.all, 'detail'] as const,
  detail: (id: string) => [...grievanceKeys.details(), id] as const,
};

export function useGrievances(filters?: any) {
  return useQuery({
    queryKey: grievanceKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/grievances', { params: filters });
      return response.data.data as Grievance[];
    },
  });
}

export function useGrievance(id: string) {
  return useQuery({
    queryKey: grievanceKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/grievances/${id}`);
      return response.data.data as Grievance;
    },
    enabled: !!id,
  });
}

export function useCreateGrievance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGrievanceDto) => {
      const response = await apiClient.post('/grievances', data);
      return response.data.data as Grievance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: grievanceKeys.lists() });
      toast.success('Grievance submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit grievance');
    },
  });
}

export function useUpdateGrievance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateGrievanceDto }) => {
      const response = await apiClient.patch(`/grievances/${id}`, data);
      return response.data.data as Grievance;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: grievanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: grievanceKeys.detail(data.id) });
      toast.success('Grievance updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update grievance');
    },
  });
}

export function useDeleteGrievance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/grievances/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: grievanceKeys.lists() });
      toast.success('Grievance deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete grievance');
    },
  });
}

export function useAssignGrievance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, assigneeId }: { id: string; assigneeId: string }) => {
      const response = await apiClient.patch(`/grievances/${id}/assign`, { assigneeId });
      return response.data.data as Grievance;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: grievanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: grievanceKeys.detail(data.id) });
      toast.success('Grievance assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign grievance');
    },
  });
}

export function useResolveGrievance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, resolution }: { id: string; resolution: string }) => {
      const response = await apiClient.patch(`/grievances/${id}/resolve`, { resolution });
      return response.data.data as Grievance;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: grievanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: grievanceKeys.detail(data.id) });
      toast.success('Grievance resolved successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to resolve grievance');
    },
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, rating, feedback }: { id: string; rating: number; feedback?: string }) => {
      const response = await apiClient.post(`/grievances/${id}/feedback`, { rating, feedback });
      return response.data.data as Grievance;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: grievanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: grievanceKeys.detail(data.id) });
      toast.success('Feedback submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    },
  });
}
