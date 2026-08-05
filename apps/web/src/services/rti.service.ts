import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface RTIRequest {
  id: string;
  requestNumber: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  applicantAddress: string;
  subject: string;
  description: string;
  informationSought: string;
  status: 'received' | 'under_process' | 'information_provided' | 'rejected' | 'transferred' | 'appeal_filed';
  receivedDate: string;
  responseDeadline: string;
  responseDate?: string;
  pioId?: string;
  faaId?: string;
  response?: string;
  rejectionReason?: string;
  feePaid: number;
  feeReceiptUrl?: string;
  attachments?: string[];
  departmentId?: string;
  createdAt: string;
  updatedAt: string;
  pio?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface RTIAppeal {
  id: string;
  rtiRequestId: string;
  appealNumber: string;
  appellantName: string;
  grounds: string;
  status: 'filed' | 'under_review' | 'hearing_scheduled' | 'disposed' | 'rejected';
  filedDate: string;
  hearingDate?: string;
  disposalDate?: string;
  decision?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  rtiRequest?: {
    id: string;
    requestNumber: string;
    subject: string;
  };
}

export interface CreateRTIRequestDto {
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  applicantAddress: string;
  subject: string;
  description: string;
  informationSought: string;
  feePaid: number;
  feeReceiptUrl?: string;
  attachments?: string[];
  departmentId?: string;
}

export interface UpdateRTIRequestDto extends Partial<CreateRTIRequestDto> {
  status?: 'received' | 'under_process' | 'information_provided' | 'rejected' | 'transferred' | 'appeal_filed';
  responseDate?: string;
  pioId?: string;
  faaId?: string;
  response?: string;
  rejectionReason?: string;
}

export interface CreateAppealDto {
  rtiRequestId: string;
  appellantName: string;
  grounds: string;
  attachments?: string[];
}

export interface UpdateAppealDto extends Partial<CreateAppealDto> {
  status?: 'filed' | 'under_review' | 'hearing_scheduled' | 'disposed' | 'rejected';
  hearingDate?: string;
  disposalDate?: string;
  decision?: string;
}

export const rtiKeys = {
  all: ['rti'] as const,
  requests: () => [...rtiKeys.all, 'requests'] as const,
  request: (filters: any) => [...rtiKeys.requests(), filters] as const,
  appeals: () => [...rtiKeys.all, 'appeals'] as const,
  appeal: (filters: any) => [...rtiKeys.appeals(), filters] as const,
};

export function useRTIRequests(filters?: any) {
  return useQuery({
    queryKey: rtiKeys.request(filters),
    queryFn: async () => {
      const response = await apiClient.get('/rti/requests', { params: filters });
      return response.data.data as RTIRequest[];
    },
  });
}

export function useRTIRequest(id: string) {
  return useQuery({
    queryKey: [...rtiKeys.requests(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/rti/requests/${id}`);
      return response.data.data as RTIRequest;
    },
    enabled: !!id,
  });
}

export function useRTIAppeals(filters?: any) {
  return useQuery({
    queryKey: rtiKeys.appeal(filters),
    queryFn: async () => {
      const response = await apiClient.get('/rti/appeals', { params: filters });
      return response.data.data as RTIAppeal[];
    },
  });
}

export function useCreateRTIRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRTIRequestDto) => {
      const response = await apiClient.post('/rti/requests', data);
      return response.data.data as RTIRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rtiKeys.requests() });
      toast.success('RTI request submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit RTI request');
    },
  });
}

export function useUpdateRTIRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRTIRequestDto }) => {
      const response = await apiClient.patch(`/rti/requests/${id}`, data);
      return response.data.data as RTIRequest;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: rtiKeys.requests() });
      queryClient.invalidateQueries({ queryKey: [...rtiKeys.requests(), data.id] });
      toast.success('RTI request updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update RTI request');
    },
  });
}

export function useCreateAppeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppealDto) => {
      const response = await apiClient.post('/rti/appeals', data);
      return response.data.data as RTIAppeal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rtiKeys.appeals() });
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
      const response = await apiClient.patch(`/rti/appeals/${id}`, data);
      return response.data.data as RTIAppeal;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: rtiKeys.appeals() });
      queryClient.invalidateQueries({ queryKey: [...rtiKeys.appeals(), data.id] });
      toast.success('Appeal updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update appeal');
    },
  });
}

export function useProvideResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, response }: { id: string; response: string }) => {
      const apiResponse = await apiClient.patch(`/rti/requests/${id}/respond`, { response });
      return apiResponse.data.data as RTIRequest;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: rtiKeys.requests() });
      queryClient.invalidateQueries({ queryKey: [...rtiKeys.requests(), data.id] });
      toast.success('Response provided successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to provide response');
    },
  });
}
