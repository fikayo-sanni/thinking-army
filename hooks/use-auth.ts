import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '@/lib/auth/AuthProvider';
import { authService } from '@/lib/services/auth-service';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

// New hook for fetching the user profile
// Using the same interface as auth-service.ts
type UserProfile = {
  id: string;
  youre_id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  joinDate: string;
  rank: string;
  totalEarnings: number;
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