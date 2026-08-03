import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

// Types
export interface Department {
  id: string;
  name: string;
  code: string;
  hodId?: string;
  description?: string;
  status: 'active' | 'archived';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  hod?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count?: {
    programs: number;
    faculty: number;
  };
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
  hodId?: string;
  description?: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  code?: string;
  hodId?: string;
  description?: string;
  status?: 'active' | 'archived';
}

// Query Keys
export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (filters: any) => [...departmentKeys.lists(), filters] as const,
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
};

// Queries
export function useDepartments(filters?: any) {
  return useQuery({
    queryKey: departmentKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/departments', { params: filters });
      return response.data.data as Department[];
    },
  });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/departments/${id}`);
      return response.data.data as Department;
    },
    enabled: !!id,
  });
}

// Mutations
export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDepartmentDto) => {
      const response = await apiClient.post('/departments', data);
      return response.data.data as Department;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      toast.success('Department created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create department');
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDepartmentDto }) => {
      const response = await apiClient.patch(`/departments/${id}`, data);
      return response.data.data as Department;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(data.id) });
      toast.success('Department updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update department');
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/departments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      toast.success('Department archived successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to archive department');
    },
  });
}
