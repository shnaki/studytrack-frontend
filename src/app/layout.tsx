import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { AppShell } from '@/components/app-shell'
import { QueryProvider } from '@/providers/query-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { UserProvider } from '@/providers/user-provider'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'StudyTrack',
  description: '学習進捗管理アプリ',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            <UserProvider>
              <AppShell>{children}</AppShell>
            </UserProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
