import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Route {
  id: string;
  name: string;
  routeNumber: string;
  startPoint: string;
  endPoint: string;
  stops?: string[];
  distance?: number;
  estimatedTime?: number;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  _count?: {
    buses: number;
    subscribers: number;
  };
}

export interface Bus {
  id: string;
  busNumber: string;
  routeId: string;
  capacity: number;
  driver?: string;
  driverPhone?: string;
  vehicleType: 'bus' | 'mini-bus' | 'van';
  gpsEnabled: boolean;
  status: 'active' | 'maintenance' | 'retired';
  createdAt: string;
  updatedAt: string;
  route?: {
    id: string;
    name: string;
    routeNumber: string;
  };
  _count?: {
    subscribers: number;
  };
}

export interface Subscription {
  id: string;
  studentId: string;
  routeId: string;
  busId?: string;
  startDate: string;
  endDate: string;
  monthlyFee: number;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  status: 'active' | 'expired' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    rollNumber: string;
    firstName: string;
    lastName: string;
  };
  route?: {
    id: string;
    name: string;
    routeNumber: string;
  };
  bus?: {
    id: string;
    busNumber: string;
  };
}

export interface CreateRouteDto {
  name: string;
  routeNumber: string;
  startPoint: string;
  endPoint: string;
  stops?: string[];
  distance?: number;
  estimatedTime?: number;
}

export interface UpdateRouteDto extends Partial<CreateRouteDto> {
  status?: 'active' | 'inactive' | 'suspended';
}

export interface CreateBusDto {
  busNumber: string;
  routeId: string;
  capacity: number;
  driver?: string;
  driverPhone?: string;
  vehicleType: 'bus' | 'mini-bus' | 'van';
  gpsEnabled?: boolean;
}

export interface UpdateBusDto extends Partial<CreateBusDto> {
  status?: 'active' | 'maintenance' | 'retired';
}

export interface CreateSubscriptionDto {
  studentId: string;
  routeId: string;
  busId?: string;
  startDate: string;
  endDate: string;
  monthlyFee: number;
}

export interface UpdateSubscriptionDto extends Partial<CreateSubscriptionDto> {
  paymentStatus?: 'pending' | 'paid' | 'overdue';
  status?: 'active' | 'expired' | 'cancelled';
}

export const transportKeys = {
  all: ['transport'] as const,
  routes: () => [...transportKeys.all, 'routes'] as const,
  route: (filters: any) => [...transportKeys.routes(), filters] as const,
  buses: () => [...transportKeys.all, 'buses'] as const,
  bus: (filters: any) => [...transportKeys.buses(), filters] as const,
  subscriptions: () => [...transportKeys.all, 'subscriptions'] as const,
  subscription: (filters: any) => [...transportKeys.subscriptions(), filters] as const,
};

export function useRoutes(filters?: any) {
  return useQuery({
    queryKey: transportKeys.route(filters),
    queryFn: async () => {
      const response = await apiClient.get('/transport/routes', { params: filters });
      return response.data.data as Route[];
    },
  });
}

export function useRoute(id: string) {
  return useQuery({
    queryKey: [...transportKeys.routes(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/transport/routes/${id}`);
      return response.data.data as Route;
    },
    enabled: !!id,
  });
}

export function useBuses(filters?: any) {
  return useQuery({
    queryKey: transportKeys.bus(filters),
    queryFn: async () => {
      const response = await apiClient.get('/transport/buses', { params: filters });
      return response.data.data as Bus[];
    },
  });
}

export function useBus(id: string) {
  return useQuery({
    queryKey: [...transportKeys.buses(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/transport/buses/${id}`);
      return response.data.data as Bus;
    },
    enabled: !!id,
  });
}

export function useSubscriptions(filters?: any) {
  return useQuery({
    queryKey: transportKeys.subscription(filters),
    queryFn: async () => {
      const response = await apiClient.get('/transport/subscriptions', { params: filters });
      return response.data.data as Subscription[];
    },
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRouteDto) => {
      const response = await apiClient.post('/transport/routes', data);
      return response.data.data as Route;
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
      return response.data.data as Route;
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

export function useCreateBus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBusDto) => {
      const response = await apiClient.post('/transport/buses', data);
      return response.data.data as Bus;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportKeys.buses() });
      toast.success('Bus added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add bus');
    },
  });
}

export function useUpdateBus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBusDto }) => {
      const response = await apiClient.patch(`/transport/buses/${id}`, data);
      return response.data.data as Bus;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: transportKeys.buses() });
      queryClient.invalidateQueries({ queryKey: [...transportKeys.buses(), data.id] });
      toast.success('Bus updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update bus');
    },
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSubscriptionDto) => {
      const response = await apiClient.post('/transport/subscriptions', data);
      return response.data.data as Subscription;
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
      return response.data.data as Subscription;
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
