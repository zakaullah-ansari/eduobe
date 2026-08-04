import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface TransportRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  stops?: string[];
  distance?: number;
  estimatedTime?: number;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  _count?: { schedules: number; subscriptions: number };
}

export interface TransportSchedule {
  id: string;
  scheduleNumber: string;
  routeId: string;
  vehicleNumber: string;
  driverName?: string;
  driverPhone?: string;
  departureTime: string;
  arrivalTime: string;
  daysOfWeek: string[];
  status: 'active' | 'inactive' | 'cancelled';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  route?: { id: string; routeNumber: string; routeName: string };
  _count?: { subscriptions: number };
}

export interface TransportSubscription {
  id: string;
  subscriptionNumber: string;
  studentId: string;
  scheduleId: string;
  startDate: string;
  endDate: string;
  monthlyFee: number;
  pickupPoint?: string;
  status: 'active' | 'expired' | 'cancelled';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  student?: { id: string; firstName: string; lastName: string; rollNumber: string; program?: { id: string; name: string } };
  schedule?: { id: string; scheduleNumber: string; route?: { id: string; routeName: string } };
}

export interface TransportFee {
  id: string;
  feeNumber: string;
  studentId: string;
  subscriptionId?: string;
  feeType: 'monthly_fee' | 'registration_fee' | 'penalty' | 'other';
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
  subscription?: { id: string; subscriptionNumber: string; schedule?: { id: string; route?: { id: string; routeName: string } } };
}

export interface CreateRouteDto {
  routeNumber: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  stops?: string[];
  distance?: number;
  estimatedTime?: number;
}

export interface UpdateRouteDto extends Partial<CreateRouteDto> {
  status?: 'active' | 'inactive' | 'suspended';
}

export interface CreateScheduleDto {
  routeId: string;
  vehicleNumber: string;
  driverName?: string;
  driverPhone?: string;
  departureTime: string;
  arrivalTime: string;
  daysOfWeek: string[];
  remarks?: string;
}

export interface UpdateScheduleDto extends Partial<CreateScheduleDto> {
  status?: 'active' | 'inactive' | 'cancelled';
}

export interface CreateSubscriptionDto {
  studentId: string;
  scheduleId: string;
  startDate: string;
  endDate: string;
  monthlyFee: number;
  pickupPoint?: string;
  remarks?: string;
}

export interface UpdateSubscriptionDto extends Partial<CreateSubscriptionDto> {
  status?: 'active' | 'expired' | 'cancelled';
}

export interface CreateTransportFeeDto {
  studentId: string;
  subscriptionId?: string;
  feeType: 'monthly_fee' | 'registration_fee' | 'penalty' | 'other';
  amount: number;
  dueDate: string;
  remarks?: string;
}

export interface UpdateTransportFeeDto extends Partial<CreateTransportFeeDto> {
  paidDate?: string;
  paymentMethod?: 'cash' | 'online' | 'bank_transfer';
  transactionId?: string;
  status?: 'pending' | 'paid' | 'overdue' | 'waived';
}

export const transportKeys = {
  all: ['transport'] as const,
  routes: () => [...transportKeys.all, 'routes'] as const,
  route: (filters: any) => [...transportKeys.routes(), filters] as const,
  schedules: () => [...transportKeys.all, 'schedules'] as const,
  schedule: (filters: any) => [...transportKeys.schedules(), filters] as const,
  subscriptions: () => [...transportKeys.all, 'subscriptions'] as const,
  subscription: (filters: any) => [...transportKeys.subscriptions(), filters] as const,
  fees: () => [...transportKeys.all, 'fees'] as const,
  fee: (filters: any) => [...transportKeys.fees(), filters] as const,
};

export function useTransportRoutes(filters?: any) {
  return useQuery({
    queryKey: transportKeys.route(filters),
    queryFn: async () => {
      const response = await apiClient.get('/transport/routes', { params: filters });
      return response.data.data as TransportRoute[];
    },
  });
}

export function useTransportRoute(id: string) {
  return useQuery({
    queryKey: [...transportKeys.routes(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/transport/routes/${id}`);
      return response.data.data as TransportRoute;
    },
    enabled: !!id,
  });
}

export function useTransportSchedules(filters?: any) {
  return useQuery({
    queryKey: transportKeys.schedule(filters),
    queryFn: async () => {
      const response = await apiClient.get('/transport/schedules', { params: filters });
      return response.data.data as TransportSchedule[];
    },
  });
}

export function useTransportSubscriptions(filters?: any) {
  return useQuery({
    queryKey: transportKeys.subscription(filters),
    queryFn: async () => {
      const response = await apiClient.get('/transport/subscriptions', { params: filters });
      return response.data.data as TransportSubscription[];
    },
  });
}

export function useTransportFees(filters?: any) {
  return useQuery({
    queryKey: transportKeys.fee(filters),
    queryFn: async () => {
      const response = await apiClient.get('/transport/fees', { params: filters });
      return response.data.data as TransportFee[];
    },
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRouteDto) => {
      const response = await apiClient.post('/transport/routes', data);
      return response.data.data as TransportRoute;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportKeys.routes() });
      toast.success('Route created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create route');
    },
  });
}

export function useUpdateRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRouteDto }) => {
      const response = await apiClient.patch(`/transport/routes/${id}`, data);
      return response.data.data as TransportRoute;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: transportKeys.routes() });
      queryClient.invalidateQueries({ queryKey: [...transportKeys.routes(), data.id] });
      toast.success('Route updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update route');
    },
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/transport/routes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportKeys.routes() });
      toast.success('Route deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete route');
    },
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateScheduleDto) => {
      const response = await apiClient.post('/transport/schedules', data);
      return response.data.data as TransportSchedule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportKeys.schedules() });
      toast.success('Schedule created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create schedule');
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateScheduleDto }) => {
      const response = await apiClient.patch(`/transport/schedules/${id}`, data);
      return response.data.data as TransportSchedule;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: transportKeys.schedules() });
      queryClient.invalidateQueries({ queryKey: [...transportKeys.schedules(), data.id] });
      toast.success('Schedule updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update schedule');
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/transport/schedules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportKeys.schedules() });
      toast.success('Schedule deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete schedule');
    },
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSubscriptionDto) => {
      const response = await apiClient.post('/transport/subscriptions', data);
      return response.data.data as TransportSubscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportKeys.subscriptions() });
      toast.success('Subscription created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create subscription');
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSubscriptionDto }) => {
      const response = await apiClient.patch(`/transport/subscriptions/${id}`, data);
      return response.data.data as TransportSubscription;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: transportKeys.subscriptions() });
      queryClient.invalidateQueries({ queryKey: [...transportKeys.subscriptions(), data.id] });
      toast.success('Subscription updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update subscription');
    },
  });
}

export function useCreateTransportFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTransportFeeDto) => {
      const response = await apiClient.post('/transport/fees', data);
      return response.data.data as TransportFee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportKeys.fees() });
      toast.success('Fee created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create fee');
    },
  });
}

export function useUpdateTransportFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTransportFeeDto }) => {
      const response = await apiClient.patch(`/transport/fees/${id}`, data);
      return response.data.data as TransportFee;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: transportKeys.fees() });
      queryClient.invalidateQueries({ queryKey: [...transportKeys.fees(), data.id] });
      toast.success('Fee updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update fee');
    },
  });
}
