import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

// Login
export function useLogin() {
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: (data: { email: string; password: string; tenantId?: string }) =>
      apiClient.post('/auth/login', data),
    onSuccess: (response) => {
      const { accessToken, user } = response.data.data;
      setToken(accessToken);
      setUser(user);
      document.cookie = `auth-token=${accessToken}; path=/; max-age=${15 * 60}`;
    },
  });
}

// Register
export function useRegister() {
  return useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      tenantId: string;
      phone?: string;
    }) => apiClient.post('/auth/register', data),
  });
}

// Forgot Password
export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: { email: string; tenantId: string }) =>
      apiClient.post('/auth/forgot-password', data),
  });
}

// Reset Password
export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; newPassword: string }) =>
      apiClient.post('/auth/reset-password', data),
  });
}

// Change Password
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      apiClient.post('/auth/change-password', data),
  });
}

// Get Profile
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => apiClient.get('/auth/me'),
    enabled: !!useAuthStore.getState().isAuthenticated,
  });
}

// Update Profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { firstName?: string; lastName?: string; phone?: string; avatar?: string }) =>
      apiClient.patch('/auth/me', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Logout
export function useLogout() {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: (refreshToken?: string) => apiClient.post('/auth/logout', { refreshToken }),
    onSuccess: () => {
      logout();
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    },
    onError: () => {
      // Logout even if API call fails
      logout();
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    },
  });
}
