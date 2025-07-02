import { buildApiUrl, COMMISSION_ENDPOINTS, HTTP_METHODS } from '../api-constants'

// Types for commission data
export interface CommissionHistory {
  id: string
  date: string
  amount: number
  type: 'direct' | 'indirect' | 'bonus'
  source: string
  status: 'completed' | 'pending' | 'failed'
  description: string
  currency: string
}

export interface CommissionEarnings {
  totalEarnings: number
  monthlyEarnings: number
  weeklyEarnings: number
  dailyEarnings: number
  currency: string
}

export interface PendingCommission {
  id: string
  amount: number
  expectedDate: string
  type: string
  source: string
  currency: string
}

export interface WithdrawalRequest {
  id: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  requestDate: string
  processedDate?: string
  method: string
  currency: string
}

export interface CommissionStats {
  totalCommissions: number
  totalWithdrawals: number
  pendingAmount: number
  successRate: number
  averageCommission: number
  monthlyGrowth: number
}

export interface ChartData {
  date: string
  earnings: number
  commissions: number
  withdrawals: number
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

// Commission service
export const commissionService = {
  // Get commission history with optional filters
  async getHistory(
    timeRange?: string,
    type?: string,
    status?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    commissions: CommissionHistory[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    
    if (timeRange) params.append('timeRange', timeRange)
    if (type) params.append('type', type)
    if (status) params.append('status', status)

    const url = `${COMMISSION_ENDPOINTS.HISTORY}?${params.toString()}`
    return apiRequest(url, { method: HTTP_METHODS.GET })
  },

  // Get commission earnings
  async getEarnings(timeRange?: string): Promise<CommissionEarnings> {
    const url = timeRange 
      ? `${COMMISSION_ENDPOINTS.EARNINGS}?timeRange=${timeRange}`
      : COMMISSION_ENDPOINTS.EARNINGS
    return apiRequest<CommissionEarnings>(url, { method: HTTP_METHODS.GET })
  },

  // Get pending commissions
  async getPending(): Promise<PendingCommission[]> {
    return apiRequest<PendingCommission[]>(COMMISSION_ENDPOINTS.PENDING, { method: HTTP_METHODS.GET })
  },

  // Get withdrawal history
  async getWithdrawals(
    status?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    withdrawals: WithdrawalRequest[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    
    if (status) params.append('status', status)

    const url = `${COMMISSION_ENDPOINTS.WITHDRAWALS}?${params.toString()}`
    return apiRequest(url, { method: HTTP_METHODS.GET })
  },

  // Request withdrawal
  async requestWithdrawal(amount: number, method: string): Promise<WithdrawalRequest> {
    return apiRequest<WithdrawalRequest>(COMMISSION_ENDPOINTS.WITHDRAWALS, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ amount, method }),
    })
  },

  // Get commission statistics
  async getStats(timeRange?: string): Promise<CommissionStats> {
    const url = timeRange 
      ? `${COMMISSION_ENDPOINTS.STATS}?timeRange=${timeRange}`
      : COMMISSION_ENDPOINTS.STATS
    return apiRequest<CommissionStats>(url, { method: HTTP_METHODS.GET })
  },

  // Get chart data for commissions
  async getChartData(timeRange: string = 'last-month'): Promise<ChartData[]> {
    const url = `${COMMISSION_ENDPOINTS.CHARTS}?timeRange=${timeRange}`
    return apiRequest<ChartData[]>(url, { method: HTTP_METHODS.GET })
  },

  // Export commission data
  async exportData(format: 'csv' | 'pdf' = 'csv', filters?: {
    timeRange?: string
    type?: string
    status?: string
  }): Promise<Blob> {
    const params = new URLSearchParams({ format })
    
    if (filters) {
      if (filters.timeRange) params.append('timeRange', filters.timeRange)
      if (filters.type) params.append('type', filters.type)
      if (filters.status) params.append('status', filters.status)
    }

    const url = `${COMMISSION_ENDPOINTS.HISTORY}/export?${params.toString()}`
    
    const token = localStorage.getItem('authToken')
    const response = await fetch(buildApiUrl(url), {
      method: HTTP_METHODS.GET,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.blob()
  },

  // Get all commission data in one call
  async getAllCommissionData(timeRange: string = 'last-month'): Promise<{
    earnings: CommissionEarnings
    stats: CommissionStats
    pending: PendingCommission[]
    chartData: ChartData[]
  }> {
    const [earnings, stats, pending, chartData] = await Promise.all([
      this.getEarnings(timeRange),
      this.getStats(timeRange),
      this.getPending(),
      this.getChartData(timeRange),
    ])

    return {
      earnings,
      stats,
      pending,
      chartData,
    }
  },
} 