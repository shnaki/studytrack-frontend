'use client'

import { type FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { CreateStudyLogRequest, Subject } from '@/types/api'

type StudyLogFormProps = {
  subjects: Subject[]
  onSubmit: (data: CreateStudyLogRequest) => void
  onCancel: () => void
  isSubmitting: boolean
}

export function StudyLogForm({
  subjects,
  onSubmit,
  onCancel,
  isSubmitting,
}: StudyLogFormProps) {
  const [subjectId, setSubjectId] = useState('')
  const [studiedAt, setStudiedAt] = useState('')
  const [minutes, setMinutes] = useState('')
  const [note, setNote] = useState('')

  const isValid =
    subjectId !== '' &&
    studiedAt !== '' &&
    minutes !== '' &&
    Number(minutes) >= 1 &&
    Number(minutes) <= 1440

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSubmit({
      subjectId,
      studiedAt: new Date(studiedAt).toISOString(),
      minutes: Number(minutes),
      ...(note.trim() ? { note: note.trim() } : {}),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="study-log-subject">教科</Label>
        <Select value={subjectId} onValueChange={setSubjectId} disabled={isSubmitting}>
          <SelectTrigger id="study-log-subject" className="w-full">
            <SelectValue placeholder="教科を選択" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="study-log-studied-at">日時</Label>
        <Input
          id="study-log-studied-at"
          type="datetime-local"
          value={studiedAt}
          onChange={(e) => setStudiedAt(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="study-log-minutes">学習時間（分）</Label>
        <Input
          id="study-log-minutes"
          type="number"
          min={1}
          max={1440}
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="例: 60"
          required
          disabled={isSubmitting}
        />
        <p className="text-muted-foreground text-xs">1〜1440分で入力してください</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="study-log-note">メモ（任意）</Label>
        <Textarea
          id="study-log-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="学習内容のメモ"
          maxLength={1000}
          disabled={isSubmitting}
        />
        <p className="text-muted-foreground text-xs">最大1000文字</p>
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
        <Button type="submit" disabled={isSubmitting || !isValid}>
          {isSubmitting ? '保存中...' : '保存'}
        </Button>
      </div>
    </form>
  )
}
