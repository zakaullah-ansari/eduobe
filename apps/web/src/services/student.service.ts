import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Student {
  id: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  batchId: string;
  sectionId?: string;
  admissionYear: number;
  currentSemester: number;
  status: 'active' | 'graduated' | 'dropped' | 'archived';
  cgpa?: number;
  attendance?: number;
  createdAt: string;
  updatedAt: string;
  batch?: {
    id: string;
    name: string;
    program?: {
      id: string;
      name: string;
      code: string;
    };
  };
  section?: {
    id: string;
    name: string;
  };
  _count?: {
    enrollments: number;
    attendance: number;
  };
}

export interface CreateStudentDto {
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  batchId: string;
  sectionId?: string;
  admissionYear: number;
  currentSemester: number;
}

export interface UpdateStudentDto extends Partial<CreateStudentDto> {
  status?: 'active' | 'graduated' | 'dropped' | 'archived';
  cgpa?: number;
}

export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (filters: any) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
};

export function useStudents(filters?: any) {
  return useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/students', { params: filters });
      return response.data.data as Student[];
    },
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/students/${id}`);
      return response.data.data as Student;
    },
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStudentDto) => {
      const response = await apiClient.post('/students', data);
      return response.data.data as Student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success('Student created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create student');
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStudentDto }) => {
      const response = await apiClient.patch(`/students/${id}`, data);
      return response.data.data as Student;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(data.id) });
      toast.success('Student updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update student');
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/students/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success('Student archived successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to archive student');
    },
  });
}

export function useBulkImportStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/students/bulk-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success(`Successfully imported ${data.imported} students`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to import students');
    },
  });
}

export function useExportStudents() {
  return useMutation({
    mutationFn: async (filters?: any) => {
      const response = await apiClient.get('/students/export', {
        params: filters,
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success('Students exported successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to export students');
    },
  });
}
