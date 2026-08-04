import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Timetable {
  id: string;
  courseOfferingId: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string;
  endTime: string;
  roomId: string;
  facultyId: string;
  batchId: string;
  semester: number;
  academicYear: string;
  status: 'scheduled' | 'cancelled' | 'rescheduled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  courseOffering?: {
    id: string;
    course?: {
      id: string;
      code: string;
      name: string;
    };
  };
  room?: {
    id: string;
    name: string;
    building: string;
    capacity: number;
  };
  faculty?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  batch?: {
    id: string;
    name: string;
  };
}

export interface CreateTimetableDto {
  courseOfferingId: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string;
  endTime: string;
  roomId: string;
  facultyId: string;
  batchId: string;
  semester: number;
  academicYear: string;
  notes?: string;
}

export interface UpdateTimetableDto extends Partial<CreateTimetableDto> {
  status?: 'scheduled' | 'cancelled' | 'rescheduled';
}

export const timetableKeys = {
  all: ['timetables'] as const,
  lists: () => [...timetableKeys.all, 'list'] as const,
  list: (filters: any) => [...timetableKeys.lists(), filters] as const,
  details: () => [...timetableKeys.all, 'detail'] as const,
  detail: (id: string) => [...timetableKeys.details(), id] as const,
};

export function useTimetables(filters?: any) {
  return useQuery({
    queryKey: timetableKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/timetables', { params: filters });
      return response.data.data as Timetable[];
    },
  });
}

export function useTimetable(id: string) {
  return useQuery({
    queryKey: timetableKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/timetables/${id}`);
      return response.data.data as Timetable;
    },
    enabled: !!id,
  });
}

export function useCreateTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTimetableDto) => {
      const response = await apiClient.post('/timetables', data);
      return response.data.data as Timetable;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.lists() });
      toast.success('Timetable entry created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create timetable entry');
    },
  });
}

export function useUpdateTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTimetableDto }) => {
      const response = await apiClient.patch(`/timetables/${id}`, data);
      return response.data.data as Timetable;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.lists() });
      queryClient.invalidateQueries({ queryKey: timetableKeys.detail(data.id) });
      toast.success('Timetable entry updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update timetable entry');
    },
  });
}

export function useDeleteTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/timetables/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.lists() });
      toast.success('Timetable entry deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete timetable entry');
    },
  });
}

export function useCheckTimetableConflict() {
  return useMutation({
    mutationFn: async (data: { roomId: string; dayOfWeek: string; startTime: string; endTime: string; excludeId?: string }) => {
      const response = await apiClient.post('/timetables/check-conflict', data);
      return response.data.data as { hasConflict: boolean; conflicts: Timetable[] };
    },
  });
}
