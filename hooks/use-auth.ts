import { useCallback } from 'react';
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