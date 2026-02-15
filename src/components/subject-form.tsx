'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type FormEvent, useState } from 'react'

type SubjectFormProps = {
  defaultName?: string
  onSubmit: (name: string) => void
  onCancel: () => void
  isSubmitting: boolean
}

export function SubjectForm({
                              defaultName = '',
                              onSubmit,
                              onCancel,
                              isSubmitting,
                            }: SubjectFormProps) {
  const [name, setName] = useState(defaultName)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || trimmed.length > 200) return
    onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject-name">教科名</Label>
        <Input
          id="subject-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: 数学、英語、物理"
          maxLength={200}
          required
          disabled={isSubmitting}
          autoFocus
        />
        <p className="text-muted-foreground text-xs">1〜200文字で入力してください</p>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting || !name.trim()}>
          {isSubmitting ? '保存中...' : '保存'}
        </Button>
      </div>
    </form>
  )
}
