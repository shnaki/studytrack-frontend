'use client'

import { useSyncExternalStore } from 'react'

import { useTheme } from 'next-themes'

import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton } from '@/components/ui/sidebar'

const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

const themes = [
  { value: 'system', label: 'システム', icon: MonitorIcon },
  { value: 'light', label: 'ライト', icon: SunIcon },
  { value: 'dark', label: 'ダーク', icon: MoonIcon },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)

  const current = themes.find((t) => t.value === theme) ?? themes[0]

  if (!mounted) {
    return (
      <SidebarMenuButton tooltip="テーマ" disabled>
        <MonitorIcon />
        <span>テーマ</span>
      </SidebarMenuButton>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton tooltip={current.label}>
          <current.icon />
          <span>{current.label}</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start">
        {themes.map((t) => (
          <DropdownMenuItem key={t.value} onClick={() => setTheme(t.value)}>
            <t.icon />
            <span>{t.label}</span>
            {theme === t.value && <CheckIcon className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
