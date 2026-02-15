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
import type { Goal, Subject, UpsertGoalRequest } from '@/types/api'

type GoalFormProps = {
  subjects: Subject[]
  existingGoals: Goal[]
  onSubmit: (subjectId: string, body: UpsertGoalRequest) => void
  onCancel: () => void
  isSubmitting: boolean
  defaultSubjectId?: string
}

function findGoal(goals: Goal[], subjectId: string) {
  return goals.find((g) => g.subjectId === subjectId)
}

export function GoalForm({
  subjects,
  existingGoals,
  onSubmit,
  onCancel,
  isSubmitting,
  defaultSubjectId,
}: GoalFormProps) {
  const isEditing = !!defaultSubjectId

  // 初期値をpropsから計算
  const defaultGoal = defaultSubjectId
    ? findGoal(existingGoals, defaultSubjectId)
    : undefined

  const [subjectId, setSubjectId] = useState(defaultSubjectId ?? '')
  const [targetMinutes, setTargetMinutes] = useState(
    defaultGoal ? String(defaultGoal.targetMinutesPerWeek) : '',
  )
  const [startDate, setStartDate] = useState(defaultGoal?.startDate ?? '')
  const [endDate, setEndDate] = useState(defaultGoal?.endDate ?? '')

  // 教科変更時に既存目標があればプリフィル
  const handleSubjectChange = (value: string) => {
    setSubjectId(value)
    const existing = findGoal(existingGoals, value)
    if (existing) {
      setTargetMinutes(String(existing.targetMinutesPerWeek))
      setStartDate(existing.startDate)
      setEndDate(existing.endDate ?? '')
    } else {
      setTargetMinutes('')
      setStartDate('')
      setEndDate('')
    }
  }

  const isValid =
    subjectId !== '' &&
    targetMinutes !== '' &&
    Number(targetMinutes) >= 1 &&
    startDate !== '' &&
    (endDate === '' || endDate >= startDate)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSubmit(subjectId, {
      targetMinutesPerWeek: Number(targetMinutes),
      startDate,
      ...(endDate ? { endDate } : {}),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="goal-subject">教科</Label>
        {isEditing ? (
          <Input
            id="goal-subject"
            value={subjects.find((s) => s.id === subjectId)?.name ?? ''}
            disabled
          />
        ) : (
          <Select
            value={subjectId}
            onValueChange={handleSubjectChange}
            disabled={isSubmitting}
          >
            <SelectTrigger id="goal-subject" className="w-full">
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
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="goal-target">週間目標（分）</Label>
        <Input
          id="goal-target"
          type="number"
          min={1}
          value={targetMinutes}
          onChange={(e) => setTargetMinutes(e.target.value)}
          placeholder="例: 300"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="goal-start">開始日</Label>
        <Input
          id="goal-start"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="goal-end">終了日（任意）</Label>
        <Input
          id="goal-end"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate || undefined}
          disabled={isSubmitting}
        />
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
