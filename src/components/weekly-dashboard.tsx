'use client'

import { useState } from 'react'

import Link from 'next/link'

import { BookOpenIcon, ChevronLeftIcon, ChevronRightIcon, TargetIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/hooks/use-user'
import { useWeeklyStats } from '@/hooks/use-weekly-stats'
import { addDays, formatWeekRange, getWeekStart } from '@/lib/date-utils'

export function WeeklyDashboard() {
  const { user } = useUser()
  const userId = user!.id

  const todayWeekStart = getWeekStart()
  const [weekStart, setWeekStart] = useState(todayWeekStart)

  const { data: stats, isLoading, error } = useWeeklyStats(userId, weekStart)

  const isCurrentWeek = weekStart === todayWeekStart
  const isFutureWeek = weekStart >= addDays(todayWeekStart, 7)

  const handlePrevWeek = () => setWeekStart(addDays(weekStart, -7))
  const handleNextWeek = () => setWeekStart(addDays(weekStart, 7))
  const handleCurrentWeek = () => setWeekStart(todayWeekStart)

  const formatMinutes = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h === 0) return `${m}分`
    if (m === 0) return `${h}時間`
    return `${h}時間${m}分`
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">ダッシュボード</h2>
        <p className="text-muted-foreground">学習の進捗を確認しましょう。</p>
      </div>

      {/* 週ナビゲーション */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handlePrevWeek}>
          <ChevronLeftIcon className="size-4" />
          <span className="sr-only">前週</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextWeek}
          disabled={isFutureWeek}
        >
          <ChevronRightIcon className="size-4" />
          <span className="sr-only">次週</span>
        </Button>
        {!isCurrentWeek && (
          <Button variant="outline" size="sm" onClick={handleCurrentWeek}>
            今週
          </Button>
        )}
        <span className="text-muted-foreground text-sm">
          {formatWeekRange(weekStart)}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
        </div>
      ) : error ? (
        <p className="text-destructive">統計データの読み込みに失敗しました。</p>
      ) : (
        <>
          {/* 合計カード */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>今週の合計学習時間</CardDescription>
              <CardTitle className="text-3xl">
                {formatMinutes(stats?.totalMinutes ?? 0)}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* 教科別カード */}
          {!stats?.subjects || stats.subjects.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">データがありません</CardTitle>
                <CardDescription>
                  教科を登録して目標を設定すると、ここに進捗が表示されます。
                </CardDescription>
                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/subjects">
                      <BookOpenIcon className="mr-2 size-4" />
                      教科を管理
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/goals">
                      <TargetIcon className="mr-2 size-4" />
                      目標を設定
                    </Link>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.subjects.map((subject) => (
                <Card key={subject.subjectId}>
                  <CardHeader className="pb-2">
                    <CardDescription>{subject.subjectName}</CardDescription>
                    <CardTitle className="text-xl">
                      {formatMinutes(subject.totalMinutes)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {subject.targetMinutesPerWeek > 0 ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            目標: {formatMinutes(subject.targetMinutesPerWeek)}
                          </span>
                          <span className="font-medium">
                            {Math.round(subject.achievementRate * 100)}%
                          </span>
                        </div>
                        <Progress value={Math.min(subject.achievementRate * 100, 100)} />
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">目標未設定</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
