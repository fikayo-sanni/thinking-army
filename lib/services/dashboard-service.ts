import { DASHBOARD_ENDPOINTS, HTTP_METHODS } from '../api-constants'
import { apiRequest } from '../utils'

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
  personalEarnings: number
  monthlyGrowth: number
  ownTurnover: number
  purchases: number
  purchasesChange: number
  vpChange: number
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

export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    return apiRequest<DashboardOverview>(DASHBOARD_ENDPOINTS.OVERVIEW, { method: HTTP_METHODS.GET })
  },
  async getStats(timeRange?: string): Promise<DashboardStats> {
    const url = timeRange
      ? `${DASHBOARD_ENDPOINTS.STATS}?timeRange=${timeRange}`
      : DASHBOARD_ENDPOINTS.STATS
    return apiRequest<DashboardStats>(url, { method: HTTP_METHODS.GET })
  },
  async getCharts(timeRange: string = 'last-month'): Promise<DashboardCharts> {
    const url = `${DASHBOARD_ENDPOINTS.CHARTS}?timeRange=${timeRange}`
    return apiRequest<DashboardCharts>(url, { method: HTTP_METHODS.GET })
  },
  async getRecentActivity(limit: number = 10): Promise<ActivityItem[]> {
    const url = `${DASHBOARD_ENDPOINTS.RECENT_ACTIVITY}?limit=${limit}`
    return apiRequest<ActivityItem[]>(url, { method: HTTP_METHODS.GET })
  },
  async getAllDashboardData(timeRange: string = 'last-month'): Promise<{
    overview: DashboardOverview
    stats: DashboardStats
    charts: DashboardCharts
    commissionBalances: Record<string, unknown>
    recentActivity: ActivityItem[]
    immediateDownlines: Array<{
      id: string
      nickname: string
      revenue: number
      status: 'active' | 'inactive'
      rank: string
    }>
  }> {
    const url = `${DASHBOARD_ENDPOINTS.ALL}?timeRange=${timeRange}`
    return apiRequest(url, { method: HTTP_METHODS.GET })
  },
  async getNetworkGrowth(timeRange: string = 'last-month'): Promise<Array<{
    date: string
    totalMembers: number
    activeMembers: number
    newReferrals: number
  }>> {
    const url = `${DASHBOARD_ENDPOINTS.NETWORK_GROWTH}?timeRange=${timeRange}`
    return apiRequest(url, { method: HTTP_METHODS.GET })
  },
} 