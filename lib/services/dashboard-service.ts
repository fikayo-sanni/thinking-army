import { buildApiUrl, DASHBOARD_ENDPOINTS, HTTP_METHODS } from '../api-constants'
import { mockDashboardData, simulateApiDelay } from '../mock-data'

// Types for dashboard data
export interface DashboardOverview {
  totalEarnings: number
  totalReferrals: number
  activeDownlines: number
  pendingPayouts: number
  recentActivity: ActivityItem[]
}

export interface DashboardStats {
  monthlyEarnings: number
  monthlyGrowth: number
  totalNetworkSize: number
  successRate: number
  immediateDownlines?: Array<{
    id: string
    nickname: string
    revenue: number
    status: 'active' | 'inactive'
    rank: string
  }>
}

export interface ChartData {
  date: string
  earnings: number
  referrals: number
  purchases: number
}

export interface ActivityItem {
  id: string
  type: 'commission' | 'referral' | 'purchase' | 'payout'
  description: string
  amount?: number
  timestamp: string
  status: 'completed' | 'pending' | 'failed'
}

export interface DashboardCharts {
  purchasesOverTime: Array<{
    date: string
    purchases: number
    volume: number
  }>
  commissionSources: Array<{
    name: string
    value: number
    color: string
  }>
  commissionBreakdown: Array<{
    month: string
    c1: number
    c2: number
    c3: number
    bonuses: number
  }>
  networkGrowth: Array<{
    date: string
    totalMembers: number
    activeMembers: number
    newReferrals: number
  }>
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

// Dashboard service
export const dashboardService = {
  // Get dashboard overview
  async getOverview(): Promise<DashboardOverview> {
    return apiRequest<DashboardOverview>(
      DASHBOARD_ENDPOINTS.OVERVIEW,
      { method: HTTP_METHODS.GET },
      mockDashboardData.overview
    )
  },

  // Get dashboard statistics
  async getStats(): Promise<DashboardStats> {
    return apiRequest<DashboardStats>(
      DASHBOARD_ENDPOINTS.STATS,
      { method: HTTP_METHODS.GET },
      mockDashboardData.stats
    )
  },

  // Get chart data
  async getCharts(timeRange: string = 'last-month'): Promise<DashboardCharts> {
    const url = `${DASHBOARD_ENDPOINTS.CHARTS}?timeRange=${timeRange}`
    return apiRequest<DashboardCharts>(
      url,
      { method: HTTP_METHODS.GET },
      mockDashboardData.charts
    )
  },

  // Get recent activity
  async getRecentActivity(limit: number = 10): Promise<ActivityItem[]> {
    const url = `${DASHBOARD_ENDPOINTS.RECENT_ACTIVITY}?limit=${limit}`
    return apiRequest<ActivityItem[]>(
      url,
      { method: HTTP_METHODS.GET },
      mockDashboardData.overview.recentActivity
    )
  },

  // Get all dashboard data in one call
  async getAllDashboardData(timeRange: string = 'last-month'): Promise<{
    overview: DashboardOverview
    stats: DashboardStats
    charts: DashboardCharts
    recentActivity: ActivityItem[]
    immediateDownlines: Array<{
      id: string
      nickname: string
      revenue: number
      status: 'active' | 'inactive'
      rank: string
    }>
  }> {
    try {
      const [overview, stats, charts, recentActivity] = await Promise.all([
        this.getOverview(),
        this.getStats(),
        this.getCharts(timeRange),
        this.getRecentActivity(),
      ])

      return {
        overview,
        stats,
        charts,
        recentActivity,
        immediateDownlines: mockDashboardData.immediateDownlines,
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data, using mock data:', error)
      await simulateApiDelay(2000)
      return {
        overview: mockDashboardData.overview,
        stats: mockDashboardData.stats,
        charts: mockDashboardData.charts,
        recentActivity: mockDashboardData.overview.recentActivity,
        immediateDownlines: mockDashboardData.immediateDownlines,
      }
    }
  },
} 