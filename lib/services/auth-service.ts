import { AUTH_ENDPOINTS, HTTP_METHODS } from '../api-constants'
import { apiRequest } from '../utils'

// Types for authentication
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  username: string
  sponsorCode?: string
}

export interface UserProfile {
  id: string
  email: string
  username: string
  rank: string
  joinDate: string
  isActive: boolean
  totalReferrals: number
}

export interface AuthResponse {
  user: UserProfile
  token: string
  refreshToken: string
}

// Generic API request function


// Authentication service
export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiRequest<AuthResponse>(AUTH_ENDPOINTS.LOGIN, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(credentials),
    })
  },

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    return apiRequest<AuthResponse>(AUTH_ENDPOINTS.REGISTER, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    })
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiRequest(AUTH_ENDPOINTS.LOGOUT, {
        method: HTTP_METHODS.POST,
      })
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
    }
  },

  // Refresh access token
  async refreshToken(): Promise<{ token: string }> {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    return apiRequest<{ token: string }>(AUTH_ENDPOINTS.REFRESH, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ refreshToken }),
    })
  },

  // Get user profile
  async getProfile(): Promise<UserProfile> {
    return apiRequest<UserProfile>(AUTH_ENDPOINTS.PROFILE, {
      method: HTTP_METHODS.GET,
    })
  },

  // Update user profile
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    return apiRequest<UserProfile>(AUTH_ENDPOINTS.PROFILE, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(profileData),
    })
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem('authToken')
  },

  // Get stored token
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem('authToken')
  },

  // Store tokens
  storeTokens(token: string, refreshToken: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem('authToken', token)
    localStorage.setItem('refreshToken', refreshToken)
  },

  // Login with youre_id (for reports-service placeholder auth)
  async loginWithYoureId(youre_id: string): Promise<{ token: string }> {
    const response = await apiRequest<{ token: string }>(AUTH_ENDPOINTS.LOGIN, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ youre_id }),
    });
    localStorage.setItem('authToken', response.token);
    return response;
  },

  // Clear stored token
  clearToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem('authToken');
  },
} 