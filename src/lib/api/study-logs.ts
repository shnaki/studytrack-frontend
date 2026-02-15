import type { CreateStudyLogRequest, StudyLog } from '@/types/api'

import { del, get, post } from './client'

export type ListStudyLogsParams = {
  from?: string
  to?: string
  subjectId?: string
}

export function listStudyLogs(
  userId: string,
  params?: ListStudyLogsParams,
): Promise<StudyLog[]> {
  const searchParams = new URLSearchParams()
  if (params?.from) searchParams.set('from', params.from)
  if (params?.to) searchParams.set('to', params.to)
  if (params?.subjectId) searchParams.set('subjectId', params.subjectId)

  const query = searchParams.toString()
  const path = `/users/${userId}/study-logs${query ? `?${query}` : ''}`
  return get<StudyLog[]>(path)
}

export function createStudyLog(
  userId: string,
  body: CreateStudyLogRequest,
): Promise<StudyLog> {
  return post<StudyLog>(`/users/${userId}/study-logs`, body)
}

export function deleteStudyLog(id: string): Promise<void> {
  return del(`/study-logs/${id}`)
}
