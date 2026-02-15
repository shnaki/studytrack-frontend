'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  BookOpenIcon,
  LayoutDashboardIcon,
  NotebookPenIcon,
  TargetIcon,
} from 'lucide-react'

import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { UserSetup } from '@/components/user-setup'
import { useUser } from '@/hooks/use-user'

const navItems = [
  {
    title: 'ダッシュボード',
    href: '/',
    icon: LayoutDashboardIcon,
  },
  {
    title: '教科',
    href: '/subjects',
    icon: BookOpenIcon,
  },
  {
    title: '目標',
    href: '/goals',
    icon: TargetIcon,
  },
  {
    title: '学習記録',
    href: '/study-logs',
    icon: NotebookPenIcon,
  },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser()
  const pathname = usePathname()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    )
  }

  if (!user) {
    return <UserSetup />
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <BookOpenIcon className="size-5" />
            <span className="text-lg font-semibold">StudyTrack</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>メニュー</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="text-muted-foreground truncate px-2 py-1 text-sm">
            {user.name}
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm font-medium">
            {navItems.find((item) => item.href === pathname)?.title ?? 'StudyTrack'}
          </h1>
        </header>
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
