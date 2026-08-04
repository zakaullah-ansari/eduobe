import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface ExamSchedule {
  id: string;
  scheduleNumber: string;
  examType: 'midterm' | 'endterm' | 'supplementary' | 'revaluation' | 'other';
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  academicYearId: string;
  semesterId: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  instructions?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  academicYear?: { id: string; name: string };
  semester?: { id: string; name: string; number: number };
  _count?: { exams: number; hallTickets: number };
}

export interface Exam {
  id: string;
  examNumber: string;
  scheduleId: string;
  courseOfferingId: string;
  examDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxMarks: number;
  passMarks: number;
  roomIds?: string[];
  invigilators?: string[];
  instructions?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  schedule?: { id: string; title: string; examType: string };
  courseOffering?: { id: string; course?: { id: string; name: string; code: string } };
  _count?: { results: number };
}

export interface HallTicket {
  id: string;
  hallTicketNumber: string;
  studentId: string;
  scheduleId: string;
  generatedDate: string;
  seatNumber?: string;
  roomName?: string;
  status: 'generated' | 'downloaded' | 'printed';
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
  student?: { id: string; firstName: string; lastName: string; rollNumber: string; program?: { id: string; name: string } };
  schedule?: { id: string; title: string };
}

export interface ExamResult {
  id: string;
  resultNumber: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade?: string;
  gradePoints?: number;
  status: 'pass' | 'fail' | 'absent' | 'withheld';
  remarks?: string;
  publishedDate?: string;
  createdAt: string;
  updatedAt: string;
  exam?: { id: string; examNumber: string; courseOffering?: { id: string; course?: { id: string; name: string; code: string } } };
  student?: { id: string; firstName: string; lastName: string; rollNumber: string };
}

export interface CreateScheduleDto {
  examType: 'midterm' | 'endterm' | 'supplementary' | 'revaluation' | 'other';
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  academicYearId: string;
  semesterId: string;
  instructions?: string;
  attachments?: string[];
}

export interface UpdateScheduleDto extends Partial<CreateScheduleDto> {
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface CreateExamDto {
  scheduleId: string;
  courseOfferingId: string;
  examDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxMarks: number;
  passMarks: number;
  roomIds?: string[];
  invigilators?: string[];
  instructions?: string;
}

export interface UpdateExamDto extends Partial<CreateExamDto> {
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface CreateHallTicketDto {
  studentId: string;
  scheduleId: string;
  seatNumber?: string;
  roomName?: string;
}

export interface CreateResultDto {
  examId: string;
  studentId: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade?: string;
  gradePoints?: number;
  status: 'pass' | 'fail' | 'absent' | 'withheld';
  remarks?: string;
}

export interface UpdateResultDto extends Partial<CreateResultDto> {
  publishedDate?: string;
}

export const examinationKeys = {
  all: ['examinations'] as const,
  schedules: () => [...examinationKeys.all, 'schedules'] as const,
  schedule: (filters: any) => [...examinationKeys.schedules(), filters] as const,
  exams: () => [...examinationKeys.all, 'exams'] as const,
  exam: (filters: any) => [...examinationKeys.exams(), filters] as const,
  hallTickets: () => [...examinationKeys.all, 'hallTickets'] as const,
  hallTicket: (filters: any) => [...examinationKeys.hallTickets(), filters] as const,
  results: () => [...examinationKeys.all, 'results'] as const,
  result: (filters: any) => [...examinationKeys.results(), filters] as const,
};

export function useExamSchedules(filters?: any) {
  return useQuery({
    queryKey: examinationKeys.schedule(filters),
    queryFn: async () => {
      const response = await apiClient.get('/examinations/schedules', { params: filters });
      return response.data.data as ExamSchedule[];
    },
  });
}

export function useExamSchedule(id: string) {
  return useQuery({
    queryKey: [...examinationKeys.schedules(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/examinations/schedules/${id}`);
      return response.data.data as ExamSchedule;
    },
    enabled: !!id,
  });
}

export function useExams(filters?: any) {
  return useQuery({
    queryKey: examinationKeys.exam(filters),
    queryFn: async () => {
      const response = await apiClient.get('/examinations/exams', { params: filters });
      return response.data.data as Exam[];
    },
  });
}

export function useHallTickets(filters?: any) {
  return useQuery({
    queryKey: examinationKeys.hallTicket(filters),
    queryFn: async () => {
      const response = await apiClient.get('/examinations/hall-tickets', { params: filters });
      return response.data.data as HallTicket[];
    },
  });
}

export function useExamResults(filters?: any) {
  return useQuery({
    queryKey: examinationKeys.result(filters),
    queryFn: async () => {
      const response = await apiClient.get('/examinations/results', { params: filters });
      return response.data.data as ExamResult[];
    },
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateScheduleDto) => {
      const response = await apiClient.post('/examinations/schedules', data);
      return response.data.data as ExamSchedule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examinationKeys.schedules() });
      toast.success('Exam schedule created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create schedule');
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateScheduleDto }) => {
      const response = await apiClient.patch(`/examinations/schedules/${id}`, data);
      return response.data.data as ExamSchedule;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: examinationKeys.schedules() });
      queryClient.invalidateQueries({ queryKey: [...examinationKeys.schedules(), data.id] });
      toast.success('Schedule updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update schedule');
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/examinations/schedules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examinationKeys.schedules() });
      toast.success('Schedule deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete schedule');
    },
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExamDto) => {
      const response = await apiClient.post('/examinations/exams', data);
      return response.data.data as Exam;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examinationKeys.exams() });
      toast.success('Exam created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create exam');
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateExamDto }) => {
      const response = await apiClient.patch(`/examinations/exams/${id}`, data);
      return response.data.data as Exam;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: examinationKeys.exams() });
      queryClient.invalidateQueries({ queryKey: [...examinationKeys.exams(), data.id] });
      toast.success('Exam updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update exam');
    },
  });
}

export function useGenerateHallTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateHallTicketDto) => {
      const response = await apiClient.post('/examinations/hall-tickets', data);
      return response.data.data as HallTicket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examinationKeys.hallTickets() });
      toast.success('Hall ticket generated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate hall ticket');
    },
  });
}

export function useCreateResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateResultDto) => {
      const response = await apiClient.post('/examinations/results', data);
      return response.data.data as ExamResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examinationKeys.results() });
      toast.success('Result created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create result');
    },
  });
}

export function useUpdateResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateResultDto }) => {
      const response = await apiClient.patch(`/examinations/results/${id}`, data);
      return response.data.data as ExamResult;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: examinationKeys.results() });
      queryClient.invalidateQueries({ queryKey: [...examinationKeys.results(), data.id] });
      toast.success('Result updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update result');
    },
  });
}

export function usePublishResults() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleId: string) => {
      const response = await apiClient.post(`/examinations/schedules/${scheduleId}/publish-results`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examinationKeys.results() });
      toast.success('Results published successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to publish results');
    },
  });
}
