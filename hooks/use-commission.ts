import { useQuery } from '@tanstack/react-query'
import { commissionService } from '@/lib/services'

export const useCommissionData = (timeRange: string = 'last-month') => {
  return useQuery({
    queryKey: ['commission', 'all', timeRange],
    queryFn: () => commissionService.getAllCommissionData(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCommissionHistory = (
  timeRange?: string,
  type?: string,
  status?: string,
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ['commission', 'history', timeRange, type, status, page, limit],
    queryFn: () => commissionService.getHistory(timeRange, type, status, page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCommissionEarnings = (timeRange?: string) => {
  return useQuery({
    queryKey: ['commission', 'earnings', timeRange],
    queryFn: () => commissionService.getEarnings(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const usePendingCommissions = () => {
  return useQuery({
    queryKey: ['commission', 'pending'],
    queryFn: () => commissionService.getPending(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCommissionStats = (timeRange?: string) => {
  return useQuery({
    queryKey: ['commission', 'stats', timeRange],
    queryFn: () => commissionService.getStats(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCommissionChartData = (timeRange: string = 'last-month') => {
  return useQuery({
    queryKey: ['commission', 'charts', timeRange],
    queryFn: () => commissionService.getChartData(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useWithdrawals = (
  status?: string,
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ['commission', 'withdrawals', status, page, limit],
    queryFn: () => commissionService.getWithdrawals(status, page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
} 