import { buildApiUrl, AUTH_ENDPOINTS, HTTP_METHODS } from '../api-constants'

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
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = buildApiUrl(endpoint)
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  console.log('url', url);

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

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
    return !!localStorage.getItem('authToken')
  },

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('authToken')
  },

  // Store tokens
  storeTokens(token: string, refreshToken: string): void {
    localStorage.setItem('authToken', token)
    localStorage.setItem('refreshToken', refreshToken)
  },
} 