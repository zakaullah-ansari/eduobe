import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  notificationNumber: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'academic' | 'attendance' | 'examination' | 'placement' | 'hostel' | 'transport' | 'library' | 'general';
  targetAudience: 'all' | 'students' | 'faculty' | 'staff' | 'specific';
  targetIds?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'sent' | 'read' | 'archived';
  sentDate?: string;
  readCount?: number;
  totalRecipients?: number;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  sender?: { id: string; firstName: string; lastName: string; email: string };
}

export interface NotificationPreference {
  id: string;
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  categories: string[];
  quietHoursStart?: string;
  quietHoursEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'academic' | 'attendance' | 'examination' | 'placement' | 'hostel' | 'transport' | 'library' | 'general';
  targetAudience: 'all' | 'students' | 'faculty' | 'staff' | 'specific';
  targetIds?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
}

export interface UpdateNotificationDto extends Partial<CreateNotificationDto> {
  status?: 'draft' | 'sent' | 'read' | 'archived';
}

export interface UpdatePreferenceDto {
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  pushEnabled?: boolean;
  categories?: string[];
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export const notificationKeys = {
  all: ['notifications'] as const,
  notifications: () => [...notificationKeys.all, 'notifications'] as const,
  notification: (filters: any) => [...notificationKeys.notifications(), filters] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
  preference: (userId: string) => [...notificationKeys.preferences(), userId] as const,
  unread: () => [...notificationKeys.all, 'unread'] as const,
};

export function useNotifications(filters?: any) {
  return useQuery({
    queryKey: notificationKeys.notification(filters),
    queryFn: async () => {
      const response = await apiClient.get('/notifications', { params: filters });
      return response.data.data as Notification[];
    },
  });
}

export function useNotification(id: string) {
  return useQuery({
    queryKey: [...notificationKeys.notifications(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/notifications/${id}`);
      return response.data.data as Notification;
    },
    enabled: !!id,
  });
}

export function useUnreadNotifications() {
  return useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: async () => {
      const response = await apiClient.get('/notifications/unread');
      return response.data.data as Notification[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useNotificationPreferences(userId: string) {
  return useQuery({
    queryKey: notificationKeys.preference(userId),
    queryFn: async () => {
      const response = await apiClient.get(`/notifications/preferences/${userId}`);
      return response.data.data as NotificationPreference;
    },
    enabled: !!userId,
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNotificationDto) => {
      const response = await apiClient.post('/notifications', data);
      return response.data.data as Notification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.notifications() });
      toast.success('Notification created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create notification');
    },
  });
}

export function useUpdateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateNotificationDto }) => {
      const response = await apiClient.patch(`/notifications/${id}`, data);
      return response.data.data as Notification;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: [...notificationKeys.notifications(), data.id] });
      toast.success('Notification updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update notification');
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.notifications() });
      toast.success('Notification deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete notification');
    },
  });
}

export function useSendNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/notifications/${id}/send`);
      return response.data.data as Notification;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: [...notificationKeys.notifications(), data.id] });
      toast.success('Notification sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send notification');
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/notifications/${id}/read`);
      return response.data.data as Notification;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: [...notificationKeys.notifications(), data.id] });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
      toast.success('Notification marked as read');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark notification as read');
    },
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UpdatePreferenceDto }) => {
      const response = await apiClient.patch(`/notifications/preferences/${userId}`, data);
      return response.data.data as NotificationPreference;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() });
      queryClient.invalidateQueries({ queryKey: [...notificationKeys.preferences(), data.userId] });
      toast.success('Notification preferences updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update preferences');
    },
  });
}
