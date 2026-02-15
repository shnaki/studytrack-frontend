'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createSubject,
  deleteSubject,
  listSubjects,
  updateSubject,
} from '@/lib/api/subjects'
import type { CreateSubjectRequest, UpdateSubjectRequest } from '@/types/api'

function subjectsKey(userId: string) {
  return ['subjects', userId] as const
}

export function useSubjects(userId: string) {
  return useQuery({
    queryKey: subjectsKey(userId),
    queryFn: () => listSubjects(userId),
  })
}

export function useCreateSubject(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateSubjectRequest) => createSubject(userId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subjectsKey(userId),
      })
    },
  })
}

export function useUpdateSubject(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateSubjectRequest }) =>
      updateSubject(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subjectsKey(userId),
      })
    },
  })
}

export function useDeleteSubject(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subjectsKey(userId),
      })
    },
  })
}
