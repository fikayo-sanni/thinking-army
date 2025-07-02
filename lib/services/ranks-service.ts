import { buildApiUrl } from '../api-constants'

// Types for ranks data
export interface Rank {
  name: string
  requirements: {
    volume: string
    directReferrals: string
    teamSize: string
  }
  benefits: {
    commission: string
    bonus: string
    perks: string
  }
}

export interface CurrentRank {
  name: string
  achievedDate: string
  totalVolume: number
  teamSize: number
  directReferrals: number
  monthsAtRank: number
}

export interface NextRankRequirements {
  name: string
  volumeRequired: number
  currentVolume: number
  directReferralsRequired: number
  currentDirectReferrals: number
  teamSizeRequired: number
  currentTeamSize: number
  monthlyVolumeRequired: number
  currentMonthlyVolume: number
}

export interface RankHistoryItem {
  rank: string
  achievedDate: string
  duration: string
  isCurrent: boolean
}

export interface AllRanksData {
  currentRank: CurrentRank
  nextRankRequirements: NextRankRequirements
  rankHistory: RankHistoryItem[]
  allRanks: Rank[]
}

const apiRequest = async <T>(endpoint: string): Promise<T> => {
  const url = buildApiUrl(endpoint)
  const token = localStorage.getItem('authToken')
  const headers: HeadersInit = token
    ? { 'Authorization': `Bearer ${token}` }
    : {}
  const response = await fetch(url, { headers })
  if (!response.ok) throw new Error('API error')
  return response.json()
}

export const ranksService = {
  async getAllRanksData(): Promise<AllRanksData> {
    return apiRequest('/api/v1/ranks/all')
  },
  async getCurrentRank(): Promise<Rank> {
    return apiRequest('/api/v1/ranks/current')
  },
  async getNextRankRequirements(): Promise<Rank> {
    return apiRequest('/api/v1/ranks/next')
  },
  async getRankHistory(): Promise<Rank[]> {
    return apiRequest('/api/v1/ranks/history')
  },
  async getAllRanks(): Promise<Rank[]> {
    return apiRequest('/api/v1/ranks/list')
  },
} 