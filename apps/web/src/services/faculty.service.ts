import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Faculty {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  departmentId: string;
  designation: 'professor' | 'associate_professor' | 'assistant_professor' | 'lecturer';
  qualification: string;
  specialization?: string;
  dateOfJoining: string;
  employmentType: 'permanent' | 'contract' | 'visiting';
  status: 'active' | 'on_leave' | 'resigned' | 'retired' | 'archived';
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  _count?: {
    courseOfferings: number;
  };
}

export interface CreateFacultyDto {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  departmentId: string;
  designation: 'professor' | 'associate_professor' | 'assistant_professor' | 'lecturer';
  qualification: string;
  specialization?: string;
  dateOfJoining: string;
  employmentType: 'permanent' | 'contract' | 'visiting';
}

export interface UpdateFacultyDto extends Partial<CreateFacultyDto> {
  status?: 'active' | 'on_leave' | 'resigned' | 'retired' | 'archived';
}

export const facultyKeys = {
  all: ['faculty'] as const,
  lists: () => [...facultyKeys.all, 'list'] as const,
  list: (filters: any) => [...facultyKeys.lists(), filters] as const,
  details: () => [...facultyKeys.all, 'detail'] as const,
  detail: (id: string) => [...facultyKeys.details(), id] as const,
};

export function useFaculty(filters?: any) {
  return useQuery({
    queryKey: facultyKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/faculty', { params: filters });
      return response.data.data as Faculty[];
    },
  });
}

export function useFacultyMember(id: string) {
  return useQuery({
    queryKey: facultyKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/faculty/${id}`);
      return response.data.data as Faculty;
    },
    enabled: !!id,
  });
}

export function useCreateFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFacultyDto) => {
      const response = await apiClient.post('/faculty', data);
      return response.data.data as Faculty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facultyKeys.lists() });
      toast.success('Faculty member created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create faculty member');
    },
  });
}

export function useUpdateFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFacultyDto }) => {
      const response = await apiClient.patch(`/faculty/${id}`, data);
      return response.data.data as Faculty;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: facultyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: facultyKeys.detail(data.id) });
      toast.success('Faculty member updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update faculty member');
    },
  });
}

export function useDeleteFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/faculty/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facultyKeys.lists() });
      toast.success('Faculty member archived successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to archive faculty member');
    },
  });
}

export function useBulkImportFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/faculty/bulk-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: facultyKeys.lists() });
      toast.success(`Successfully imported ${data.imported} faculty members`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to import faculty members');
    },
  });
}

export function useExportFaculty() {
  return useMutation({
    mutationFn: async (filters?: any) => {
      const response = await apiClient.get('/faculty/export', {
        params: filters,
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `faculty-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success('Faculty members exported successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to export faculty members');
    },
  });
}
