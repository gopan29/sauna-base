import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'
import { BottomNavigation } from '@/components/BottomNavigation'
import { AuthProvider } from '@/contexts/AuthContext'
import { getUserAndProfile } from '@/lib/actions'

export const metadata: Metadata = {
  title: 'SAUNA BASE — サウナ体験を、データで進化させる。',
  description: 'あなたのととのいを点数化するサウナ記録アプリ',
  manifest: '/manifest.json',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, displayName: fetchedDisplayName } = await getUserAndProfile()
  const displayName = fetchedDisplayName ?? null

  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full sauna-bg text-[#e8f5e0]">
        <AuthProvider initialUser={user} initialDisplayName={displayName}>
          <div className="flex min-h-screen items-start">
            <Sidebar />
            <main className="flex-1 min-w-0 pb-20 lg:pb-0 overflow-x-hidden">
              {children}
            </main>
          </div>
          <BottomNavigation />
        </AuthProvider>
      </body>
    </html>
  )
}
