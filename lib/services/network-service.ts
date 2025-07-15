import { NETWORK_ENDPOINTS, HTTP_METHODS } from '../api-constants'
import { apiRequest } from '../utils'

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
  nickname: string
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
  totalReferrals: number;
}

export interface NetworkStats {
  totalDownlines: number
  totalDirectDownlines: number
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

// Network service
export const networkService = {
  // Get complete network structure
  async getStructure(): Promise<NetworkStructure> {
    return apiRequest<NetworkStructure>(NETWORK_ENDPOINTS.STRUCTURE, { method: HTTP_METHODS.GET })
  },

  // Get sponsor information
  async getSponsor(): Promise<SponsorInfo> {
    return apiRequest<SponsorInfo>(NETWORK_ENDPOINTS.SPONSOR, { method: HTTP_METHODS.GET })
  },

  // Get downlines with optional level filtering
  async getDownlines(level?: number): Promise<NetworkUser[]> {
    const url = level 
      ? `${NETWORK_ENDPOINTS.DOWNLINES}?level=${level}`
      : NETWORK_ENDPOINTS.DOWNLINES
    return apiRequest<NetworkUser[]>(url, { method: HTTP_METHODS.GET })
  },

  // Get network statistics
  async getStats(): Promise<NetworkStats> {
    return apiRequest<NetworkStats>(NETWORK_ENDPOINTS.STATS, { method: HTTP_METHODS.GET })
  },

  // Send invitation
  async sendInvite(inviteData: InviteData): Promise<InviteResponse> {
    return apiRequest<InviteResponse>(NETWORK_ENDPOINTS.INVITE, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(inviteData),
    })
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
    return apiRequest(url, { method: HTTP_METHODS.GET })
  },

  // Search network members
  async searchMembers(query: string): Promise<NetworkUser[]> {
    const url = `${NETWORK_ENDPOINTS.DOWNLINES}?search=${encodeURIComponent(query)}`
    return apiRequest<NetworkUser[]>(url, { method: HTTP_METHODS.GET })
  },

  // Get all network data in one call
  async getAllNetworkData(): Promise<{
    structure: NetworkStructure
    stats: NetworkStats
  }> {
    const [structure, stats] = await Promise.all([
      this.getStructure(),
      this.getStats(),
    ])
    return { structure, stats }
  },

  // Get direct downlines for a given parentId (with pagination)
  async getDirectDownlines(parentId?: string, page: number = 1, limit: number = 20, level: number = 0): Promise<NetworkUser[]> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      level: level.toString(),
    })
    if (parentId) params.append('parentId', parentId)
    const url = `${NETWORK_ENDPOINTS.DIRECT_DOWNLINES}?${params.toString()}`
    return apiRequest<NetworkUser[]>(url, { method: HTTP_METHODS.GET })
  },
} 