# API Integration Guide

## Overview

This document provides comprehensive guidance on API integration patterns used in the Gamescoin Frontend application.

## Service Architecture

### Base Service Pattern

All services follow a consistent pattern:

```typescript
// lib/services/base-service.ts
interface RequestOptions extends RequestInit {
  timeout?: number
  retries?: number
}

export async function apiRequest<T>(
  endpoint: string, 
  options: RequestOptions = {}
): Promise<T> {
  const { timeout = 30000, retries = 3, ...fetchOptions } = options
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(buildApiUrl(endpoint), {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
        ...fetchOptions.headers,
      },
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new APIError(response.status, await response.text())
    }
    
    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (retries > 0 && shouldRetry(error)) {
      await delay(1000)
      return apiRequest(endpoint, { ...options, retries: retries - 1 })
    }
    throw error
  }
}
```

### Error Handling

```typescript
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown): string {
  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        return 'Authentication required. Please log in.'
      case 403:
        return 'Access denied. You don\'t have permission.'
      case 404:
        return 'Resource not found.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return error.message || 'An unexpected error occurred.'
    }
  }
  
  if (error instanceof TypeError) {
    return 'Network error. Please check your connection.'
  }
  
  return 'An unexpected error occurred.'
}
```

## Service Modules

### Dashboard Service

```typescript
// lib/services/dashboard-service.ts
export interface DashboardOverview {
  totalEarnings: number
  monthlyEarnings: number
  activeDownlines: number
  networkSize: number
}

export interface DashboardStats {
  monthlyEarnings: number
  personalEarnings: number
  networkGrowth: number
  commissionRate: number
}

export const dashboardService = {
  async getOverview(timeRange?: string): Promise<DashboardOverview> {
    const url = timeRange 
      ? `${DASHBOARD_ENDPOINTS.OVERVIEW}?timeRange=${timeRange}`
      : DASHBOARD_ENDPOINTS.OVERVIEW
    
    return apiRequest<DashboardOverview>(url, { method: HTTP_METHODS.GET })
  },

  async getStats(timeRange?: string): Promise<DashboardStats> {
    const url = timeRange
      ? `${DASHBOARD_ENDPOINTS.STATS}?timeRange=${timeRange}`
      : DASHBOARD_ENDPOINTS.STATS
    
    return apiRequest<DashboardStats>(url, { method: HTTP_METHODS.GET })
  },

  async getCharts(timeRange: string = 'last-month'): Promise<ChartData[]> {
    const url = `${DASHBOARD_ENDPOINTS.CHARTS}?timeRange=${timeRange}`
    return apiRequest<ChartData[]>(url, { method: HTTP_METHODS.GET })
  },

  async getRecentActivity(): Promise<ActivityItem[]> {
    return apiRequest<ActivityItem[]>(DASHBOARD_ENDPOINTS.RECENT_ACTIVITY, {
      method: HTTP_METHODS.GET
    })
  },

  async getAllDashboardData(timeRange: string = 'last-month') {
    const [overview, stats, charts, recentActivity] = await Promise.all([
      this.getOverview(timeRange),
      this.getStats(timeRange),
      this.getCharts(timeRange),
      this.getRecentActivity(),
    ])

    return { overview, stats, charts, recentActivity }
  }
}
```

### Commission Service

```typescript
// lib/services/commission-service.ts
export interface CommissionFilters {
  type?: 'c1' | 'c2' | 'c3'
  currency?: string
  timeRange?: string
  status?: 'pending' | 'completed'
}

export const commissionService = {
  async getHistory(
    page: number = 1,
    limit: number = 10,
    filters: CommissionFilters = {}
  ): Promise<{ commissions: CommissionHistory[]; total: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    })

    const url = `${COMMISSION_ENDPOINTS.HISTORY}?${params.toString()}`
    return apiRequest<{ commissions: CommissionHistory[]; total: number }>(url, {
      method: HTTP_METHODS.GET
    })
  },

  async requestWithdrawal(amount: number, currency: string): Promise<WithdrawalRequest> {
    return apiRequest<WithdrawalRequest>(COMMISSION_ENDPOINTS.WITHDRAWALS, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ amount, currency })
    })
  },

  async exportCommissionData(
    format: 'csv' | 'excel',
    filters: CommissionFilters = {}
  ): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    })

    const url = `${COMMISSION_ENDPOINTS.HISTORY}/export?${params.toString()}`
    
    const response = await fetch(buildApiUrl(url), {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    })

    if (!response.ok) {
      throw new APIError(response.status, 'Export failed')
    }

    return response.blob()
  }
}
```

