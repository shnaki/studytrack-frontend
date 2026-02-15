'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  type ListStudyLogsParams,
  createStudyLog,
  deleteStudyLog,
  listStudyLogs,
} from '@/lib/api/study-logs'
import type { CreateStudyLogRequest } from '@/types/api'

function studyLogsKey(userId: string, params?: ListStudyLogsParams) {
  return ['study-logs', userId, params] as const
}

export function useStudyLogs(userId: string, params?: ListStudyLogsParams) {
  return useQuery({
    queryKey: studyLogsKey(userId, params),
    queryFn: () => listStudyLogs(userId, params),
  })
}

export function useCreateStudyLog(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateStudyLogRequest) => createStudyLog(userId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['study-logs', userId],
      })
    },
  })
}

export function useDeleteStudyLog(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteStudyLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['study-logs', userId],
      })
    },
  })
}
