import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/lib/services'

export const useDashboardData = (timeRange: string = 'last-month') => {
  return useQuery({
    queryKey: ['dashboard', 'all', timeRange],
    queryFn: () => dashboardService.getAllDashboardData(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => dashboardService.getOverview(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useDashboardStats = (timeRange?: string, options?: any) => {
  return useQuery({
    queryKey: ['dashboard', 'stats', timeRange],
    queryFn: () => dashboardService.getStats(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options, // Allow overriding default options
  })
}

export const useDashboardCharts = (timeRange: string = 'last-month') => {
  return useQuery({
    queryKey: ['dashboard', 'charts', timeRange],
    queryFn: () => dashboardService.getCharts(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useRecentActivity = (limit: number = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-activity', limit],
    queryFn: () => dashboardService.getRecentActivity(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useNetworkGrowth = (timeRange: string = 'last-month') => {
  return useQuery({
    queryKey: ['dashboard', 'network-growth', timeRange],
    queryFn: () => dashboardService.getNetworkGrowth(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
} 