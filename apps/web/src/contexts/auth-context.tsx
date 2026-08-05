'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  login: (email: string, password: string, tenantId?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, isAuthenticated, setUser, setToken, logout: storeLogout } = useAuthStore();

  // Check if route is public
  const isPublicRoute = ['/login', '/register', '/forgot-password', '/reset-password'].some(
    (route) => pathname.startsWith(route)
  );

  // Refresh token on mount if user is authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      refreshToken();
    }
  }, []);

  const login = async (email: string, password: string, tenantId?: string) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
        tenantId,
      });

      const { accessToken, refreshToken: newRefreshToken, user: userData } = response.data.data;

      setToken(accessToken);
      setUser(userData);
      document.cookie = `auth-token=${accessToken}; path=/; max-age=${15 * 60}`;

      // Store refresh token in httpOnly cookie (handled by backend)
      localStorage.setItem('refreshToken', newRefreshToken);

      router.push('/dashboard');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && token) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      // Ignore errors during logout
    } finally {
      storeLogout();
      localStorage.removeItem('refreshToken');
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push('/login');
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await apiClient.post('/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      setToken(accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      document.cookie = `auth-token=${accessToken}; path=/; max-age=${15 * 60}`;
    } catch (error) {
      // Refresh failed, logout user
      await logout();
    }
  };

  // Auto-redirect logic
  useEffect(() => {
    if (!isPublicRoute && !isAuthenticated && !token) {
      router.push(`/login?redirect=${pathname}`);
    }

    if (isPublicRoute && isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      router.push('/dashboard');
    }
  }, [isPublicRoute, isAuthenticated, token, pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading: false,
        user,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
