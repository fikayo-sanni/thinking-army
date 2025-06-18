import { buildApiUrl } from '../api-constants'
import { simulateApiDelay } from '../mock-data'

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

// Mock data (from current page)
const mockAllRanksData: AllRanksData = {
  currentRank: {
    name: 'GOLD',
    achievedDate: '2023-08-15',
    totalVolume: 45.7,
    teamSize: 12,
    directReferrals: 8,
    monthsAtRank: 5,
  },
  nextRankRequirements: {
    name: 'PLATINUM',
    volumeRequired: 100,
    currentVolume: 45.7,
    directReferralsRequired: 15,
    currentDirectReferrals: 8,
    teamSizeRequired: 25,
    currentTeamSize: 12,
    monthlyVolumeRequired: 10,
    currentMonthlyVolume: 8.5,
  },
  rankHistory: [
    {
      rank: 'GOLD',
      achievedDate: '2023-08-15',
      duration: '5 months',
      isCurrent: true,
    },
    {
      rank: 'SILVER',
      achievedDate: '2023-05-20',
      duration: '3 months',
      isCurrent: false,
    },
    {
      rank: 'BRONZE',
      achievedDate: '2023-03-10',
      duration: '2 months',
      isCurrent: false,
    },
  ],
  allRanks: [
    {
      name: 'BRONZE',
      requirements: { volume: '5 USDC', directReferrals: '2', teamSize: '3' },
      benefits: { commission: '5%', bonus: 'Welcome Bonus', perks: 'Basic Support' },
    },
    {
      name: 'SILVER',
      requirements: { volume: '15 USDC', directReferrals: '5', teamSize: '8' },
      benefits: { commission: '7%', bonus: 'Monthly Bonus', perks: 'Priority Support' },
    },
    {
      name: 'GOLD',
      requirements: { volume: '35 USDC', directReferrals: '8', teamSize: '12' },
      benefits: { commission: '10%', bonus: 'Quarterly Bonus', perks: 'VIP Support' },
    },
    {
      name: 'PLATINUM',
      requirements: { volume: '100 USDC', directReferrals: '15', teamSize: '25' },
      benefits: { commission: '12%', bonus: 'Leadership Bonus', perks: 'Exclusive Events' },
    },
    {
      name: 'DIAMOND',
      requirements: { volume: '250 USDC', directReferrals: '25', teamSize: '50' },
      benefits: { commission: '15%', bonus: 'Diamond Bonus', perks: 'Personal Manager' },
    },
    {
      name: 'ELITE',
      requirements: { volume: '500 USDC', directReferrals: '50', teamSize: '100' },
      benefits: { commission: '20%', bonus: 'Elite Rewards', perks: 'All Benefits' },
    },
  ],
}

const apiRequest = async <T>(endpoint: string, mockData: T): Promise<T> => {
  const url = buildApiUrl(endpoint)
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('API error')
    return await response.json()
  } catch (error) {
    await simulateApiDelay(1000)
    return mockData
  }
}

export const ranksService = {
  async getAllRanksData(): Promise<AllRanksData> {
    return apiRequest('/ranks/all', mockAllRanksData)
  },
  async getCurrentRank(): Promise<CurrentRank> {
    return apiRequest('/ranks/current', mockAllRanksData.currentRank)
  },
  async getNextRankRequirements(): Promise<NextRankRequirements> {
    return apiRequest('/ranks/next', mockAllRanksData.nextRankRequirements)
  },
  async getRankHistory(): Promise<RankHistoryItem[]> {
    return apiRequest('/ranks/history', mockAllRanksData.rankHistory)
  },
  async getAllRanks(): Promise<Rank[]> {
    return apiRequest('/ranks/list', mockAllRanksData.allRanks)
  },
} 