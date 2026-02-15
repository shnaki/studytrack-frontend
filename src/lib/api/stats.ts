import type { WeeklyStats } from '@/types/api'

import { get } from './client'

export function getWeeklyStats(userId: string, weekStart: string): Promise<WeeklyStats> {
  return get<WeeklyStats>(`/users/${userId}/stats/weekly?weekStart=${weekStart}`)
}
