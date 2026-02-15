'use client'

import { getUser } from '@/lib/api/users'
import type { User } from '@/types/api'
import { createContext, useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'studytrack_userId'

export type UserContextValue = {
  user: User | null
  isLoading: boolean
  setUser: (user: User) => void
}

export const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem(STORAGE_KEY)
    const userPromise = userId
      ? getUser(userId).catch(() => {
        localStorage.removeItem(STORAGE_KEY)
        return null
      })
      : Promise.resolve(null)

    userPromise.then((u) => {
      if (u) setUserState(u)
      setIsLoading(false)
    })
  }, [])

  const setUser = useCallback((u: User) => {
    localStorage.setItem(STORAGE_KEY, u.id)
    setUserState(u)
  }, [])

  return <UserContext value={{ user, isLoading, setUser }}>{children}</UserContext>
}
