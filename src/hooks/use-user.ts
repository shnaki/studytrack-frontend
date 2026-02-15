'use client'

import { UserContext, type UserContextValue } from '@/providers/user-provider'
import { use } from 'react'

export function useUser(): UserContextValue {
  const context = use(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
