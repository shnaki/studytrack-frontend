import type { CreateUserRequest, User } from '@/types/api'

import { get, post } from './client'

export function getUser(id: string): Promise<User> {
  return get<User>(`/users/${id}`)
}

export function createUser(body: CreateUserRequest): Promise<User> {
  return post<User>('/users', body)
}
