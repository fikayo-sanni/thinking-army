import { buildApiUrl, PAYOUTS_ENDPOINTS, HTTP_METHODS } from '../api-constants'
import { mockPayoutsData, simulateApiDelay } from '../mock-data'

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
  totalAmount: number
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
    return apiRequest(
      url,
      { method: HTTP_METHODS.GET },
      {
        payouts: mockPayoutsData.history,
        total: mockPayoutsData.history.length,
        page,
        limit,
        totalPages: Math.ceil(mockPayoutsData.history.length / limit),
      }
    )
  },

  // Request a new payout
  async requestPayout(payoutData: PayoutRequest): Promise<PayoutHistory> {
    return apiRequest<PayoutHistory>(
      PAYOUTS_ENDPOINTS.REQUEST,
      {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(payoutData),
      },
      {
        id: 'mock-1',
        date: new Date().toISOString(),
        amount: payoutData.amount,
        status: 'pending',
        method: payoutData.method,
        currency: payoutData.currency,
      }
    )
  },

  // Get pending payouts
  async getPending(): Promise<PendingPayout[]> {
    return apiRequest<PendingPayout[]>(
      PAYOUTS_ENDPOINTS.PENDING,
      { method: HTTP_METHODS.GET },
      mockPayoutsData.pending
    )
  },

  // Get payout statistics
  async getStats(timeRange?: string): Promise<PayoutStats> {
    const url = timeRange 
      ? `${PAYOUTS_ENDPOINTS.STATS}?timeRange=${timeRange}`
      : PAYOUTS_ENDPOINTS.STATS
    return apiRequest<PayoutStats>(
      url,
      { method: HTTP_METHODS.GET },
      mockPayoutsData.stats
    )
  },

  // Get chart data for payouts
  async getChartData(timeRange: string = 'last-month'): Promise<ChartData[]> {
    const url = `${PAYOUTS_ENDPOINTS.STATS}/charts?timeRange=${timeRange}`
    return apiRequest<ChartData[]>(
      url,
      { method: HTTP_METHODS.GET },
      mockPayoutsData.chartData
    )
  },

  // Get payout by ID
  async getPayoutById(id: string): Promise<PayoutHistory> {
    const url = `${PAYOUTS_ENDPOINTS.HISTORY}/${id}`
    const mockPayout = mockPayoutsData.history.find(p => p.id === id)
    return apiRequest<PayoutHistory>(
      url,
      { method: HTTP_METHODS.GET },
      mockPayout || mockPayoutsData.history[0]
    )
  },

  // Cancel pending payout
  async cancelPayout(id: string): Promise<{ success: boolean; message: string }> {
    const url = `${PAYOUTS_ENDPOINTS.REQUEST}/${id}/cancel`
    return apiRequest(
      url,
      { method: HTTP_METHODS.POST },
      { success: true, message: 'Payout cancelled successfully' }
    )
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
    return apiRequest(
      url,
      { method: HTTP_METHODS.GET },
      [
        {
          method: 'bank_transfer',
          name: 'Bank Transfer',
          description: 'Direct bank transfer to your account',
          minAmount: 50,
          maxAmount: 10000,
          processingTime: '2-3 business days',
          fees: 0,
        },
        {
          method: 'crypto_wallet',
          name: 'Crypto Wallet',
          description: 'Transfer to your crypto wallet',
          minAmount: 10,
          maxAmount: 5000,
          processingTime: 'Instant',
          fees: 0.5,
        },
      ]
    )
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
    return apiRequest(
      url,
      { method: HTTP_METHODS.GET },
      {
        dailyLimit: 5000,
        monthlyLimit: 50000,
        minimumAmount: 10,
        maximumAmount: 10000,
        currency: 'USDC',
      }
    )
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
    try {
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
    } catch (error) {
      console.error('Export failed, returning mock data:', error)
      await simulateApiDelay(2000)
      // Return a mock CSV blob
      const mockCsv = 'Date,Amount,Status,Method\n2024-01-15,500.00,completed,Bank Transfer'
      return new Blob([mockCsv], { type: 'text/csv' })
    }
  },

  // Get all payouts data in one call
  async getAllPayoutsData(timeRange: string = 'last-month'): Promise<{
    stats: PayoutStats
    pending: PendingPayout[]
    chartData: ChartData[]
  }> {
    try {
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
    } catch (error) {
      console.error('Failed to fetch payouts data, using mock data:', error)
      await simulateApiDelay(2000)
      return {
        stats: mockPayoutsData.stats,
        pending: mockPayoutsData.pending,
        chartData: mockPayoutsData.chartData,
      }
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
    return apiRequest(
      url,
      { method: HTTP_METHODS.GET },
      {
        methodDistribution: [
          { method: 'Bank Transfer', count: 2, amount: 1250.0 },
          { method: 'Crypto Wallet', count: 2, amount: 550.0 },
        ],
        statusDistribution: [
          { status: 'completed', count: 2, amount: 750.0 },
          { status: 'pending', count: 1, amount: 750.0 },
          { status: 'rejected', count: 1, amount: 300.0 },
        ],
        currencyDistribution: [
          { currency: 'USDC', count: 4, amount: 1800.0 },
        ],
        monthlyTrends: [
          { month: 'Jan 2024', count: 4, amount: 1800.0 },
        ],
      }
    )
  },
} 