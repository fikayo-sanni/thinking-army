import { useQuery } from '@tanstack/react-query'
import { purchasesService } from '@/lib/services'

export const usePurchasesData = (filters: {
  timeRange?: string
  status?: string
  source?: string
  currency?: string
  minAmount?: number
  maxAmount?: number
  page?: number
  limit?: number
} = { timeRange: 'last-month' }) => {
  return useQuery({
    queryKey: ['purchases', 'all', filters],
    queryFn: () => purchasesService.getAllPurchasesData(filters.timeRange || 'last-month', filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const usePurchaseHistory = (
  filters?: {
    timeRange?: string
    status?: string
    source?: string
    currency?: string
    minAmount?: number
    maxAmount?: number
  },
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ['purchases', 'history', filters, page, limit],
    queryFn: () => purchasesService.getHistory(filters, page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const usePurchaseOverview = (timeRange?: string) => {
  return useQuery({
    queryKey: ['purchases', 'overview', timeRange],
    queryFn: () => purchasesService.getOverview(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const usePurchaseStats = (timeRange?: string) => {
  return useQuery({
    queryKey: ['purchases', 'stats', timeRange],
    queryFn: () => purchasesService.getStats(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const usePurchaseChartData = (timeRange: string = 'last-month') => {
  return useQuery({
    queryKey: ['purchases', 'charts', timeRange],
    queryFn: () => purchasesService.getChartData(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const usePurchaseById = (id: string) => {
  return useQuery({
    queryKey: ['purchases', 'by-id', id],
    queryFn: () => purchasesService.getPurchaseById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const usePurchasesByToken = (tokenId: string) => {
  return useQuery({
    queryKey: ['purchases', 'by-token', tokenId],
    queryFn: () => purchasesService.getPurchasesByToken(tokenId),
    enabled: !!tokenId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useSearchPurchases = (query: string) => {
  return useQuery({
    queryKey: ['purchases', 'search', query],
    queryFn: () => purchasesService.searchPurchases(query),
    enabled: query.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const usePurchaseAnalytics = (timeRange: string = 'last-month') => {
  return useQuery({
    queryKey: ['purchases', 'analytics', timeRange],
    queryFn: () => purchasesService.getAnalytics(timeRange),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  })
} 