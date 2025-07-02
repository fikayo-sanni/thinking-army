import { buildApiUrl, PURCHASES_ENDPOINTS, HTTP_METHODS } from '../api-constants'

// Types for purchases data
export interface PurchaseHistory {
  id: string
  date: string
  tokenId: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  currency: string
  source: string
  transactionHash?: string
}

export interface PurchaseOverview {
  totalSpent: number
  totalPurchases: number
  successRate: number
  averagePurchase: number
  currency: string
}

export interface PurchaseStats {
  totalVolume: number
  monthlyVolume: number
  weeklyVolume: number
  dailyVolume: number
  totalTransactions: number
  successRate: number
  averageTransaction: number
  monthlyGrowth: number
}

export interface ChartData {
  date: string
  purchases: number
  volume: number
}

export interface PurchaseFilters {
  timeRange?: string
  status?: string
  source?: string
  currency?: string
  minAmount?: number
  maxAmount?: number
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

// Purchases service
export const purchasesService = {
  // Get purchase history with optional filters
  async getHistory(
    filters?: PurchaseFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    purchases: PurchaseHistory[]
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
      if (filters.source) params.append('source', filters.source)
      if (filters.currency) params.append('currency', filters.currency)
      if (filters.minAmount) params.append('minAmount', filters.minAmount.toString())
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString())
    }

    const url = `${PURCHASES_ENDPOINTS.HISTORY}?${params.toString()}`
    return apiRequest(url, { method: HTTP_METHODS.GET })
  },

  // Get purchase overview
  async getOverview(timeRange?: string): Promise<PurchaseOverview> {
    const url = timeRange 
      ? `${PURCHASES_ENDPOINTS.OVERVIEW}?timeRange=${timeRange}`
      : PURCHASES_ENDPOINTS.OVERVIEW
    return apiRequest<PurchaseOverview>(url, { method: HTTP_METHODS.GET })
  },

  // Get purchase statistics
  async getStats(timeRange?: string): Promise<PurchaseStats> {
    const url = timeRange 
      ? `${PURCHASES_ENDPOINTS.STATS}?timeRange=${timeRange}`
      : PURCHASES_ENDPOINTS.STATS
    return apiRequest<PurchaseStats>(url, { method: HTTP_METHODS.GET })
  },

  // Get chart data for purchases
  async getChartData(timeRange: string = 'last-month'): Promise<ChartData[]> {
    const url = `${PURCHASES_ENDPOINTS.CHARTS}?timeRange=${timeRange}`
    return apiRequest<ChartData[]>(url, { method: HTTP_METHODS.GET })
  },

  // Get purchase by ID
  async getPurchaseById(id: string): Promise<PurchaseHistory> {
    const url = `${PURCHASES_ENDPOINTS.HISTORY}/${id}`
    return apiRequest<PurchaseHistory>(url, { method: HTTP_METHODS.GET })
  },

  // Get purchases by token ID
  async getPurchasesByToken(tokenId: string): Promise<PurchaseHistory[]> {
    const url = `${PURCHASES_ENDPOINTS.HISTORY}/token/${encodeURIComponent(tokenId)}`
    return apiRequest<PurchaseHistory[]>(url, { method: HTTP_METHODS.GET })
  },

  // Search purchases
  async searchPurchases(query: string): Promise<PurchaseHistory[]> {
    const url = `${PURCHASES_ENDPOINTS.HISTORY}/search?q=${encodeURIComponent(query)}`
    return apiRequest<PurchaseHistory[]>(url, { method: HTTP_METHODS.GET })
  },

  // Export purchase data
  async exportData(
    format: 'csv' | 'pdf' = 'csv',
    filters?: PurchaseFilters
  ): Promise<Blob> {
    const params = new URLSearchParams({ format })
    
    if (filters) {
      if (filters.timeRange) params.append('timeRange', filters.timeRange)
      if (filters.status) params.append('status', filters.status)
      if (filters.source) params.append('source', filters.source)
      if (filters.currency) params.append('currency', filters.currency)
      if (filters.minAmount) params.append('minAmount', filters.minAmount.toString())
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString())
    }

    const url = `${PURCHASES_ENDPOINTS.HISTORY}/export?${params.toString()}`
    
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

  // Get all purchases data in one call
  async getAllPurchasesData(timeRange: string = 'last-month'): Promise<{
    overview: PurchaseOverview
    stats: PurchaseStats
    chartData: ChartData[]
  }> {
    const [overview, stats, chartData] = await Promise.all([
      this.getOverview(timeRange),
      this.getStats(timeRange),
      this.getChartData(timeRange),
    ])

    return {
      overview,
      stats,
      chartData,
    }
  },

  // Get purchase analytics
  async getAnalytics(timeRange: string = 'last-month'): Promise<{
    topSources: { source: string; count: number; volume: number }[]
    topTokens: { tokenId: string; count: number; volume: number }[]
    volumeByCurrency: { currency: string; volume: number }[]
    statusDistribution: { status: string; count: number }[]
  }> {
    const url = `${PURCHASES_ENDPOINTS.STATS}/analytics?timeRange=${timeRange}`
    return apiRequest(url, { method: HTTP_METHODS.GET })
  },
} 