import type { Goal, UpsertGoalRequest } from '@/types/api'

import { get, put } from './client'

export function listGoals(userId: string): Promise<Goal[]> {
  return get<Goal[]>(`/users/${userId}/goals`)
}

export function upsertGoal(
  userId: string,
  subjectId: string,
  body: UpsertGoalRequest,
): Promise<Goal> {
  return put<Goal>(`/users/${userId}/goals/${subjectId}`, body)
}
