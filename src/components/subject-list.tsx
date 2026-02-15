'use client'

import { useState } from 'react'

import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react'

import { SubjectForm } from '@/components/subject-form'
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
  useCreateSubject,
  useDeleteSubject,
  useSubjects,
  useUpdateSubject,
} from '@/hooks/use-subjects'
import { useUser } from '@/hooks/use-user'
import type { Subject } from '@/types/api'

export function SubjectList() {
  const { user } = useUser()
  const userId = user!.id

  const { data: subjects, isLoading, error } = useSubjects(userId)
  const createSubject = useCreateSubject(userId)
  const updateSubject = useUpdateSubject(userId)
  const deleteSubject = useDeleteSubject(userId)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null)

  const handleCreate = (name: string) => {
    createSubject.mutate({ name }, { onSuccess: () => setIsCreateOpen(false) })
  }

  const handleUpdate = (name: string) => {
    if (!editingSubject) return
    updateSubject.mutate(
      { id: editingSubject.id, body: { name } },
      { onSuccess: () => setEditingSubject(null) },
    )
  }

  const handleDelete = () => {
    if (!deletingSubject) return
    deleteSubject.mutate(deletingSubject.id, {
      onSuccess: () => setDeletingSubject(null),
    })
  }

  if (isLoading) {
    return <p className="text-muted-foreground">教科を読み込み中...</p>
  }

  if (error) {
    return <p className="text-destructive">教科の読み込みに失敗しました。</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">教科</h2>
          <p className="text-muted-foreground">学習する教科を管理します。</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <PlusIcon className="mr-2 size-4" />
          教科を追加
        </Button>
      </div>

      {!subjects || subjects.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">教科がまだ登録されていません</CardTitle>
            <CardDescription>
              「教科を追加」ボタンから最初の教科を登録しましょう。
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card key={subject.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate text-base">{subject.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {new Date(subject.createdAt).toLocaleDateString('ja-JP')}
                      に作成
                    </CardDescription>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => setEditingSubject(subject)}
                    >
                      <PencilIcon className="size-4" />
                      <span className="sr-only">編集</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => setDeletingSubject(subject)}
                    >
                      <TrashIcon className="size-4" />
                      <span className="sr-only">削除</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* 作成ダイアログ */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>教科を追加</DialogTitle>
            <DialogDescription>新しい教科を登録します。</DialogDescription>
          </DialogHeader>
          <SubjectForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
            isSubmitting={createSubject.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* 編集ダイアログ */}
      <Dialog
        open={!!editingSubject}
        onOpenChange={(open) => {
          if (!open) setEditingSubject(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>教科を編集</DialogTitle>
            <DialogDescription>教科名を変更します。</DialogDescription>
          </DialogHeader>
          {editingSubject && (
            <SubjectForm
              defaultName={editingSubject.name}
              onSubmit={handleUpdate}
              onCancel={() => setEditingSubject(null)}
              isSubmitting={updateSubject.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={!!deletingSubject}
        onOpenChange={(open) => {
          if (!open) setDeletingSubject(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>教科を削除</DialogTitle>
            <DialogDescription>
              「{deletingSubject?.name}
              」を削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingSubject(null)}
              disabled={deleteSubject.isPending}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteSubject.isPending}
            >
              {deleteSubject.isPending ? '削除中...' : '削除'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
