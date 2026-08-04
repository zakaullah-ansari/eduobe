import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Achievement {
  id: string;
  achievementNumber: string;
  studentId: string;
  title: string;
  description?: string;
  category: 'academic' | 'sports' | 'cultural' | 'technical' | 'leadership' | 'community_service' | 'other';
  level: 'department' | 'college' | 'university' | 'state' | 'national' | 'international';
  achievementDate: string;
  organizer?: string;
  position?: string;
  prize?: string;
  certificateUrl?: string;
  status: 'reported' | 'verified' | 'published' | 'rejected';
  verifiedBy?: string;
  verifiedDate?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
    program?: {
      id: string;
      name: string;
    };
  };
}

export interface Award {
  id: string;
  awardNumber: string;
  title: string;
  description?: string;
  category: 'academic_excellence' | 'research' | 'sports' | 'cultural' | 'leadership' | 'community_service' | 'overall_excellence' | 'other';
  recipientType: 'student' | 'faculty' | 'staff' | 'alumni';
  recipientId: string;
  awardDate: string;
  awardingAuthority: string;
  prizeAmount?: number;
  certificateUrl?: string;
  status: 'nominated' | 'selected' | 'awarded' | 'declined';
  remarks?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  recipient?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateAchievementDto {
  studentId: string;
  title: string;
  description?: string;
  category: 'academic' | 'sports' | 'cultural' | 'technical' | 'leadership' | 'community_service' | 'other';
  level: 'department' | 'college' | 'university' | 'state' | 'national' | 'international';
  achievementDate: string;
  organizer?: string;
  position?: string;
  prize?: string;
  certificateUrl?: string;
  attachments?: string[];
}

export interface UpdateAchievementDto extends Partial<CreateAchievementDto> {
  status?: 'reported' | 'verified' | 'published' | 'rejected';
  verifiedBy?: string;
  verifiedDate?: string;
}

export interface CreateAwardDto {
  title: string;
  description?: string;
  category: 'academic_excellence' | 'research' | 'sports' | 'cultural' | 'leadership' | 'community_service' | 'overall_excellence' | 'other';
  recipientType: 'student' | 'faculty' | 'staff' | 'alumni';
  recipientId: string;
  awardDate: string;
  awardingAuthority: string;
  prizeAmount?: number;
  certificateUrl?: string;
  remarks?: string;
  attachments?: string[];
}

export interface UpdateAwardDto extends Partial<CreateAwardDto> {
  status?: 'nominated' | 'selected' | 'awarded' | 'declined';
}

export const achievementKeys = {
  all: ['achievements'] as const,
  achievements: () => [...achievementKeys.all, 'achievements'] as const,
  achievement: (filters: any) => [...achievementKeys.achievements(), filters] as const,
  awards: () => [...achievementKeys.all, 'awards'] as const,
  award: (filters: any) => [...achievementKeys.awards(), filters] as const,
};

export function useAchievements(filters?: any) {
  return useQuery({
    queryKey: achievementKeys.achievement(filters),
    queryFn: async () => {
      const response = await apiClient.get('/achievements', { params: filters });
      return response.data.data as Achievement[];
    },
  });
}

export function useAchievement(id: string) {
  return useQuery({
    queryKey: [...achievementKeys.achievements(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/achievements/${id}`);
      return response.data.data as Achievement;
    },
    enabled: !!id,
  });
}

export function useAwards(filters?: any) {
  return useQuery({
    queryKey: achievementKeys.award(filters),
    queryFn: async () => {
      const response = await apiClient.get('/achievements/awards', { params: filters });
      return response.data.data as Award[];
    },
  });
}

export function useAward(id: string) {
  return useQuery({
    queryKey: [...achievementKeys.awards(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/achievements/awards/${id}`);
      return response.data.data as Award;
    },
    enabled: !!id,
  });
}

export function useCreateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAchievementDto) => {
      const response = await apiClient.post('/achievements', data);
      return response.data.data as Achievement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.achievements() });
      toast.success('Achievement reported successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to report achievement');
    },
  });
}

export function useUpdateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAchievementDto }) => {
      const response = await apiClient.patch(`/achievements/${id}`, data);
      return response.data.data as Achievement;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.achievements() });
      queryClient.invalidateQueries({ queryKey: [...achievementKeys.achievements(), data.id] });
      toast.success('Achievement updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update achievement');
    },
  });
}

export function useDeleteAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/achievements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.achievements() });
      toast.success('Achievement deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete achievement');
    },
  });
}

export function useVerifyAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, verifiedBy }: { id: string; verifiedBy: string }) => {
      const response = await apiClient.patch(`/achievements/${id}/verify`, { verifiedBy });
      return response.data.data as Achievement;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.achievements() });
      queryClient.invalidateQueries({ queryKey: [...achievementKeys.achievements(), data.id] });
      toast.success('Achievement verified successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to verify achievement');
    },
  });
}

export function useCreateAward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAwardDto) => {
      const response = await apiClient.post('/achievements/awards', data);
      return response.data.data as Award;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.awards() });
      toast.success('Award created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create award');
    },
  });
}

export function useUpdateAward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAwardDto }) => {
      const response = await apiClient.patch(`/achievements/awards/${id}`, data);
      return response.data.data as Award;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.awards() });
      queryClient.invalidateQueries({ queryKey: [...achievementKeys.awards(), data.id] });
      toast.success('Award updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update award');
    },
  });
}

export function useDeleteAward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/achievements/awards/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.awards() });
      toast.success('Award deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete award');
    },
  });
}
