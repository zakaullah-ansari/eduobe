import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Alumni {
  id: string;
  alumniNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  graduationYear: number;
  programId: string;
  departmentId: string;
  currentCompany?: string;
  currentDesignation?: string;
  location?: string;
  linkedIn?: string;
  bio?: string;
  status: 'active' | 'inactive' | 'deceased';
  achievements?: string[];
  createdAt: string;
  updatedAt: string;
  program?: {
    id: string;
    name: string;
    code: string;
  };
  department?: {
    id: string;
    name: string;
    code: string;
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
  eventType: 'reunion' | 'networking' | 'seminar' | 'workshop' | 'fundraiser' | 'other';
  eventDate: string;
  location?: string;
  organizer?: string;
  maxAttendees?: number;
  currentAttendees?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Donation {
  id: string;
  donationNumber: string;
  alumniId: string;
  amount: number;
  purpose: string;
  donationDate: string;
  paymentMethod: 'cash' | 'cheque' | 'online' | 'bank_transfer';
  transactionId?: string;
  receiptNumber?: string;
  status: 'pending' | 'received' | 'acknowledged' | 'utilized';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  alumni?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Mentorship {
  id: string;
  mentorId: string;
  menteeId: string;
  programName: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'terminated';
  meetings?: number;
  outcomes?: string;
  createdAt: string;
  updatedAt: string;
  mentor?: {
    id: string;
    firstName: string;
    lastName: string;
    currentCompany?: string;
  };
  mentee?: {
    id: string;
    firstName: string;
    lastName: string;
    program?: {
      id: string;
      name: string;
    };
  };
}

export interface CreateAlumniDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  graduationYear: number;
  programId: string;
  departmentId: string;
  currentCompany?: string;
  currentDesignation?: string;
  location?: string;
  linkedIn?: string;
  bio?: string;
  achievements?: string[];
}

export interface UpdateAlumniDto extends Partial<CreateAlumniDto> {
  status?: 'active' | 'inactive' | 'deceased';
}

export interface CreateEventDto {
  title: string;
  description?: string;
  eventType: 'reunion' | 'networking' | 'seminar' | 'workshop' | 'fundraiser' | 'other';
  eventDate: string;
  location?: string;
  organizer?: string;
  maxAttendees?: number;
  attachments?: string[];
}

export interface UpdateEventDto extends Partial<CreateEventDto> {
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  currentAttendees?: number;
}

export interface CreateDonationDto {
  alumniId: string;
  amount: number;
  purpose: string;
  donationDate: string;
  paymentMethod: 'cash' | 'cheque' | 'online' | 'bank_transfer';
  transactionId?: string;
  receiptNumber?: string;
  remarks?: string;
}

export interface UpdateDonationDto extends Partial<CreateDonationDto> {
  status?: 'pending' | 'received' | 'acknowledged' | 'utilized';
}

export interface CreateMentorshipDto {
  mentorId: string;
  menteeId: string;
  programName: string;
  startDate: string;
  endDate?: string;
  meetings?: number;
  outcomes?: string;
}

export interface UpdateMentorshipDto extends Partial<CreateMentorshipDto> {
  status?: 'active' | 'completed' | 'terminated';
}

export const alumniKeys = {
  all: ['alumni'] as const,
  profiles: () => [...alumniKeys.all, 'profiles'] as const,
  profile: (filters: any) => [...alumniKeys.profiles(), filters] as const,
  events: () => [...alumniKeys.all, 'events'] as const,
  event: (filters: any) => [...alumniKeys.events(), filters] as const,
  donations: () => [...alumniKeys.all, 'donations'] as const,
  donation: (filters: any) => [...alumniKeys.donations(), filters] as const,
  mentorships: () => [...alumniKeys.all, 'mentorships'] as const,
  mentorship: (filters: any) => [...alumniKeys.mentorships(), filters] as const,
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

export function useAlumniMentorships(filters?: any) {
  return useQuery({
    queryKey: alumniKeys.mentorship(filters),
    queryFn: async () => {
      const response = await apiClient.get('/alumni/mentorships', { params: filters });
      return response.data.data as Mentorship[];
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
      toast.error(error.response?.data?.message || 'Failed to create alumni profile');
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
      toast.success('Alumni profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update alumni profile');
    },
  });
}

export function useDeleteAlumniProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/alumni/profiles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alumniKeys.profiles() });
      toast.success('Alumni profile deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete alumni profile');
    },
  });
}

export function useCreateAlumniEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEventDto) => {
      const response = await apiClient.post('/alumni/events', data);
      return response.data.data as AlumniEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alumniKeys.events() });
      toast.success('Alumni event created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create event');
    },
  });
}

export function useUpdateAlumniEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEventDto }) => {
      const response = await apiClient.patch(`/alumni/events/${id}`, data);
      return response.data.data as AlumniEvent;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: alumniKeys.events() });
      queryClient.invalidateQueries({ queryKey: [...alumniKeys.events(), data.id] });
      toast.success('Event updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update event');
    },
  });
}

export function useCreateDonation() {
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

export function useUpdateDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDonationDto }) => {
      const response = await apiClient.patch(`/alumni/donations/${id}`, data);
      return response.data.data as Donation;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: alumniKeys.donations() });
      queryClient.invalidateQueries({ queryKey: [...alumniKeys.donations(), data.id] });
      toast.success('Donation updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update donation');
    },
  });
}

export function useCreateMentorship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMentorshipDto) => {
      const response = await apiClient.post('/alumni/mentorships', data);
      return response.data.data as Mentorship;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alumniKeys.mentorships() });
      toast.success('Mentorship program created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create mentorship');
    },
  });
}

export function useUpdateMentorship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateMentorshipDto }) => {
      const response = await apiClient.patch(`/alumni/mentorships/${id}`, data);
      return response.data.data as Mentorship;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: alumniKeys.mentorships() });
      queryClient.invalidateQueries({ queryKey: [...alumniKeys.mentorships(), data.id] });
      toast.success('Mentorship updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update mentorship');
    },
  });
}
