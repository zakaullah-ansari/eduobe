import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface SystemSettings {
  id: string;
  institutionName: string;
  institutionCode: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  academicYearFormat: string;
  defaultLanguage: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpFromEmail?: string;
  smsProvider?: string;
  smsApiKey?: string;
  smsSenderId?: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  templateNumber: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: 'academic' | 'notification' | 'system' | 'general';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsDto {
  institutionName?: string;
  institutionCode?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  academicYearFormat?: string;
  defaultLanguage?: string;
  timezone?: string;
  dateFormat?: string;
  timeFormat?: string;
  currency?: string;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpFromEmail?: string;
  smsProvider?: string;
  smsApiKey?: string;
  smsSenderId?: string;
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
}

export interface CreateEmailTemplateDto {
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: 'academic' | 'notification' | 'system' | 'general';
}

export interface UpdateEmailTemplateDto extends Partial<CreateEmailTemplateDto> {
  status?: 'active' | 'inactive';
}

export const settingsKeys = {
  all: ['settings'] as const,
  settings: () => [...settingsKeys.all, 'settings'] as const,
  emailTemplates: () => [...settingsKeys.all, 'emailTemplates'] as const,
  emailTemplate: (filters: any) => [...settingsKeys.emailTemplates(), filters] as const,
};

export function useSystemSettings() {
  return useQuery({
    queryKey: settingsKeys.settings(),
    queryFn: async () => {
      const response = await apiClient.get('/settings');
      return response.data.data as SystemSettings;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSettingsDto) => {
      const response = await apiClient.patch('/settings', data);
      return response.data.data as SystemSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.settings() });
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    },
  });
}

export function useEmailTemplates(filters?: any) {
  return useQuery({
    queryKey: settingsKeys.emailTemplate(filters),
    queryFn: async () => {
      const response = await apiClient.get('/settings/email-templates', { params: filters });
      return response.data.data as EmailTemplate[];
    },
  });
}

export function useEmailTemplate(id: string) {
  return useQuery({
    queryKey: [...settingsKeys.emailTemplates(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/settings/email-templates/${id}`);
      return response.data.data as EmailTemplate;
    },
    enabled: !!id,
  });
}

export function useCreateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEmailTemplateDto) => {
      const response = await apiClient.post('/settings/email-templates', data);
      return response.data.data as EmailTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.emailTemplates() });
      toast.success('Email template created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create email template');
    },
  });
}

export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEmailTemplateDto }) => {
      const response = await apiClient.patch(`/settings/email-templates/${id}`, data);
      return response.data.data as EmailTemplate;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.emailTemplates() });
      queryClient.invalidateQueries({ queryKey: [...settingsKeys.emailTemplates(), data.id] });
      toast.success('Email template updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update email template');
    },
  });
}

export function useDeleteEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/settings/email-templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.emailTemplates() });
      toast.success('Email template deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete email template');
    },
  });
}

export function useTestEmail() {
  return useMutation({
    mutationFn: async (data: { to: string; subject: string; body: string }) => {
      const response = await apiClient.post('/settings/test-email', data);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Test email sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send test email');
    },
  });
}

export function useTestSMS() {
  return useMutation({
    mutationFn: async (data: { to: string; message: string }) => {
      const response = await apiClient.post('/settings/test-sms', data);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Test SMS sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send test SMS');
    },
  });
}
