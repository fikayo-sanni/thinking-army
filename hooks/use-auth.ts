export { useAuth } from '@/lib/auth/AuthProvider';

// Mock profile hook for now
export function useProfile() {
  const mockProfile = {
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
  };

  return {
    data: mockProfile,
    isLoading: false,
    error: null,
  };
}