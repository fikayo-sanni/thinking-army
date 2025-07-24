import { buildApiUrl, PAYOUTS_ENDPOINTS, HTTP_METHODS } from '../api-constants'
import { apiRequest } from '../utils'

// Types for payouts data
export interface PayoutHistory {
  id: string
  date: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'failed'
  method: string
  currency: string
  transactionHash?: string
  notes?: string
}

export interface PayoutRequest {
  amount: number
  method: string
  currency: string
  walletAddress?: string
  bankDetails?: {
    accountNumber: string
    routingNumber: string
    accountName: string
  }
}

export interface PendingPayout {
  id: string
  amount: number
  requestDate: string
  expectedDate: string
  method: string
  currency: string
  status: 'pending' | 'processing'
}

export interface PayoutStats {
  totalPayouts: number
  totalPayoutsChange: number
  totalAmount: number
  totalAmountChange: number
  payoutAmount: number
  payoutAmountChange: number
  pendingAmount: number
  successRate: number
  averagePayout: number
  monthlyGrowth: number
}

export interface ChartData {
  date: string
  payouts: number
  amount: number
}

export interface PayoutFilters {
  timeRange?: string
  status?: string
  method?: string
  currency?: string
  minAmount?: number
  maxAmount?: number
}

// Payouts service
export const payoutsService = {
  // Get payout history with optional filters
  async getHistory(
    filters?: PayoutFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    payouts: PayoutHistory[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    
    if (filters) {
      if (filters.timeRange) params.append('timeRange', filters.timeRange)
      if (filters.status) params.append('status', filters.status)
      if (filters.method) params.append('method', filters.method)
      if (filters.currency) params.append('currency', filters.currency)
      if (filters.minAmount) params.append('minAmount', filters.minAmount.toString())
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString())
    }

    const url = `${PAYOUTS_ENDPOINTS.HISTORY}?${params.toString()}`
    return apiRequest(url, { method: HTTP_METHODS.GET })
  },

  // Request a new payout
  async requestPayout(payoutData: PayoutRequest): Promise<PayoutHistory> {
    return apiRequest<PayoutHistory>(PAYOUTS_ENDPOINTS.REQUEST, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(payoutData),
    })
  },

  // Get pending payouts
  async getPending(): Promise<PendingPayout[]> {
    return apiRequest<PendingPayout[]>(PAYOUTS_ENDPOINTS.PENDING, { method: HTTP_METHODS.GET })
  },

  // Get payout statistics
  async getStats(timeRange?: string): Promise<PayoutStats> {
    const url = timeRange 
      ? `${PAYOUTS_ENDPOINTS.STATS}?timeRange=${timeRange}`
      : PAYOUTS_ENDPOINTS.STATS
    return apiRequest<PayoutStats>(url, { method: HTTP_METHODS.GET })
  },

  // Get chart data for payouts
  async getChartData(timeRange: string = 'last-month'): Promise<ChartData[]> {
    const url = `${PAYOUTS_ENDPOINTS.STATS}/charts?timeRange=${timeRange}`
    return apiRequest<ChartData[]>(url, { method: HTTP_METHODS.GET })
  },

  // Get payout by ID
  async getPayoutById(id: string): Promise<PayoutHistory> {
    const url = `${PAYOUTS_ENDPOINTS.HISTORY}/${id}`
    return apiRequest<PayoutHistory>(url, { method: HTTP_METHODS.GET })
  },

  // Cancel pending payout
  async cancelPayout(id: string): Promise<{ success: boolean; message: string }> {
    const url = `${PAYOUTS_ENDPOINTS.REQUEST}/${id}/cancel`
    return apiRequest(url, { method: HTTP_METHODS.POST })
  },

  // Get available payout methods
  async getPayoutMethods(): Promise<{
    method: string
    name: string
    description: string
    minAmount: number
    maxAmount: number
    processingTime: string
    fees: number
  }[]> {
    const url = `${PAYOUTS_ENDPOINTS.REQUEST}/methods`
    return apiRequest(url, { method: HTTP_METHODS.GET })
  },

  // Get payout limits
  async getPayoutLimits(): Promise<{
    dailyLimit: number
    monthlyLimit: number
    minimumAmount: number
    maximumAmount: number
    currency: string
  }> {
    const url = `${PAYOUTS_ENDPOINTS.REQUEST}/limits`
    return apiRequest(url, { method: HTTP_METHODS.GET })
  },

  // Export payout data
  async exportData(
    format: 'csv' | 'pdf' = 'csv',
    filters?: PayoutFilters
  ): Promise<Blob> {
    const params = new URLSearchParams({ format })
    
    if (filters) {
      if (filters.timeRange) params.append('timeRange', filters.timeRange)
      if (filters.status) params.append('status', filters.status)
      if (filters.method) params.append('method', filters.method)
      if (filters.currency) params.append('currency', filters.currency)
      if (filters.minAmount) params.append('minAmount', filters.minAmount.toString())
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString())
    }

    const url = `${PAYOUTS_ENDPOINTS.HISTORY}/export?${params.toString()}`
    
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

  // Get all payouts data in one call
  async getAllPayoutsData(timeRange: string = 'last-month'): Promise<{
    stats: PayoutStats
    pending: PendingPayout[]
    chartData: ChartData[]
  }> {
    const [stats, pending, chartData] = await Promise.all([
      this.getStats(timeRange),
      this.getPending(),
      this.getChartData(timeRange),
    ])

    return {
      stats,
      pending,
      chartData,
    }
  },

  // Get payout analytics
  async getAnalytics(timeRange: string = 'last-month'): Promise<{
    methodDistribution: { method: string; count: number; amount: number }[]
    statusDistribution: { status: string; count: number; amount: number }[]
    currencyDistribution: { currency: string; count: number; amount: number }[]
    monthlyTrends: { month: string; count: number; amount: number }[]
  }> {
    const url = `${PAYOUTS_ENDPOINTS.STATS}/analytics?timeRange=${timeRange}`
    return apiRequest(url, { method: HTTP_METHODS.GET })
  },
} 