'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUser } from '@/hooks/use-user'
import { createUser } from '@/lib/api/users'
import { type FormEvent, useState } from 'react'

export function UserSetup() {
  const { setUser } = useUser()
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || trimmed.length > 100) return

    setIsSubmitting(true)
    setError(null)

    try {
      const user = await createUser({ name: trimmed })
      setUser(user)
    } catch {
      setError('ユーザーの作成に失敗しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>StudyTrack へようこそ</CardTitle>
          <CardDescription>
            学習の記録を始めるために、お名前を入力してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">お名前</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="名前を入力"
                maxLength={100}
                required
                disabled={isSubmitting}
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? '作成中...' : '始める'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
