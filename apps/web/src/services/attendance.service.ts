import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Attendance {
  id: string;
  studentId: string;
  courseOfferingId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
  markedBy?: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    rollNumber: string;
    firstName: string;
    lastName: string;
  };
  courseOffering?: {
    id: string;
    course?: {
      id: string;
      code: string;
      name: string;
    };
  };
}

export interface MarkAttendanceDto {
  courseOfferingId: string;
  date: string;
  attendance: Array<{
    studentId: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks?: string;
  }>;
}

export interface AttendanceReport {
  studentId: string;
  studentName: string;
  rollNumber: string;
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendancePercentage: number;
}

export const attendanceKeys = {
  all: ['attendance'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  list: (filters: any) => [...attendanceKeys.lists(), filters] as const,
  reports: () => [...attendanceKeys.all, 'report'] as const,
  report: (filters: any) => [...attendanceKeys.reports(), filters] as const,
};

export function useAttendance(filters?: any) {
  return useQuery({
    queryKey: attendanceKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/attendance', { params: filters });
      return response.data.data as Attendance[];
    },
  });
}

export function useAttendanceReport(filters?: any) {
  return useQuery({
    queryKey: attendanceKeys.report(filters),
    queryFn: async () => {
      const response = await apiClient.get('/attendance/report', { params: filters });
      return response.data.data as AttendanceReport[];
    },
    enabled: !!filters?.courseOfferingId,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MarkAttendanceDto) => {
      const response = await apiClient.post('/attendance/mark', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.reports() });
      toast.success(`Attendance marked for ${data.marked} students`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Attendance> }) => {
      const response = await apiClient.patch(`/attendance/${id}`, data);
      return response.data.data as Attendance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.reports() });
      toast.success('Attendance updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update attendance');
    },
  });
}
