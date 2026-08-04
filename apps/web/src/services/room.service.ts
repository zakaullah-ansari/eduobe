import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  type: 'classroom' | 'lab' | 'lecture-hall' | 'seminar-room' | 'exam-hall';
  equipment?: string[];
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    timetables: number;
    exams: number;
  };
}

export interface CreateRoomDto {
  name: string;
  building: string;
  floor: number;
  capacity: number;
  type: 'classroom' | 'lab' | 'lecture-hall' | 'seminar-room' | 'exam-hall';
  equipment?: string[];
  notes?: string;
}

export interface UpdateRoomDto extends Partial<CreateRoomDto> {
  status?: 'available' | 'occupied' | 'maintenance' | 'reserved';
}

export const roomKeys = {
  all: ['rooms'] as const,
  lists: () => [...roomKeys.all, 'list'] as const,
  list: (filters: any) => [...roomKeys.lists(), filters] as const,
  details: () => [...roomKeys.all, 'detail'] as const,
  detail: (id: string) => [...roomKeys.details(), id] as const,
};

export function useRooms(filters?: any) {
  return useQuery({
    queryKey: roomKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/rooms', { params: filters });
      return response.data.data as Room[];
    },
  });
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: roomKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/rooms/${id}`);
      return response.data.data as Room;
    },
    enabled: !!id,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoomDto) => {
      const response = await apiClient.post('/rooms', data);
      return response.data.data as Room;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
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
      const response = await apiClient.patch(`/rooms/${id}`, data);
      return response.data.data as Room;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(data.id) });
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
      await apiClient.delete(`/rooms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
      toast.success('Room deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete room');
    },
  });
}
