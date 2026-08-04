import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface AttendanceAnalytics {
  courseOfferingId: string;
  courseName: string;
  totalClasses: number;
  averageAttendance: number;
  studentsAbove75: number;
  studentsBelow75: number;
  trend: Array<{
    date: string;
    percentage: number;
  }>;
}

export interface MarksAnalytics {
  courseOfferingId: string;
  courseName: string;
  averageMarks: number;
  highestMarks: number;
  lowestMarks: number;
  passPercentage: number;
  gradeDistribution: Array<{
    grade: string;
    count: number;
    percentage: number;
  }>;
}

export interface EnrollmentAnalytics {
  batchId: string;
  batchName: string;
  totalStudents: number;
  activeEnrollments: number;
  droppedStudents: number;
  courseWise: Array<{
    courseName: string;
    enrolled: number;
  }>;
}

export interface DepartmentAnalytics {
  departmentId: string;
  departmentName: string;
  totalStudents: number;
  totalFaculty: number;
  totalCourses: number;
  averageAttendance: number;
  averageMarks: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  totalCourses: number;
  totalBatches: number;
  activeEnrollments: number;
  averageAttendance: number;
  averageMarks: number;
  recentActivities: Array<{
    action: string;
    entity: string;
    timestamp: string;
    user: string;
  }>;
}

export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
  attendance: (filters: any) => [...analyticsKeys.all, 'attendance', filters] as const,
  marks: (filters: any) => [...analyticsKeys.all, 'marks', filters] as const,
  enrollment: (filters: any) => [...analyticsKeys.all, 'enrollment', filters] as const,
  department: (filters: any) => [...analyticsKeys.all, 'department', filters] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: async () => {
      const response = await apiClient.get('/analytics/dashboard');
      return response.data.data as DashboardStats;
    },
  });
}

export function useAttendanceAnalytics(filters?: any) {
  return useQuery({
    queryKey: analyticsKeys.attendance(filters),
    queryFn: async () => {
      const response = await apiClient.get('/analytics/attendance', { params: filters });
      return response.data.data as AttendanceAnalytics[];
    },
    enabled: !!filters?.courseOfferingId || !!filters?.batchId,
  });
}

export function useMarksAnalytics(filters?: any) {
  return useQuery({
    queryKey: analyticsKeys.marks(filters),
    queryFn: async () => {
      const response = await apiClient.get('/analytics/marks', { params: filters });
      return response.data.data as MarksAnalytics[];
    },
    enabled: !!filters?.courseOfferingId || !!filters?.batchId,
  });
}

export function useEnrollmentAnalytics(filters?: any) {
  return useQuery({
    queryKey: analyticsKeys.enrollment(filters),
    queryFn: async () => {
      const response = await apiClient.get('/analytics/enrollment', { params: filters });
      return response.data.data as EnrollmentAnalytics[];
    },
    enabled: !!filters?.batchId || !!filters?.departmentId,
  });
}

export function useDepartmentAnalytics(filters?: any) {
  return useQuery({
    queryKey: analyticsKeys.department(filters),
    queryFn: async () => {
      const response = await apiClient.get('/analytics/department', { params: filters });
      return response.data.data as DepartmentAnalytics[];
    },
  });
}
