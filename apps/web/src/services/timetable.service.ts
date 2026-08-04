import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface TimetableClass {
  id: string;
  classNumber: string;
  courseOfferingId: string;
  facultyId: string;
  roomId: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string;
  endTime: string;
  semesterId: string;
  academicYearId: string;
  classType: 'lecture' | 'tutorial' | 'lab' | 'seminar' | 'other';
  status: 'scheduled' | 'cancelled' | 'rescheduled';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  courseOffering?: { id: string; course?: { id: string; name: string; code: string } };
  faculty?: { id: string; firstName: string; lastName: string };
  room?: { id: string; name: string; building?: string; capacity?: number };
  semester?: { id: string; name: string; number: number };
}

export interface Room {
  id: string;
  roomNumber: string;
  name: string;
  building?: string;
  floor?: number;
  capacity: number;
  roomType: 'classroom' | 'lab' | 'seminar' | 'auditorium' | 'other';
  facilities?: string[];
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  createdAt: string;
  updatedAt: string;
  _count?: { classes: number };
}

export interface TimetableConflict {
  id: string;
  conflictNumber: string;
  conflictType: 'room' | 'faculty' | 'student';
  description: string;
  class1Id: string;
  class2Id: string;
  detectedDate: string;
  status: 'detected' | 'resolved' | 'ignored';
  resolution?: string;
  resolvedBy?: string;
  resolvedDate?: string;
  createdAt: string;
  updatedAt: string;
  class1?: { id: string; classNumber: string; courseOffering?: { id: string; course?: { id: string; name: string } } };
  class2?: { id: string; classNumber: string; courseOffering?: { id: string; course?: { id: string; name: string } } };
}

export interface CreateClassDto {
  courseOfferingId: string;
  facultyId: string;
  roomId: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string;
  endTime: string;
  semesterId: string;
  academicYearId: string;
  classType: 'lecture' | 'tutorial' | 'lab' | 'seminar' | 'other';
  remarks?: string;
}

export interface UpdateClassDto extends Partial<CreateClassDto> {
  status?: 'scheduled' | 'cancelled' | 'rescheduled';
}

export interface CreateRoomDto {
  roomNumber: string;
  name: string;
  building?: string;
  floor?: number;
  capacity: number;
  roomType: 'classroom' | 'lab' | 'seminar' | 'auditorium' | 'other';
  facilities?: string[];
}

export interface UpdateRoomDto extends Partial<CreateRoomDto> {
  status?: 'available' | 'occupied' | 'maintenance' | 'reserved';
}

export interface ResolveConflictDto {
  resolution: string;
  status: 'resolved' | 'ignored';
}

export const timetableKeys = {
  all: ['timetable'] as const,
  classes: () => [...timetableKeys.all, 'classes'] as const,
  class: (filters: any) => [...timetableKeys.classes(), filters] as const,
  rooms: () => [...timetableKeys.all, 'rooms'] as const,
  room: (filters: any) => [...timetableKeys.rooms(), filters] as const,
  conflicts: () => [...timetableKeys.all, 'conflicts'] as const,
  conflict: (filters: any) => [...timetableKeys.conflicts(), filters] as const,
};

export function useTimetableClasses(filters?: any) {
  return useQuery({
    queryKey: timetableKeys.class(filters),
    queryFn: async () => {
      const response = await apiClient.get('/timetable/classes', { params: filters });
      return response.data.data as TimetableClass[];
    },
  });
}

export function useTimetableClass(id: string) {
  return useQuery({
    queryKey: [...timetableKeys.classes(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/timetable/classes/${id}`);
      return response.data.data as TimetableClass;
    },
    enabled: !!id,
  });
}

export function useRooms(filters?: any) {
  return useQuery({
    queryKey: timetableKeys.room(filters),
    queryFn: async () => {
      const response = await apiClient.get('/timetable/rooms', { params: filters });
      return response.data.data as Room[];
    },
  });
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: [...timetableKeys.rooms(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/timetable/rooms/${id}`);
      return response.data.data as Room;
    },
    enabled: !!id,
  });
}

export function useTimetableConflicts(filters?: any) {
  return useQuery({
    queryKey: timetableKeys.conflict(filters),
    queryFn: async () => {
      const response = await apiClient.get('/timetable/conflicts', { params: filters });
      return response.data.data as TimetableConflict[];
    },
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClassDto) => {
      const response = await apiClient.post('/timetable/classes', data);
      return response.data.data as TimetableClass;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.classes() });
      queryClient.invalidateQueries({ queryKey: timetableKeys.conflicts() });
      toast.success('Class scheduled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to schedule class');
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateClassDto }) => {
      const response = await apiClient.patch(`/timetable/classes/${id}`, data);
      return response.data.data as TimetableClass;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.classes() });
      queryClient.invalidateQueries({ queryKey: [...timetableKeys.classes(), data.id] });
      queryClient.invalidateQueries({ queryKey: timetableKeys.conflicts() });
      toast.success('Class updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update class');
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/timetable/classes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.classes() });
      queryClient.invalidateQueries({ queryKey: timetableKeys.conflicts() });
      toast.success('Class deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete class');
    },
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoomDto) => {
      const response = await apiClient.post('/timetable/rooms', data);
      return response.data.data as Room;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.rooms() });
      toast.success('Room created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create room');
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRoomDto }) => {
      const response = await apiClient.patch(`/timetable/rooms/${id}`, data);
      return response.data.data as Room;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.rooms() });
      queryClient.invalidateQueries({ queryKey: [...timetableKeys.rooms(), data.id] });
      toast.success('Room updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update room');
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/timetable/rooms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.rooms() });
      toast.success('Room deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete room');
    },
  });
}

export function useResolveConflict() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ResolveConflictDto }) => {
      const response = await apiClient.patch(`/timetable/conflicts/${id}`, data);
      return response.data.data as TimetableConflict;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.conflicts() });
      queryClient.invalidateQueries({ queryKey: [...timetableKeys.conflicts(), data.id] });
      toast.success('Conflict resolved successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to resolve conflict');
    },
  });
}

export function useDetectConflicts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (semesterId: string) => {
      const response = await apiClient.post(`/timetable/conflicts/detect`, { semesterId });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.conflicts() });
      toast.success('Conflicts detected successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to detect conflicts');
    },
  });
}

export function useGenerateTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { semesterId: string; academicYearId: string }) => {
      const response = await apiClient.post('/timetable/generate', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.classes() });
      toast.success('Timetable generated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate timetable');
    },
  });
}
