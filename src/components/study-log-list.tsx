'use client'

import { useMemo, useState } from 'react'

import { PlusIcon, TrashIcon } from 'lucide-react'

import { StudyLogForm } from '@/components/study-log-form'
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
import {
  useCreateStudyLog,
  useDeleteStudyLog,
  useStudyLogs,
} from '@/hooks/use-study-logs'
import { useSubjects } from '@/hooks/use-subjects'
import { useUser } from '@/hooks/use-user'
import type { StudyLog } from '@/types/api'

export function StudyLogList() {
  const { user } = useUser()
  const userId = user!.id

  const { data: studyLogs, isLoading, error } = useStudyLogs(userId)
  const { data: subjects } = useSubjects(userId)
  const createStudyLog = useCreateStudyLog(userId)
  const deleteStudyLog = useDeleteStudyLog(userId)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [deletingLog, setDeletingLog] = useState<StudyLog | null>(null)

  const subjectMap = useMemo(() => {
    const map = new Map<string, string>()
    subjects?.forEach((s) => map.set(s.id, s.name))
    return map
  }, [subjects])

  const handleCreate = (data: Parameters<typeof createStudyLog.mutate>[0]) => {
    createStudyLog.mutate(data, { onSuccess: () => setIsCreateOpen(false) })
  }

  const handleDelete = () => {
    if (!deletingLog) return
    deleteStudyLog.mutate(deletingLog.id, {
      onSuccess: () => setDeletingLog(null),
    })
  }

  if (isLoading) {
    return <p className="text-muted-foreground">学習記録を読み込み中...</p>
  }

  if (error) {
    return <p className="text-destructive">学習記録の読み込みに失敗しました。</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">学習記録</h2>
          <p className="text-muted-foreground">学習の記録を管理します。</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <PlusIcon className="mr-2 size-4" />
          学習記録を追加
        </Button>
      </div>

      {!studyLogs || studyLogs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">学習記録がまだありません</CardTitle>
            <CardDescription>
              「学習記録を追加」ボタンから最初の学習記録を登録しましょう。
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日時</TableHead>
              <TableHead>教科</TableHead>
              <TableHead>学習時間</TableHead>
              <TableHead>メモ</TableHead>
              <TableHead className="w-[60px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studyLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.studiedAt).toLocaleString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell>{subjectMap.get(log.subjectId) ?? '不明'}</TableCell>
                <TableCell>{log.minutes}分</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {log.note || '-'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => setDeletingLog(log)}
                  >
                    <TrashIcon className="size-4" />
                    <span className="sr-only">削除</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* 作成ダイアログ */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>学習記録を追加</DialogTitle>
            <DialogDescription>新しい学習記録を登録します。</DialogDescription>
          </DialogHeader>
          <StudyLogForm
            subjects={subjects ?? []}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
            isSubmitting={createStudyLog.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={!!deletingLog}
        onOpenChange={(open) => {
          if (!open) setDeletingLog(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>学習記録を削除</DialogTitle>
            <DialogDescription>
              この学習記録を削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingLog(null)}
              disabled={deleteStudyLog.isPending}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteStudyLog.isPending}
            >
              {deleteStudyLog.isPending ? '削除中...' : '削除'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
