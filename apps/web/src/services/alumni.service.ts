import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Alumni {
  id: string;
  studentId: string;
  graduationYear: number;
  currentCompany?: string;
  currentDesignation?: string;
  location?: string;
  linkedIn?: string;
  email: string;
  phone?: string;
  bio?: string;
  achievements?: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    rollNumber: string;
    firstName: string;
    lastName: string;
  };
  _count?: {
    events: number;
    donations: number;
    mentorships: number;
  };
}

export interface AlumniEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  type: 'networking' | 'seminar' | 'workshop' | 'reunion' | 'mentorship';
  organizer?: string;
  maxAttendees?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  _count?: {
    attendees: number;
  };
}

export interface Donation {
  id: string;
  alumniId: string;
  amount: number;
  purpose: string;
  date: string;
  paymentMethod: 'cash' | 'card' | 'online' | 'cheque';
  transactionId?: string;
  receiptNumber: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  alumni?: {
    id: string;
    student?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface CreateAlumniDto {
  studentId: string;
  graduationYear: number;
  currentCompany?: string;
  currentDesignation?: string;
  location?: string;
  linkedIn?: string;
  email: string;
  phone?: string;
  bio?: string;
  achievements?: string[];
}

export interface UpdateAlumniDto extends Partial<CreateAlumniDto> {
  status?: 'active' | 'inactive';
}

export interface CreateAlumniEventDto {
  title: string;
  description?: string;
  date: string;
  location?: string;
  type: 'networking' | 'seminar' | 'workshop' | 'reunion' | 'mentorship';
  organizer?: string;
  maxAttendees?: number;
}

export interface UpdateAlumniEventDto extends Partial<CreateAlumniEventDto> {
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface CreateDonationDto {
  alumniId: string;
  amount: number;
  purpose: string;
  date: string;
  paymentMethod: 'cash' | 'card' | 'online' | 'cheque';
  transactionId?: string;
  remarks?: string;
}

export const alumniKeys = {
  all: ['alumni'] as const,
  profiles: () => [...alumniKeys.all, 'profiles'] as const,
  profile: (filters: any) => [...alumniKeys.profiles(), filters] as const,
  events: () => [...alumniKeys.all, 'events'] as const,
  event: (filters: any) => [...alumniKeys.events(), filters] as const,
  donations: () => [...alumniKeys.all, 'donations'] as const,
  donation: (filters: any) => [...alumniKeys.donations(), filters] as const,
};

export function useAlumniProfiles(filters?: any) {
  return useQuery({
    queryKey: alumniKeys.profile(filters),
    queryFn: async () => {
      const response = await apiClient.get('/alumni/profiles', { params: filters });
      return response.data.data as Alumni[];
    },
  });
}

export function useAlumniProfile(id: string) {
  return useQuery({
    queryKey: [...alumniKeys.profiles(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/alumni/profiles/${id}`);
      return response.data.data as Alumni;
    },
    enabled: !!id,
  });
}

export function useAlumniEvents(filters?: any) {
  return useQuery({
    queryKey: alumniKeys.event(filters),
    queryFn: async () => {
      const response = await apiClient.get('/alumni/events', { params: filters });
      return response.data.data as AlumniEvent[];
    },
  });
}

export function useAlumniDonations(filters?: any) {
  return useQuery({
    queryKey: alumniKeys.donation(filters),
    queryFn: async () => {
      const response = await apiClient.get('/alumni/donations', { params: filters });
      return response.data.data as Donation[];
    },
  });
}

export function useCreateAlumniProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAlumniDto) => {
      const response = await apiClient.post('/alumni/profiles', data);
      return response.data.data as Alumni;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alumniKeys.profiles() });
      toast.success('Alumni profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create profile');
    },
  });
}

export function useUpdateAlumniProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAlumniDto }) => {
      const response = await apiClient.patch(`/alumni/profiles/${id}`, data);
      return response.data.data as Alumni;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: alumniKeys.profiles() });
      queryClient.invalidateQueries({ queryKey: [...alumniKeys.profiles(), data.id] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
}

export function useCreateAlumniEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAlumniEventDto) => {
      const response = await apiClient.post('/alumni/events', data);
      return response.data.data as AlumniEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alumniKeys.events() });
      toast.success('Event created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create event');
    },
  });
}

export function useRecordDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDonationDto) => {
      const response = await apiClient.post('/alumni/donations', data);
      return response.data.data as Donation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alumniKeys.donations() });
      toast.success('Donation recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record donation');
    },
  });
}
