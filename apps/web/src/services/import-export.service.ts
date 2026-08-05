import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export interface ImportResult {
  success: number;
  failed: number;
  errors: { row: number; message: string }[];
}

export interface ImportConfig {
  module: string;
  file: File;
  mappings?: Record<string, string>;
  skipDuplicates?: boolean;
  updateExisting?: boolean;
}

export const useImportData = () => {
  return useMutation({
    mutationFn: async (config: ImportConfig) => {
      const formData = new FormData();
      formData.append('file', config.file);
      formData.append('module', config.module);
      
      if (config.mappings) {
        formData.append('mappings', JSON.stringify(config.mappings));
      }
      
      if (config.skipDuplicates !== undefined) {
        formData.append('skipDuplicates', config.skipDuplicates.toString());
      }
      
      if (config.updateExisting !== undefined) {
        formData.append('updateExisting', config.updateExisting.toString());
      }

      const response = await apiClient.post('/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data as ImportResult;
    },
    onSuccess: (data) => {
      if (data.failed === 0) {
        toast.success(`Successfully imported ${data.success} records`);
      } else {
        toast.warning(`Imported ${data.success} records, ${data.failed} failed`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to import data');
    },
  });
};

export const useExportData = () => {
  return useMutation({
    mutationFn: async (config: { module: string; filters?: any; format: 'xlsx' | 'csv' }) => {
      const response = await apiClient.get(`/export/${config.module}`, {
        params: { ...config.filters, format: config.format },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: config.format === 'xlsx' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${config.module}-${Date.now()}.${config.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    },
    onSuccess: () => {
      toast.success('Export completed successfully');
    },
    onError: (error: any) {
      toast.error(error.response?.data?.message || 'Failed to export data');
    },
  });
};

export const useDownloadTemplate = () => {
  return useMutation({
    mutationFn: async (module: string) => {
      const response = await apiClient.get(`/import/template/${module}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${module}-template.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    },
    onSuccess: () => {
      toast.success('Template downloaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to download template');
    },
  });
};

// Utility function to parse Excel file
export const parseExcelFile = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
};

// Utility function to validate import data
export const validateImportData = (data: any[], requiredFields: string[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  data.forEach((row, index) => {
    requiredFields.forEach((field) => {
      if (!row[field] || row[field].toString().trim() === '') {
        errors.push(`Row ${index + 1}: Missing required field '${field}'`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};
