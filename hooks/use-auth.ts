import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/lib/services/auth-service';

export function useAuth() {
  const isAuthenticated = useCallback(() => {
    return authService.isAuthenticated();
  }, []);

  const login = useCallback(async (youre_id: string) => {
    return authService.loginWithYoureId(youre_id);
  }, []);

  const logout = useCallback(() => {
    authService.clearToken();
  }, []);

  const getToken = useCallback(() => {
    return authService.getToken();
  }, []);

  return {
    isAuthenticated,
    login,
    logout,
    getToken,
  };
}

// New hook for fetching the user profile
type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  totalEarnings: string;
  rank: string;
  joinDate: string;
  isActive: boolean;
  totalReferrals: number;
};

export function useProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => await authService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}