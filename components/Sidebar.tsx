'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTransition } from 'react'
import {
  LayoutDashboard, PenLine, Calendar, BarChart2,
  Search, Sparkles, UserCircle, Settings, LogOut, Leaf, LogIn,
} from 'lucide-react'
import { signOut } from '@/lib/actions'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  { href: '/',         icon: LayoutDashboard, label: 'ダッシュボード' },
  { href: '/record',   icon: PenLine,         label: '記録する' },
  { href: '/calendar', icon: Calendar,        label: 'カレンダー' },
  { href: '/stats',    icon: BarChart2,       label: '統計' },
  { href: '/search',   icon: Search,          label: 'サウナ検索',  soon: true },
  { href: '/ai',       icon: Sparkles,        label: 'AIレコメンド' },
  { href: '/profile',  icon: UserCircle,      label: 'サウナプロファイル' },
]

export function Sidebar() {
  const path = usePathname()
  const [pending, startTransition] = useTransition()
  const { user, displayName } = useAuth()

  if (path.startsWith('/admin') || path.startsWith('/onboarding')) return null

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut()
      window.location.href = '/'
    })
  }

  const initial = displayName
    ? displayName[0].toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?'
  const name = displayName ?? user?.email?.split('@')[0] ?? ''

  return (
    <aside
      className="hidden lg:flex flex-col w-56 shrink-0 h-screen sticky top-0 overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, rgba(8,20,6,0.95) 0%, rgba(10,26,8,0.92) 100%)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* ロゴ */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(124,179,66,0.2)', border: '1px solid rgba(124,179,66,0.4)' }}>
            <Leaf className="w-4 h-4 text-[#7cb342]" />
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-wide">SAUNA BASE</p>
            <p className="text-[9px] text-white/35 leading-none">サウナ体験を、データで進化させる。</p>
          </div>
        </div>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 px-3">
        {navItems.map(({ href, icon: Icon, label, soon }) => {
          const active = path === href
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm transition-all
                ${active
                  ? 'bg-[#7cb342]/20 text-[#a5d63a] font-medium'
                  : 'text-white/55 hover:text-white/80 hover:bg-white/5'
                }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              {soon && (
                <span className="ml-auto text-[9px] text-white/30 border border-white/15 px-1 rounded">近日</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* おすすめサウナカード */}
      <div className="mx-3 mb-4">
        <div className="glass rounded-xl p-3 text-xs">
          <div className="w-full h-16 rounded-lg mb-2 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&h=100&fit=crop"
              alt="森の湯サウナ"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-medium text-white/80 text-xs mb-0.5">森の湯サウナ</p>
          <p className="text-white/40 text-[10px] mb-2">あなたの好みにぴったりのサウナを見つけました</p>
          <button className="w-full py-1 rounded-lg text-[10px] text-[#a5d63a] font-medium"
            style={{ background: 'rgba(124,179,66,0.15)', border: '1px solid rgba(124,179,66,0.3)' }}>
            詳細を見る
          </button>
        </div>
      </div>

      {/* ユーザーエリア */}
      <div className="mx-3 mb-3">
        {user ? (
          <>
            <div className="glass rounded-xl px-3 py-2.5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: 'linear-gradient(135deg,#7cb342,#4a7c20)' }}>
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/85 truncate">{name}</p>
                <p className="text-[10px] text-[#7cb342]">Lv.1</p>
              </div>
            </div>
            <div className="mt-1 px-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-[#7cb342]" style={{ width: '12%' }} />
            </div>
            <p className="text-[9px] text-white/30 text-right mt-0.5">次のLvまで 記録を重ねよう</p>
          </>
        ) : (
          <Link href="/login"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(124,179,66,0.18) 0%, rgba(74,124,32,0.18) 100%)',
              border: '1px solid rgba(124,179,66,0.4)',
              color: '#a5d63a',
            }}>
            <LogIn className="w-4 h-4" />
            ログイン / 新規登録
          </Link>
        )}
      </div>

      {/* 下部 */}
      <div className="px-3 pb-5 flex flex-col gap-0.5">
        <Link href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/45 hover:text-white/65 hover:bg-white/5 transition-colors">
          <Settings className="w-4 h-4" />
          <span>設定</span>
        </Link>
        {user && (
          <button
            onClick={handleSignOut}
            disabled={pending}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/45 hover:text-white/65 hover:bg-white/5 transition-colors w-full disabled:opacity-40">
            <LogOut className="w-4 h-4" />
            <span>{pending ? '...' : 'ログアウト'}</span>
          </button>
        )}
      </div>
    </aside>
  )
}
