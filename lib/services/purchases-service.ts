import { buildApiUrl, PURCHASES_ENDPOINTS, HTTP_METHODS } from '../api-constants'
import { mockPurchasesData, simulateApiDelay } from '../mock-data'

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
    return apiRequest(
      url,
      { method: HTTP_METHODS.GET },
      {
        purchases: mockPurchasesData.history,
        total: mockPurchasesData.history.length,
        page,
        limit,
        totalPages: Math.ceil(mockPurchasesData.history.length / limit),
      }
    )
  },

  // Get purchase overview
  async getOverview(timeRange?: string): Promise<PurchaseOverview> {
    const url = timeRange 
      ? `${PURCHASES_ENDPOINTS.OVERVIEW}?timeRange=${timeRange}`
      : PURCHASES_ENDPOINTS.OVERVIEW
    return apiRequest<PurchaseOverview>(
      url,
      { method: HTTP_METHODS.GET },
      mockPurchasesData.overview
    )
  },

  // Get purchase statistics
  async getStats(timeRange?: string): Promise<PurchaseStats> {
    const url = timeRange 
      ? `${PURCHASES_ENDPOINTS.STATS}?timeRange=${timeRange}`
      : PURCHASES_ENDPOINTS.STATS
    return apiRequest<PurchaseStats>(
      url,
      { method: HTTP_METHODS.GET },
      mockPurchasesData.stats
    )
  },

  // Get chart data for purchases
  async getChartData(timeRange: string = 'last-month'): Promise<ChartData[]> {
    const url = `${PURCHASES_ENDPOINTS.CHARTS}?timeRange=${timeRange}`
    return apiRequest<ChartData[]>(
      url,
      { method: HTTP_METHODS.GET },
      mockPurchasesData.chartData
    )
  },

  // Get purchase by ID
  async getPurchaseById(id: string): Promise<PurchaseHistory> {
    const url = `${PURCHASES_ENDPOINTS.HISTORY}/${id}`
    const mockPurchase = mockPurchasesData.history.find(p => p.id === id)
    return apiRequest<PurchaseHistory>(
      url,
      { method: HTTP_METHODS.GET },
      mockPurchase || mockPurchasesData.history[0]
    )
  },

  // Get purchases by token ID
  async getPurchasesByToken(tokenId: string): Promise<PurchaseHistory[]> {
    const url = `${PURCHASES_ENDPOINTS.HISTORY}/token/${encodeURIComponent(tokenId)}`
    const filteredPurchases = mockPurchasesData.history.filter(
      p => p.tokenId.toLowerCase().includes(tokenId.toLowerCase())
    )
    return apiRequest<PurchaseHistory[]>(
      url,
      { method: HTTP_METHODS.GET },
      filteredPurchases
    )
  },

  // Search purchases
  async searchPurchases(query: string): Promise<PurchaseHistory[]> {
    const url = `${PURCHASES_ENDPOINTS.HISTORY}/search?q=${encodeURIComponent(query)}`
    const filteredPurchases = mockPurchasesData.history.filter(
      p => p.tokenId.toLowerCase().includes(query.toLowerCase()) ||
           p.source.toLowerCase().includes(query.toLowerCase())
    )
    return apiRequest<PurchaseHistory[]>(
      url,
      { method: HTTP_METHODS.GET },
      filteredPurchases
    )
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
      const mockCsv = 'Date,Token ID,Amount,Status,Source\n2024-01-15,GCC4 POWERSTAR #1234,2.5,completed,OpenSea'
      return new Blob([mockCsv], { type: 'text/csv' })
    }
  },

  // Get all purchases data in one call
  async getAllPurchasesData(timeRange: string = 'last-month'): Promise<{
    overview: PurchaseOverview
    stats: PurchaseStats
    chartData: ChartData[]
  }> {
    try {
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
    } catch (error) {
      console.error('Failed to fetch purchases data, using mock data:', error)
      await simulateApiDelay(2000)
      return {
        overview: mockPurchasesData.overview,
        stats: mockPurchasesData.stats,
        chartData: mockPurchasesData.chartData,
      }
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
    return apiRequest(
      url,
      { method: HTTP_METHODS.GET },
      {
        topSources: [
          { source: 'OpenSea', count: 3, volume: 8.5 },
          { source: 'Foundation', count: 2, volume: 8.4 },
          { source: 'Rarible', count: 2, volume: 3.7 },
        ],
        topTokens: [
          { tokenId: 'GCC1 SUPRASTAR #6789', count: 1, volume: 5.2 },
          { tokenId: 'GCC3 POWERSTAR #7890', count: 1, volume: 4.1 },
          { tokenId: 'GCC2 POWERSTAR #2345', count: 1, volume: 2.8 },
        ],
        volumeByCurrency: [
          { currency: 'USDC', volume: 12.7 },
          { currency: 'USDT', volume: 10.3 },
        ],
        statusDistribution: [
          { status: 'completed', count: 6 },
          { status: 'pending', count: 2 },
          { status: 'failed', count: 1 },
        ],
      }
    )
  },
} 