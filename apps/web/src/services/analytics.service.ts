import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  totalCourses: number;
  totalDepartments: number;
  totalPrograms: number;
  averageAttendance: number;
  averageCGPA: number;
  placementRate: number;
  researchPublications: number;
  totalScholarships: number;
  totalAlumni: number;
  activeEvents: number;
}

export interface AttendanceAnalytics {
  department: string;
  averageAttendance: number;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  trend: { month: string; percentage: number }[];
}

export interface AcademicPerformance {
  department: string;
  averageCGPA: number;
  highestCGPA: number;
  lowestCGPA: number;
  passPercentage: number;
  topStudents: { name: string; cgpa: number; rollNumber: string }[];
}

export interface PlacementAnalytics {
  department: string;
  totalStudents: number;
  placedStudents: number;
  placementRate: number;
  averagePackage: number;
  highestPackage: number;
  topCompanies: { name: string; count: number }[];
}

export interface ResearchAnalytics {
  department: string;
  totalPublications: number;
  totalPatents: number;
  totalGrants: number;
  totalAmount: number;
  topResearchers: { name: string; publications: number }[];
}

export interface FinancialAnalytics {
  month: string;
  totalFees: number;
  totalScholarships: number;
  totalHostelFees: number;
  totalTransportFees: number;
  totalLibraryFines: number;
}

export interface TrendData {
  month: string;
  value: number;
  label: string;
}

export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
  attendance: (filters: any) => [...analyticsKeys.all, 'attendance', filters] as const,
  performance: (filters: any) => [...analyticsKeys.all, 'performance', filters] as const,
  placement: (filters: any) => [...analyticsKeys.all, 'placement', filters] as const,
  research: (filters: any) => [...analyticsKeys.all, 'research', filters] as const,
  financial: (filters: any) => [...analyticsKeys.all, 'financial', filters] as const,
  trends: (type: string) => [...analyticsKeys.all, 'trends', type] as const,
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
  });
}

export function useAcademicPerformance(filters?: any) {
  return useQuery({
    queryKey: analyticsKeys.performance(filters),
    queryFn: async () => {
      const response = await apiClient.get('/analytics/performance', { params: filters });
      return response.data.data as AcademicPerformance[];
    },
  });
}

export function usePlacementAnalytics(filters?: any) {
  return useQuery({
    queryKey: analyticsKeys.placement(filters),
    queryFn: async () => {
      const response = await apiClient.get('/analytics/placement', { params: filters });
      return response.data.data as PlacementAnalytics[];
    },
  });
}

export function useResearchAnalytics(filters?: any) {
  return useQuery({
    queryKey: analyticsKeys.research(filters),
    queryFn: async () => {
      const response = await apiClient.get('/analytics/research', { params: filters });
      return response.data.data as ResearchAnalytics[];
    },
  });
}

export function useFinancialAnalytics(filters?: any) {
  return useQuery({
    queryKey: analyticsKeys.financial(filters),
    queryFn: async () => {
      const response = await apiClient.get('/analytics/financial', { params: filters });
      return response.data.data as FinancialAnalytics[];
    },
  });
}

export function useTrendData(type: string) {
  return useQuery({
    queryKey: analyticsKeys.trends(type),
    queryFn: async () => {
      const response = await apiClient.get(`/analytics/trends/${type}`);
      return response.data.data as TrendData[];
    },
  });
}

export function useExportAnalytics() {
  return async (type: string, filters?: any) => {
    const response = await apiClient.get(`/analytics/export/${type}`, {
      params: filters,
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}-analytics-${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };
}
