'use client'

import { useQuery } from '@tanstack/react-query'

import { getWeeklyStats } from '@/lib/api/stats'

export function useWeeklyStats(userId: string, weekStart: string) {
  return useQuery({
    queryKey: ['weekly-stats', userId, weekStart] as const,
    queryFn: () => getWeeklyStats(userId, weekStart),
  })
}
