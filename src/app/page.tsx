import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { BookOpenIcon } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">ダッシュボード</h2>
        <p className="text-muted-foreground">学習の進捗を確認しましょう。</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>まずは教科を登録しましょう</CardTitle>
          <CardDescription>
            学習記録をつけるには、まず教科を登録する必要があります。
          </CardDescription>
          <div className="pt-2">
            <Button asChild>
              <Link href="/subjects">
                <BookOpenIcon className="mr-2 size-4" />
                教科を管理する
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
