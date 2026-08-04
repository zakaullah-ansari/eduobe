import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface HostelRoom {
  id: string;
  roomNumber: string;
  block: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  roomType: 'single' | 'double' | 'triple' | 'dormitory';
  gender: 'male' | 'female' | 'any';
  facilities?: string[];
  monthlyRent: number;
  status: 'available' | 'full' | 'maintenance' | 'reserved';
  createdAt: string;
  updatedAt: string;
  _count?: { allocations: number };
}

export interface RoomAllocation {
  id: string;
  allocationNumber: string;
  studentId: string;
  roomId: string;
  allocationDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  student?: { id: string; firstName: string; lastName: string; rollNumber: string; program?: { id: string; name: string } };
  room?: { id: string; roomNumber: string; block: string; floor: number };
}

export interface MessMenu {
  id: string;
  menuNumber: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  menuItems: string[];
  specialNotes?: string;
  status: 'planned' | 'served' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface HostelComplaint {
  id: string;
  complaintNumber: string;
  studentId: string;
  roomId?: string;
  category: 'maintenance' | 'cleaning' | 'food' | 'security' | 'other';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'submitted' | 'under_review' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  resolution?: string;
  resolvedDate?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  student?: { id: string; firstName: string; lastName: string; rollNumber: string; room?: { id: string; roomNumber: string } };
  assignee?: { id: string; firstName: string; lastName: string };
}

export interface HostelFee {
  id: string;
  feeNumber: string;
  studentId: string;
  roomId?: string;
  feeType: 'room_rent' | 'mess_fee' | 'security_deposit' | 'other';
  amount: number;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'cash' | 'online' | 'bank_transfer';
  transactionId?: string;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  student?: { id: string; firstName: string; lastName: string; rollNumber: string };
  room?: { id: string; roomNumber: string; block: string };
}

export interface CreateRoomDto {
  roomNumber: string;
  block: string;
  floor: number;
  capacity: number;
  roomType: 'single' | 'double' | 'triple' | 'dormitory';
  gender: 'male' | 'female' | 'any';
  facilities?: string[];
  monthlyRent: number;
}

export interface UpdateRoomDto extends Partial<CreateRoomDto> {
  currentOccupancy?: number;
  status?: 'available' | 'full' | 'maintenance' | 'reserved';
}

export interface AllocateRoomDto {
  studentId: string;
  roomId: string;
  allocationDate: string;
  endDate?: string;
  remarks?: string;
}

export interface UpdateAllocationDto extends Partial<AllocateRoomDto> {
  status?: 'active' | 'completed' | 'cancelled';
}

export interface CreateMessMenuDto {
  date: string;
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  menuItems: string[];
  specialNotes?: string;
}

export interface UpdateMessMenuDto extends Partial<CreateMessMenuDto> {
  status?: 'planned' | 'served' | 'cancelled';
}

export interface CreateComplaintDto {
  studentId: string;
  roomId?: string;
  category: 'maintenance' | 'cleaning' | 'food' | 'security' | 'other';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
}

export interface UpdateComplaintDto extends Partial<CreateComplaintDto> {
  status?: 'submitted' | 'under_review' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  resolution?: string;
  resolvedDate?: string;
}

export interface CreateHostelFeeDto {
  studentId: string;
  roomId?: string;
  feeType: 'room_rent' | 'mess_fee' | 'security_deposit' | 'other';
  amount: number;
  dueDate: string;
  remarks?: string;
}

export interface UpdateHostelFeeDto extends Partial<CreateHostelFeeDto> {
  paidDate?: string;
  paymentMethod?: 'cash' | 'online' | 'bank_transfer';
  transactionId?: string;
  status?: 'pending' | 'paid' | 'overdue' | 'waived';
}

export const hostelKeys = {
  all: ['hostel'] as const,
  rooms: () => [...hostelKeys.all, 'rooms'] as const,
  room: (filters: any) => [...hostelKeys.rooms(), filters] as const,
  allocations: () => [...hostelKeys.all, 'allocations'] as const,
  allocation: (filters: any) => [...hostelKeys.allocations(), filters] as const,
  menus: () => [...hostelKeys.all, 'menus'] as const,
  menu: (filters: any) => [...hostelKeys.menus(), filters] as const,
  complaints: () => [...hostelKeys.all, 'complaints'] as const,
  complaint: (filters: any) => [...hostelKeys.complaints(), filters] as const,
  fees: () => [...hostelKeys.all, 'fees'] as const,
  fee: (filters: any) => [...hostelKeys.fees(), filters] as const,
};

export function useHostelRooms(filters?: any) {
  return useQuery({
    queryKey: hostelKeys.room(filters),
    queryFn: async () => {
      const response = await apiClient.get('/hostel/rooms', { params: filters });
      return response.data.data as HostelRoom[];
    },
  });
}

export function useHostelRoom(id: string) {
  return useQuery({
    queryKey: [...hostelKeys.rooms(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/hostel/rooms/${id}`);
      return response.data.data as HostelRoom;
    },
    enabled: !!id,
  });
}

export function useRoomAllocations(filters?: any) {
  return useQuery({
    queryKey: hostelKeys.allocation(filters),
    queryFn: async () => {
      const response = await apiClient.get('/hostel/allocations', { params: filters });
      return response.data.data as RoomAllocation[];
    },
  });
}

export function useMessMenus(filters?: any) {
  return useQuery({
    queryKey: hostelKeys.menu(filters),
    queryFn: async () => {
      const response = await apiClient.get('/hostel/menus', { params: filters });
      return response.data.data as MessMenu[];
    },
  });
}

export function useHostelComplaints(filters?: any) {
  return useQuery({
    queryKey: hostelKeys.complaint(filters),
    queryFn: async () => {
      const response = await apiClient.get('/hostel/complaints', { params: filters });
      return response.data.data as HostelComplaint[];
    },
  });
}

export function useHostelFees(filters?: any) {
  return useQuery({
    queryKey: hostelKeys.fee(filters),
    queryFn: async () => {
      const response = await apiClient.get('/hostel/fees', { params: filters });
      return response.data.data as HostelFee[];
    },
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoomDto) => {
      const response = await apiClient.post('/hostel/rooms', data);
      return response.data.data as HostelRoom;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.rooms() });
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
      const response = await apiClient.patch(`/hostel/rooms/${id}`, data);
      return response.data.data as HostelRoom;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.rooms() });
      queryClient.invalidateQueries({ queryKey: [...hostelKeys.rooms(), data.id] });
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
      await apiClient.delete(`/hostel/rooms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.rooms() });
      toast.success('Room deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete room');
    },
  });
}

