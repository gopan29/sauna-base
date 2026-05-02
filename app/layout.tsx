import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'
import { BottomNavigation } from '@/components/BottomNavigation'

export const metadata: Metadata = {
  title: 'SAUNA BASE — サウナ体験を、データで進化させる。',
  description: 'あなたのととのいを点数化するサウナ記録アプリ',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full sauna-bg text-[#e8f5e0]">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0 pb-20 lg:pb-0 overflow-x-hidden">
            {children}
          </main>
        </div>
        <BottomNavigation />
      </body>
    </html>
  )
}
