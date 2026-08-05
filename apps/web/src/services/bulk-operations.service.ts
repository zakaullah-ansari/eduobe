import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface BulkOperationResult {
  success: number;
  failed: number;
  errors: { id: string; message: string }[];
}

export interface BulkDeleteConfig {
  module: string;
  ids: string[];
}

export interface BulkUpdateConfig {
  module: string;
  ids: string[];
  updates: Record<string, any>;
}

export interface BulkAssignConfig {
  module: string;
  ids: string[];
  assignTo: string;
  assignValue: string;
}

export const useBulkDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: BulkDeleteConfig) => {
      const response = await apiClient.post(`/bulk/${config.module}/delete`, {
        ids: config.ids,
      });

      return response.data.data as BulkOperationResult;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.module] });
      
      if (data.failed === 0) {
        toast.success(`Successfully deleted ${data.success} records`);
      } else {
        toast.warning(`Deleted ${data.success} records, ${data.failed} failed`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete records');
    },
  });
};

export const useBulkUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: BulkUpdateConfig) => {
      const response = await apiClient.post(`/bulk/${config.module}/update`, {
        ids: config.ids,
        updates: config.updates,
      });

      return response.data.data as BulkOperationResult;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.module] });
      
      if (data.failed === 0) {
        toast.success(`Successfully updated ${data.success} records`);
      } else {
        toast.warning(`Updated ${data.success} records, ${data.failed} failed`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update records');
    },
  });
};

export const useBulkAssign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: BulkAssignConfig) => {
      const response = await apiClient.post(`/bulk/${config.module}/assign`, {
        ids: config.ids,
        assignTo: config.assignTo,
        assignValue: config.assignValue,
      });

      return response.data.data as BulkOperationResult;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.module] });
      
      if (data.failed === 0) {
        toast.success(`Successfully assigned ${data.success} records`);
      } else {
        toast.warning(`Assigned ${data.success} records, ${data.failed} failed`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign records');
    },
  });
};

export const useBulkApprove = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: { module: string; ids: string[] }) => {
      const response = await apiClient.post(`/bulk/${config.module}/approve`, {
        ids: config.ids,
      });

      return response.data.data as BulkOperationResult;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.module] });
      
      if (data.failed === 0) {
        toast.success(`Successfully approved ${data.success} records`);
      } else {
        toast.warning(`Approved ${data.success} records, ${data.failed} failed`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve records');
    },
  });
};

export const useBulkReject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: { module: string; ids: string[]; reason?: string }) => {
      const response = await apiClient.post(`/bulk/${config.module}/reject`, {
        ids: config.ids,
        reason: config.reason,
      });

      return response.data.data as BulkOperationResult;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.module] });
      
      if (data.failed === 0) {
        toast.success(`Successfully rejected ${data.success} records`);
      } else {
        toast.warning(`Rejected ${data.success} records, ${data.failed} failed`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject records');
    },
  });
};

// Utility function to select all visible records
export const selectAllRecords = <T extends { id: string }>(
  data: T[],
  selectedIds: Set<string>,
  selectAll: boolean
): Set<string> => {
  if (selectAll) {
    return new Set(data.map((item) => item.id));
  }
  return new Set();
};

// Utility function to toggle selection
export const toggleSelection = (
  selectedIds: Set<string>,
  id: string
): Set<string> => {
  const newSelection = new Set(selectedIds);
  
  if (newSelection.has(id)) {
    newSelection.delete(id);
  } else {
    newSelection.add(id);
  }
  
  return newSelection;
};

// Utility function to get selected count
export const getSelectedCount = (selectedIds: Set<string>): number => {
  return selectedIds.size;
};
