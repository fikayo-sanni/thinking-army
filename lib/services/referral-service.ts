import { API_BASE_URL } from '../api-constants'

export interface ReferrerInfo {
  id: string
  username: string
  name: string
}

export interface ValidateReferralResponse {
  valid: boolean
  referrer: ReferrerInfo
}

export interface RegisterWithReferralData {
  youreId: string
  referralCode: string
  username: string
  email?: string
  name?: string
}

export interface RegisterWithReferralResponse {
  success: boolean
  message: string
}

export interface ReferralStats {
  totalReferrals: number
  recentReferrals: number
  period: string
}

class ReferralService {
  private async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken')
      if (token) {
        defaultHeaders.Authorization = `Bearer ${token}`
      }
    }

    const response = await fetch(url, {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async validateReferralCode(code: string): Promise<ValidateReferralResponse> {
    return this.apiRequest<ValidateReferralResponse>(`api/v1/referral/validate/${encodeURIComponent(code)}`)
  }

  async registerWithReferral(data: RegisterWithReferralData): Promise<RegisterWithReferralResponse> {
    return this.apiRequest<RegisterWithReferralResponse>('api/v1/referral/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async generateReferralLink(): Promise<{ link: string; code: string }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    if (!token) {
      throw new Error('Authentication required to generate referral link')
    }
    return this.apiRequest<{ link: string; code: string }>('api/v1/referral/generate-link')
  }

  async getReferralStats(): Promise<ReferralStats> {
    return this.apiRequest<ReferralStats>('api/v1/referral/stats')
  }
}

export const referralService = new ReferralService() 