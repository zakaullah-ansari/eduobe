import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Event {
  id: string;
  title: string;
  description?: string;
  type: 'cultural' | 'technical' | 'sports' | 'seminar' | 'workshop' | 'conference' | 'other';
  startDate: string;
  endDate: string;
  location?: string;
  organizer?: string;
  maxAttendees?: number;
  registrationFee?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  poster?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    registrations: number;
    attendees: number;
  };
}

export interface EventRegistration {
  id: string;
  eventId: string;
  studentId: string;
  registrationDate: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  transactionId?: string;
  attended: boolean;
  feedback?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  event?: {
    id: string;
    title: string;
    type: string;
  };
  student?: {
    id: string;
    rollNumber: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateEventDto {
  title: string;
  description?: string;
  type: 'cultural' | 'technical' | 'sports' | 'seminar' | 'workshop' | 'conference' | 'other';
  startDate: string;
  endDate: string;
  location?: string;
  organizer?: string;
  maxAttendees?: number;
  registrationFee?: number;
  poster?: string;
  website?: string;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface RegisterForEventDto {
  eventId: string;
  transactionId?: string;
}

export interface MarkAttendanceDto {
  registrationId: string;
  attended: boolean;
}

export interface SubmitFeedbackDto {
  registrationId: string;
  feedback: string;
  rating: number;
}

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: any) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  registrations: () => [...eventKeys.all, 'registrations'] as const,
  registration: (filters: any) => [...eventKeys.registrations(), filters] as const,
};

export function useEvents(filters?: any) {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/events', { params: filters });
      return response.data.data as Event[];
    },
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/events/${id}`);
      return response.data.data as Event;
    },
    enabled: !!id,
  });
}

export function useEventRegistrations(filters?: any) {
  return useQuery({
    queryKey: eventKeys.registration(filters),
    queryFn: async () => {
      const response = await apiClient.get('/events/registrations', { params: filters });
      return response.data.data as EventRegistration[];
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEventDto) => {
      const response = await apiClient.post('/events', data);
      return response.data.data as Event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      toast.success('Event created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create event');
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEventDto }) => {
      const response = await apiClient.patch(`/events/${id}`, data);
      return response.data.data as Event;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(data.id) });
      toast.success('Event updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update event');
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      toast.success('Event deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    },
  });
}

export function useRegisterForEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterForEventDto) => {
      const response = await apiClient.post('/events/registrations', data);
      return response.data.data as EventRegistration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.registrations() });
      toast.success('Registered for event successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to register for event');
    },
  });
}

export function useMarkEventAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MarkAttendanceDto) => {
      const response = await apiClient.patch('/events/registrations/attendance', data);
      return response.data.data as EventRegistration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.registrations() });
      toast.success('Attendance marked successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    },
  });
}

export function useSubmitEventFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubmitFeedbackDto) => {
      const response = await apiClient.post('/events/registrations/feedback', data);
      return response.data.data as EventRegistration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.registrations() });
      toast.success('Feedback submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    },
  });
}
