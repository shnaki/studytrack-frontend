import type { CreateSubjectRequest, Subject, UpdateSubjectRequest } from '@/types/api'

import { del, get, post, put } from './client'

export function listSubjects(userId: string): Promise<Subject[]> {
  return get<Subject[]>(`/users/${userId}/subjects`)
}

export function createSubject(
  userId: string,
  body: CreateSubjectRequest,
): Promise<Subject> {
  return post<Subject>(`/users/${userId}/subjects`, body)
}

export function updateSubject(id: string, body: UpdateSubjectRequest): Promise<Subject> {
  return put<Subject>(`/subjects/${id}`, body)
}

export function deleteSubject(id: string): Promise<void> {
  return del(`/subjects/${id}`)
}