export function useAllocateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AllocateRoomDto) => {
      const response = await apiClient.post('/hostel/allocations', data);
      return response.data.data as RoomAllocation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.allocations() });
      queryClient.invalidateQueries({ queryKey: hostelKeys.rooms() });
      toast.success('Room allocated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to allocate room');
    },
  });
}

export function useUpdateAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAllocationDto }) => {
      const response = await apiClient.patch(`/hostel/allocations/${id}`, data);
      return response.data.data as RoomAllocation;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.allocations() });
      queryClient.invalidateQueries({ queryKey: [...hostelKeys.allocations(), data.id] });
      queryClient.invalidateQueries({ queryKey: hostelKeys.rooms() });
      toast.success('Allocation updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update allocation');
    },
  });
}

export function useCreateMessMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMessMenuDto) => {
      const response = await apiClient.post('/hostel/menus', data);
      return response.data.data as MessMenu;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.menus() });
      toast.success('Mess menu created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create mess menu');
    },
  });
}

export function useUpdateMessMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateMessMenuDto }) => {
      const response = await apiClient.patch(`/hostel/menus/${id}`, data);
      return response.data.data as MessMenu;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.menus() });
      queryClient.invalidateQueries({ queryKey: [...hostelKeys.menus(), data.id] });
      toast.success('Mess menu updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update mess menu');
    },
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateComplaintDto) => {
      const response = await apiClient.post('/hostel/complaints', data);
      return response.data.data as HostelComplaint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.complaints() });
      toast.success('Complaint submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    },
  });
}

export function useUpdateComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateComplaintDto }) => {
      const response = await apiClient.patch(`/hostel/complaints/${id}`, data);
      return response.data.data as HostelComplaint;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.complaints() });
      queryClient.invalidateQueries({ queryKey: [...hostelKeys.complaints(), data.id] });
      toast.success('Complaint updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update complaint');
    },
  });
}

export function useCreateHostelFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateHostelFeeDto) => {
      const response = await apiClient.post('/hostel/fees', data);
      return response.data.data as HostelFee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.fees() });
      toast.success('Fee created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create fee');
    },
  });
}

export function useUpdateHostelFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateHostelFeeDto }) => {
      const response = await apiClient.patch(`/hostel/fees/${id}`, data);
      return response.data.data as HostelFee;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.fees() });
      queryClient.invalidateQueries({ queryKey: [...hostelKeys.fees(), data.id] });
      toast.success('Fee updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update fee');
    },
  });
}
