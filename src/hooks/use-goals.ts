'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { listGoals, upsertGoal } from '@/lib/api/goals'
import type { UpsertGoalRequest } from '@/types/api'

function goalsKey(userId: string) {
  return ['goals', userId] as const
}

export function useGoals(userId: string) {
  return useQuery({
    queryKey: goalsKey(userId),
    queryFn: () => listGoals(userId),
  })
}

export function useUpsertGoal(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ subjectId, body }: { subjectId: string; body: UpsertGoalRequest }) =>
      upsertGoal(userId, subjectId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKey(userId) })
      queryClient.invalidateQueries({
        queryKey: ['weekly-stats', userId],
      })
    },
  })
}
