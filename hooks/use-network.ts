import { useQuery } from '@tanstack/react-query'
import { networkService } from '@/lib/services'

export const useNetworkData = () => {
  return useQuery({
    queryKey: ['network', 'all'],
    queryFn: () => networkService.getAllNetworkData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useNetworkStructure = () => {
  return useQuery({
    queryKey: ['network', 'structure'],
    queryFn: () => networkService.getStructure(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useNetworkStats = () => {
  return useQuery({
    queryKey: ['network', 'stats'],
    queryFn: () => networkService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useSponsor = () => {
  return useQuery({
    queryKey: ['network', 'sponsor'],
    queryFn: () => networkService.getSponsor(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  })
}

export const useDownlines = (level?: number) => {
  return useQuery({
    queryKey: ['network', 'downlines', level],
    queryFn: () => networkService.getDownlines(level),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useNetworkWithPagination = (
  page: number = 1,
  limit: number = 20,
  level?: number
) => {
  return useQuery({
    queryKey: ['network', 'pagination', page, limit, level],
    queryFn: () => networkService.getNetworkWithPagination(page, limit, level),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useSearchMembers = (query: string) => {
  return useQuery({
    queryKey: ['network', 'search', query],
    queryFn: () => networkService.searchMembers(query),
    enabled: query.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 2 * 60 * 1000, // 2 minutes
  })
} 