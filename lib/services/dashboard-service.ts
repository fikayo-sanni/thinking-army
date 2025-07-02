import { buildApiUrl, DASHBOARD_ENDPOINTS, HTTP_METHODS } from '../api-constants'

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
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }
  const response = await fetch(url, config)
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return response.json()
}

export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    return apiRequest<DashboardOverview>(DASHBOARD_ENDPOINTS.OVERVIEW, { method: HTTP_METHODS.GET })
  },
  async getStats(): Promise<DashboardStats> {
    return apiRequest<DashboardStats>(DASHBOARD_ENDPOINTS.STATS, { method: HTTP_METHODS.GET })
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
    recentActivity: ActivityItem[]
    immediateDownlines: Array<{
      id: string
      nickname: string
      revenue: number
      status: 'active' | 'inactive'
      rank: string
    }>
  }> {
    const [overview, stats, charts, recentActivity] = await Promise.all([
      this.getOverview(),
      this.getStats(),
      this.getCharts(timeRange),
      this.getRecentActivity(),
    ])
    // immediateDownlines is now expected from backend in stats or a separate endpoint
    return { overview, stats, charts, recentActivity, immediateDownlines: stats.immediateDownlines || [] }
  },
} 