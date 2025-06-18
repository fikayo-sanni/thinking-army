import { buildApiUrl, NETWORK_ENDPOINTS, HTTP_METHODS } from '../api-constants'
import { mockNetworkData, simulateApiDelay } from '../mock-data'

// Types for network data
export interface NetworkUser {
  id: string
  nickname: string
  anonymizedEmail: string
  level: number
  joinDate: string
  rank: string
  isActive: boolean
  totalReferrals: number
  children?: NetworkUser[]
}

export interface SponsorInfo {
  id: string
  name: string
  username: string
  level: number
  joinDate: string
  rank: string
  isActive: boolean
  totalReferrals: number
}

export interface NetworkStructure {
  currentUser: NetworkUser
  sponsor: SponsorInfo
  downlines: NetworkUser[]
}

export interface NetworkStats {
  totalDownlines: number
  activeMembers: number
  totalReferrals: number
  networkDepth: number
  monthlyGrowth: number
}

export interface InviteData {
  email: string
  message?: string
}

export interface InviteResponse {
  success: boolean
  inviteCode: string
  message: string
}

// Generic API request function with mock fallback
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  mockData: T
): Promise<T> => {
  const url = buildApiUrl(endpoint)
  
  console.log(`Attempting API request to: ${url}`)
  
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

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    console.log(`API request successful: ${url} (Status: ${response.status})`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log(`API response data:`, data)
    return data
  } catch (error) {
    console.error(`API request failed for ${url}:`, error)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.log('Request timed out, using mock data')
      } else if (error.message.includes('Failed to fetch')) {
        console.log('Network error (no backend server), using mock data')
      } else {
        console.log('API error, using mock data')
      }
    }
    
    console.log('Falling back to mock data...')
    await simulateApiDelay(2000)
    return mockData
  }
}

// Network service
export const networkService = {
  // Get complete network structure
  async getStructure(): Promise<NetworkStructure> {
    return apiRequest<NetworkStructure>(
      NETWORK_ENDPOINTS.STRUCTURE,
      { method: HTTP_METHODS.GET },
      mockNetworkData.structure
    )
  },

  // Get sponsor information
  async getSponsor(): Promise<SponsorInfo> {
    return apiRequest<SponsorInfo>(
      NETWORK_ENDPOINTS.SPONSOR,
      { method: HTTP_METHODS.GET },
      mockNetworkData.structure.sponsor
    )
  },

  // Get downlines with optional level filtering
  async getDownlines(level?: number): Promise<NetworkUser[]> {
    const url = level 
      ? `${NETWORK_ENDPOINTS.DOWNLINES}?level=${level}`
      : NETWORK_ENDPOINTS.DOWNLINES
    return apiRequest<NetworkUser[]>(
      url,
      { method: HTTP_METHODS.GET },
      mockNetworkData.structure.downlines
    )
  },

  // Get network statistics
  async getStats(): Promise<NetworkStats> {
    return apiRequest<NetworkStats>(
      NETWORK_ENDPOINTS.STATS,
      { method: HTTP_METHODS.GET },
      mockNetworkData.stats
    )
  },

  // Send invitation
  async sendInvite(inviteData: InviteData): Promise<InviteResponse> {
    return apiRequest<InviteResponse>(
      NETWORK_ENDPOINTS.INVITE,
      {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(inviteData),
      },
      { success: true, inviteCode: 'MOCK123', message: 'Invitation sent successfully' }
    )
  },

  // Get network data with pagination
  async getNetworkWithPagination(
    page: number = 1,
    limit: number = 20,
    level?: number
  ): Promise<{
    users: NetworkUser[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    
    if (level) {
      params.append('level', level.toString())
    }

    const url = `${NETWORK_ENDPOINTS.DOWNLINES}?${params.toString()}`
    return apiRequest(
      url,
      { method: HTTP_METHODS.GET },
      {
        users: mockNetworkData.structure.downlines,
        total: mockNetworkData.structure.downlines.length,
        page,
        limit,
        totalPages: Math.ceil(mockNetworkData.structure.downlines.length / limit),
      }
    )
  },

  // Search network members
  async searchMembers(query: string): Promise<NetworkUser[]> {
    const url = `${NETWORK_ENDPOINTS.DOWNLINES}?search=${encodeURIComponent(query)}`
    const filteredDownlines = mockNetworkData.structure.downlines.filter(
      member => member.nickname.toLowerCase().includes(query.toLowerCase())
    )
    return apiRequest<NetworkUser[]>(
      url,
      { method: HTTP_METHODS.GET },
      filteredDownlines
    )
  },

  // Get all network data in one call
  async getAllNetworkData(): Promise<{
    structure: NetworkStructure
    stats: NetworkStats
  }> {
    try {
      const [structure, stats] = await Promise.all([
        this.getStructure(),
        this.getStats(),
      ])

      return {
        structure,
        stats,
      }
    } catch (error) {
      console.error('Failed to fetch network data, using mock data:', error)
      await simulateApiDelay(2000)
      return {
        structure: mockNetworkData.structure,
        stats: mockNetworkData.stats,
      }
    }
  },
} 