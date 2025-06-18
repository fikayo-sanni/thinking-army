import { useQuery } from '@tanstack/react-query'
import { ranksService, AllRanksData } from '@/lib/services/ranks-service'

export const useRanksData = () => {
  return useQuery<AllRanksData>({
    queryKey: ['ranks', 'all'],
    queryFn: () => ranksService.getAllRanksData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
} 