## React Query Integration

### Query Configuration

```typescript
// lib/react-query/config.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error instanceof APIError && error.status >= 400 && error.status < 500) {
          return false // Don't retry client errors
        }
        return failureCount < 3
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error)
        // Handle global mutation errors
      },
    },
  },
})
```

### Custom Hooks

```typescript
// hooks/use-dashboard.ts
export function useDashboard(timeRange: string = 'last-month') {
  return useQuery({
    queryKey: ['dashboard', timeRange],
    queryFn: () => dashboardService.getAllDashboardData(timeRange),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchIntervalInBackground: false,
    onError: (error) => {
      console.error('Dashboard query error:', error)
      toast.error(handleAPIError(error))
    },
  })
}

export function useCommissionHistory(
  page: number,
  limit: number,
  filters: CommissionFilters = {}
) {
  return useQuery({
    queryKey: ['commissions', 'history', page, limit, filters],
    queryFn: () => commissionService.getHistory(page, limit, filters),
    keepPreviousData: true, // Keep previous page while loading new page
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useCommissionWithdrawal() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ amount, currency }: { amount: number; currency: string }) =>
      commissionService.requestWithdrawal(amount, currency),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries(['commissions'])
      queryClient.invalidateQueries(['dashboard'])
      toast.success('Withdrawal request submitted successfully')
    },
    onError: (error) => {
      toast.error(handleAPIError(error))
    },
  })
}
```

### Infinite Queries

```typescript
// For paginated data with infinite scroll
export function useInfiniteCommissions(filters: CommissionFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['commissions', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      commissionService.getHistory(pageParam, 20, filters),
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.commissions.length === 20
      return hasMore ? allPages.length + 1 : undefined
    },
  })
}
```

## Authentication Integration

### Token Management

```typescript
// lib/auth/token-manager.ts
class TokenManager {
  private token: string | null = null
  private refreshToken: string | null = null
  private expiryTime: number | null = null

  setTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    this.token = accessToken
    this.refreshToken = refreshToken
    this.expiryTime = Date.now() + (expiresIn * 1000)
    
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('tokenExpiry', this.expiryTime.toString())
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('accessToken')
      this.expiryTime = parseInt(localStorage.getItem('tokenExpiry') || '0')
    }

    if (this.token && this.isTokenExpired()) {
      this.refreshTokenIfNeeded()
    }

    return this.token
  }

  private isTokenExpired(): boolean {
    return this.expiryTime ? Date.now() >= this.expiryTime : true
  }

  private async refreshTokenIfNeeded() {
    if (!this.refreshToken) return

    try {
      const response = await fetch(buildApiUrl(AUTH_ENDPOINTS.REFRESH), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      })

      if (response.ok) {
        const { accessToken, refreshToken, expiresIn } = await response.json()
        this.setTokens(accessToken, refreshToken, expiresIn)
      } else {
        this.clearTokens()
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.clearTokens()
    }
  }

  clearTokens() {
    this.token = null
    this.refreshToken = null
    this.expiryTime = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('tokenExpiry')
  }
}

export const tokenManager = new TokenManager()
```

### Authenticated Requests

```typescript
// lib/services/authenticated-request.ts
export async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenManager.getToken()
  
  if (!token) {
    throw new APIError(401, 'No authentication token available')
  }

  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })
}
```

## Real-time Updates

### WebSocket Integration

