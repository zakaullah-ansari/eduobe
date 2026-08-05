import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Exam {
  id: string;
  courseOfferingId: string;
  name: string;
  type: 'midterm' | 'final' | 'quiz' | 'assignment' | 'lab' | 'supplementary';
  date: string;
  startTime: string;
  endTime: string;
  roomId: string;
  duration: number;
  totalMarks: number;
  instructions?: string;
  invigilators?: string[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  seatAllocation?: any;
  createdAt: string;
  updatedAt: string;
  courseOffering?: {
    id: string;
    course?: {
      id: string;
      code: string;
      name: string;
    };
    batch?: {
      id: string;
      name: string;
    };
  };
  room?: {
    id: string;
    name: string;
    building: string;
    capacity: number;
  };
  _count?: {
    attendees: number;
  };
}

export interface CreateExamDto {
  courseOfferingId: string;
  name: string;
  type: 'midterm' | 'final' | 'quiz' | 'assignment' | 'lab' | 'supplementary';
  date: string;
  startTime: string;
  endTime: string;
  roomId: string;
  duration: number;
  totalMarks: number;
  instructions?: string;
  invigilators?: string[];
}

export interface UpdateExamDto extends Partial<CreateExamDto> {
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  seatAllocation?: any;
}

export const examKeys = {
  all: ['exams'] as const,
  lists: () => [...examKeys.all, 'list'] as const,
  list: (filters: any) => [...examKeys.lists(), filters] as const,
  details: () => [...examKeys.all, 'detail'] as const,
  detail: (id: string) => [...examKeys.details(), id] as const,
};

export function useExams(filters?: any) {
  return useQuery({
    queryKey: examKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/exams', { params: filters });
      return response.data.data as Exam[];
    },
  });
}

export function useExam(id: string) {
  return useQuery({
    queryKey: examKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/exams/${id}`);
      return response.data.data as Exam;
    },
    enabled: !!id,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExamDto) => {
      const response = await apiClient.post('/exams', data);
      return response.data.data as Exam;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      toast.success('Exam scheduled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to schedule exam');
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateExamDto }) => {
      const response = await apiClient.patch(`/exams/${id}`, data);
      return response.data.data as Exam;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      queryClient.invalidateQueries({ queryKey: examKeys.detail(data.id) });
      toast.success('Exam updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update exam');
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/exams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      toast.success('Exam deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete exam');
    },
  });
}

export function useAllocateSeats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ examId, data }: { examId: string; data: { studentIds: string[]; roomId: string } }) => {
      const response = await apiClient.post(`/exams/${examId}/allocate-seats`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      toast.success('Seats allocated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to allocate seats');
    },
  });
}
