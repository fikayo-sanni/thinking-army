import { useQuery } from '@tanstack/react-query';
import CommissionService from '@/lib/services/commission-service';

const commissionService = CommissionService.getInstance();

export function useCommissionHistory(
  timeRange: string,
  type?: string,
  status?: string,
  page: number = 1,
  pageSize: number = 10,
  currency?: string
) {
  return useQuery({
    queryKey: ['commissionHistory', timeRange, type, status, page, pageSize, currency],
    queryFn: () => commissionService.getCommissionHistory(timeRange, type, status, page, pageSize, currency),
  });
}

export function useCommissionStats(timeRange: string) {
  return useQuery({
    queryKey: ['commissionStats', timeRange],
    queryFn: () => commissionService.getCommissionStats(timeRange),
  });
}

// Alias for backward compatibility
export const useCommissionEarnings = useCommissionStats;

export function usePendingCommissions() {
  return useQuery({
    queryKey: ['pendingCommissions'],
    queryFn: () => commissionService.getPendingCommissions(),
  });
}

export function useCommissionChartData(timeRange: string) {
  return useQuery({
    queryKey: ['commissionChartData', timeRange],
    queryFn: () => commissionService.getChartData(timeRange),
  });
} 