```typescript
// lib/websocket/client.ts
class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(url: string) {
    this.ws = new WebSocket(url)
    
    this.ws.onopen = () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    }
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.handleMessage(data)
    }
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected')
      this.reconnect()
    }
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  private handleMessage(data: any) {
    // Invalidate relevant queries based on message type
    switch (data.type) {
      case 'COMMISSION_UPDATE':
        queryClient.invalidateQueries(['commissions'])
        break
      case 'DASHBOARD_UPDATE':
        queryClient.invalidateQueries(['dashboard'])
        break
      // ... handle other message types
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++
        this.connect(this.ws?.url || '')
      }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts))
    }
  }
}

export const wsClient = new WebSocketClient()
```

## Testing API Integration

### Service Testing

```typescript
// lib/services/__tests__/dashboard-service.test.ts
import { dashboardService } from '../dashboard-service'
import { apiRequest } from '../base-service'

jest.mock('../base-service')
const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>

describe('dashboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getOverview', () => {
    it('should fetch dashboard overview without time range', async () => {
      const mockData = { totalEarnings: 1000, monthlyEarnings: 200 }
      mockedApiRequest.mockResolvedValue(mockData)

      const result = await dashboardService.getOverview()

      expect(mockedApiRequest).toHaveBeenCalledWith(
        'api/v1/dashboard/overview',
        { method: 'GET' }
      )
      expect(result).toEqual(mockData)
    })

    it('should fetch dashboard overview with time range', async () => {
      const mockData = { totalEarnings: 500, monthlyEarnings: 100 }
      mockedApiRequest.mockResolvedValue(mockData)

      const result = await dashboardService.getOverview('last-week')

      expect(mockedApiRequest).toHaveBeenCalledWith(
        'api/v1/dashboard/overview?timeRange=last-week',
        { method: 'GET' }
      )
      expect(result).toEqual(mockData)
    })
  })
})
```

### Hook Testing

```typescript
// hooks/__tests__/use-dashboard.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useDashboard } from '../use-dashboard'
import { dashboardService } from '@/lib/services/dashboard-service'

jest.mock('@/lib/services/dashboard-service')
const mockedDashboardService = dashboardService as jest.Mocked<typeof dashboardService>

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useDashboard', () => {
  it('should fetch dashboard data successfully', async () => {
    const mockData = {
      overview: { totalEarnings: 1000 },
      stats: { monthlyEarnings: 200 },
      charts: [],
      recentActivity: [],
    }
    mockedDashboardService.getAllDashboardData.mockResolvedValue(mockData)

    const { result } = renderHook(() => useDashboard(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockData)
    expect(mockedDashboardService.getAllDashboardData).toHaveBeenCalledWith('last-month')
  })
})
```

## Best Practices

### 1. Error Boundaries

```typescript
// components/error-boundary.tsx
export function APIErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong with the API request.</div>}
      onError={(error) => {
        console.error('API Error:', error)
        // Send to error tracking service
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
```

### 2. Loading States

```typescript
// components/data-fetcher.tsx
export function DataFetcher({ children, query }: DataFetcherProps) {
  const { data, isLoading, error } = query

  if (isLoading) return <Skeleton />
  if (error) return <ErrorDisplay error={error} />
  if (!data) return <EmptyState />

  return children(data)
}
```

### 3. Optimistic Updates

```typescript
export function useOptimisticUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateFunction,
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['data'])
      
      // Snapshot previous value
      const previousData = queryClient.getQueryData(['data'])
      
      // Optimistically update
      queryClient.setQueryData(['data'], newData)
      
      return { previousData }
    },
    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(['data'], context?.previousData)
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['data'])
    },
  })
}
```

### 4. Pagination

```typescript
export function usePaginatedData<T>(
  queryKey: string[],
  fetcher: (page: number, limit: number) => Promise<PaginatedResponse<T>>,
  limit: number = 10
) {
  const [page, setPage] = useState(1)

  const query = useQuery({
    queryKey: [...queryKey, page, limit],
    queryFn: () => fetcher(page, limit),
    keepPreviousData: true,
  })

  return {
    ...query,
    page,
    setPage,
    hasNextPage: query.data ? page < query.data.totalPages : false,
    hasPreviousPage: page > 1,
  }
}
```

This comprehensive API integration guide covers all aspects of working with APIs in the Gamescoin Frontend application, from basic patterns to advanced optimization techniques. 