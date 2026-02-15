'use client'

import { useMemo, useState } from 'react'

import { PencilIcon, PlusIcon } from 'lucide-react'

import { GoalForm } from '@/components/goal-form'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGoals, useUpsertGoal } from '@/hooks/use-goals'
import { useSubjects } from '@/hooks/use-subjects'
import { useUser } from '@/hooks/use-user'

export function GoalList() {
  const { user } = useUser()
  const userId = user!.id

  const { data: goals, isLoading, error } = useGoals(userId)
  const { data: subjects } = useSubjects(userId)
  const upsertGoal = useUpsertGoal(userId)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSubjectId, setEditingSubjectId] = useState<string | undefined>(undefined)

  const subjectMap = useMemo(() => {
    const map = new Map<string, string>()
    subjects?.forEach((s) => map.set(s.id, s.name))
    return map
  }, [subjects])

  const handleSubmit = (
    subjectId: string,
    body: Parameters<typeof upsertGoal.mutate>[0]['body'],
  ) => {
    upsertGoal.mutate(
      { subjectId, body },
      {
        onSuccess: () => {
          setIsFormOpen(false)
          setEditingSubjectId(undefined)
        },
      },
    )
  }

  const handleEdit = (subjectId: string) => {
    setEditingSubjectId(subjectId)
    setIsFormOpen(true)
  }

  const handleOpenNew = () => {
    setEditingSubjectId(undefined)
    setIsFormOpen(true)
  }

  if (isLoading) {
    return <p className="text-muted-foreground">目標を読み込み中...</p>
  }

  if (error) {
    return <p className="text-destructive">目標の読み込みに失敗しました。</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">目標</h2>
          <p className="text-muted-foreground">教科ごとの週間学習目標を管理します。</p>
        </div>
        <Button onClick={handleOpenNew}>
          <PlusIcon className="mr-2 size-4" />
          目標を設定
        </Button>
      </div>

      {!goals || goals.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">目標がまだありません</CardTitle>
            <CardDescription>
              「目標を設定」ボタンから最初の目標を登録しましょう。
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>教科</TableHead>
              <TableHead>週間目標</TableHead>
              <TableHead>開始日</TableHead>
              <TableHead>終了日</TableHead>
              <TableHead className="w-[60px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.map((goal) => (
              <TableRow key={goal.id}>
                <TableCell>{subjectMap.get(goal.subjectId) ?? '不明'}</TableCell>
                <TableCell>{goal.targetMinutesPerWeek}分/週</TableCell>
                <TableCell>{goal.startDate}</TableCell>
                <TableCell>{goal.endDate ?? '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => handleEdit(goal.subjectId)}
                  >
                    <PencilIcon className="size-4" />
                    <span className="sr-only">編集</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false)
            setEditingSubjectId(undefined)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubjectId ? '目標を編集' : '目標を設定'}</DialogTitle>
            <DialogDescription>教科ごとの週間学習目標を設定します。</DialogDescription>
          </DialogHeader>
          <GoalForm
            subjects={subjects ?? []}
            existingGoals={goals ?? []}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingSubjectId(undefined)
            }}
            isSubmitting={upsertGoal.isPending}
            defaultSubjectId={editingSubjectId}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
