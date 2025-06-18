import { useQuery } from '@tanstack/react-query'
import { payoutsService } from '@/lib/services'

export const usePayoutsData = (timeRange: string = 'last-month') => {
  return useQuery({
    queryKey: ['payouts', 'all', timeRange],
    queryFn: () => payoutsService.getAllPayoutsData(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const usePayoutHistory = (
  filters?: {
    timeRange?: string
    status?: string
    method?: string
    currency?: string
    minAmount?: number
    maxAmount?: number
  },
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ['payouts', 'history', filters, page, limit],
    queryFn: () => payoutsService.getHistory(filters, page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const usePendingPayouts = () => {
  return useQuery({
    queryKey: ['payouts', 'pending'],
    queryFn: () => payoutsService.getPending(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const usePayoutStats = (timeRange?: string) => {
  return useQuery({
    queryKey: ['payouts', 'stats', timeRange],
    queryFn: () => payoutsService.getStats(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const usePayoutChartData = (timeRange: string = 'last-month') => {
  return useQuery({
    queryKey: ['payouts', 'charts', timeRange],
    queryFn: () => payoutsService.getChartData(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const usePayoutById = (id: string) => {
  return useQuery({
    queryKey: ['payouts', 'by-id', id],
    queryFn: () => payoutsService.getPayoutById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const usePayoutMethods = () => {
  return useQuery({
    queryKey: ['payouts', 'methods'],
    queryFn: () => payoutsService.getPayoutMethods(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  })
}

export const usePayoutLimits = () => {
  return useQuery({
    queryKey: ['payouts', 'limits'],
    queryFn: () => payoutsService.getPayoutLimits(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  })
}

export const usePayoutAnalytics = (timeRange: string = 'last-month') => {
  return useQuery({
    queryKey: ['payouts', 'analytics', timeRange],
    queryFn: () => payoutsService.getAnalytics(timeRange),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  })
} 