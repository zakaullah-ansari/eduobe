import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface FeeStructure {
  id: string;
  batchId: string;
  academicYear: string;
  semester: number;
  tuitionFee: number;
  labFee: number;
  libraryFee: number;
  examFee: number;
  otherFees: number;
  totalFee: number;
  dueDate: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
  batch?: {
    id: string;
    name: string;
    program?: {
      id: string;
      name: string;
    };
  };
}

export interface Payment {
  id: string;
  studentId: string;
  feeStructureId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'online' | 'cheque' | 'bank-transfer';
  transactionId?: string;
  receiptNumber: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    rollNumber: string;
    firstName: string;
    lastName: string;
  };
  feeStructure?: {
    id: string;
    totalFee: number;
    semester: number;
  };
}

export interface CreateFeeStructureDto {
  batchId: string;
  academicYear: string;
  semester: number;
  tuitionFee: number;
  labFee: number;
  libraryFee: number;
  examFee: number;
  otherFees: number;
  dueDate: string;
}

export interface RecordPaymentDto {
  studentId: string;
  feeStructureId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'online' | 'cheque' | 'bank-transfer';
  transactionId?: string;
  remarks?: string;
}

export const feeKeys = {
  all: ['fees'] as const,
  structures: () => [...feeKeys.all, 'structures'] as const,
  structure: (filters: any) => [...feeKeys.structures(), filters] as const,
  payments: () => [...feeKeys.all, 'payments'] as const,
  payment: (filters: any) => [...feeKeys.payments(), filters] as const,
};

export function useFeeStructures(filters?: any) {
  return useQuery({
    queryKey: feeKeys.structure(filters),
    queryFn: async () => {
      const response = await apiClient.get('/fees/structures', { params: filters });
      return response.data.data as FeeStructure[];
    },
  });
}

export function usePayments(filters?: any) {
  return useQuery({
    queryKey: feeKeys.payment(filters),
    queryFn: async () => {
      const response = await apiClient.get('/fees/payments', { params: filters });
      return response.data.data as Payment[];
    },
  });
}

export function useCreateFeeStructure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFeeStructureDto) => {
      const response = await apiClient.post('/fees/structures', data);
      return response.data.data as FeeStructure;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.structures() });
      toast.success('Fee structure created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create fee structure');
    },
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RecordPaymentDto) => {
      const response = await apiClient.post('/fees/payments', data);
      return response.data.data as Payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.payments() });
      toast.success('Payment recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    },
  });
}

export function useGetStudentDues() {
  return useQuery({
    queryKey: ['student-dues'],
    queryFn: async (studentId: string) => {
      const response = await apiClient.get(`/fees/student/${studentId}/dues`);
      return response.data.data;
    },
    enabled: false,
  });
}

export function useGenerateReceipt() {
  return useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await apiClient.get(`/fees/payments/${paymentId}/receipt`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success('Receipt downloaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to download receipt');
    },
  });
}
