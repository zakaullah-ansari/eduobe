import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Marks {
  id: string;
  enrollmentId: string;
  assessmentId: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  remarks?: string;
  gradedBy?: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
  enrollment?: {
    id: string;
    student?: {
      id: string;
      rollNumber: string;
      firstName: string;
      lastName: string;
    };
  };
  assessment?: {
    id: string;
    name: string;
    type: string;
    maxMarks: number;
    weightage: number;
  };
}

export interface EnterMarksDto {
  assessmentId: string;
  marks: Array<{
    enrollmentId: string;
    marksObtained: number;
    remarks?: string;
  }>;
}

export interface UpdateMarksDto {
  marksObtained?: number;
  remarks?: string;
}

export interface StudentMarksSummary {
  studentId: string;
  studentName: string;
  rollNumber: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  grade?: string;
  assessments: Array<{
    assessmentName: string;
    marksObtained: number;
    maxMarks: number;
    percentage: number;
  }>;
}

export const marksKeys = {
  all: ['marks'] as const,
  lists: () => [...marksKeys.all, 'list'] as const,
  list: (filters: any) => [...marksKeys.lists(), filters] as const,
  summaries: () => [...marksKeys.all, 'summary'] as const,
  summary: (filters: any) => [...marksKeys.summaries(), filters] as const,
};

export function useMarks(filters?: any) {
  return useQuery({
    queryKey: marksKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/marks', { params: filters });
      return response.data.data as Marks[];
    },
  });
}

export function useMarksSummary(filters?: any) {
  return useQuery({
    queryKey: marksKeys.summary(filters),
    queryFn: async () => {
      const response = await apiClient.get('/marks/summary', { params: filters });
      return response.data.data as StudentMarksSummary[];
    },
    enabled: !!filters?.courseOfferingId,
  });
}

export function useEnterMarks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EnterMarksDto) => {
      const response = await apiClient.post('/marks/enter', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: marksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: marksKeys.summaries() });
      toast.success(`Marks entered for ${data.entered} students`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to enter marks');
    },
  });
}

export function useUpdateMarks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateMarksDto }) => {
      const response = await apiClient.patch(`/marks/${id}`, data);
      return response.data.data as Marks;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: marksKeys.summaries() });
      toast.success('Marks updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update marks');
    },
  });
}

export function useExportMarks() {
  return useMutation({
    mutationFn: async (filters?: any) => {
      const response = await apiClient.get('/marks/export', {
        params: filters,
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `marks-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success('Marks exported successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to export marks');
    },
  });
}
