'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Search, Leaf, LogOut, Building2, Users, Mail, Calendar, Clock } from 'lucide-react'
import type { UserRow } from '@/lib/admin-actions'
import { adminLogout } from '@/lib/admin-auth'

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '-'
  const d = new Date(iso)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function UserManager({ initialUsers }: { initialUsers: UserRow[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<'createdAt' | 'recordCount' | 'lastSignInAt'>('createdAt')

  const handleLogout = async () => {
    await adminLogout()
    router.push('/admin/login')
  }

  const filtered = initialUsers
    .filter(u => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return u.email.toLowerCase().includes(q) || (u.displayName ?? '').toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sortKey === 'recordCount') return b.recordCount - a.recordCount
      if (sortKey === 'lastSignInAt') {
        return new Date(b.lastSignInAt ?? 0).getTime() - new Date(a.lastSignInAt ?? 0).getTime()
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const withDiagnosis = initialUsers.filter(u => u.totonoiCode).length
  const withRecords = initialUsers.filter(u => u.recordCount > 0).length

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f0' }}>

      {/* ヘッダー */}
      <header style={{ background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid rgba(26,42,16,0.1)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7cb342 0%, #4a7c20 100%)' }}>
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm" style={{ color: '#1a2a10' }}>SAUNA BASE</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(124,179,66,0.15)', color: '#4a7c20' }}>
              管理画面
            </span>
          </div>
          <nav className="flex items-center gap-1">
            {[
              { href: '/admin/facilities', icon: Building2, label: '施設管理' },
              { href: '/admin/users', icon: Users, label: 'ユーザー管理' },
            ].map(item => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    background: active ? 'rgba(124,179,66,0.15)' : 'transparent',
                    color: active ? '#4a7c20' : 'rgba(26,42,16,0.5)',
                    fontWeight: active ? 600 : 400,
                  }}>
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-red-50"
            style={{ color: 'rgba(26,42,16,0.5)' }}>
            <LogOut className="w-3.5 h-3.5" />
            ログアウト
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* タイトル + サマリー */}
        <div className="mb-5">
          <h1 className="text-lg font-bold" style={{ color: '#1a2a10' }}>ユーザー管理</h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(26,42,16,0.45)' }}>
            {initialUsers.length}名登録
          </p>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: '総ユーザー数', value: initialUsers.length, unit: '名', icon: Users },
            { label: '記録あり', value: withRecords, unit: '名', icon: Calendar },
            { label: '診断済み', value: withDiagnosis, unit: '名', icon: Leaf },
            { label: '平均記録数', value: initialUsers.length ? Math.round(initialUsers.reduce((s, u) => s + u.recordCount, 0) / initialUsers.length) : 0, unit: '件', icon: Clock },
          ].map(item => (
            <div key={item.label} className="rounded-xl p-3"
              style={{ background: '#fff', border: '1px solid rgba(26,42,16,0.08)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <item.icon className="w-3.5 h-3.5" style={{ color: '#7cb342' }} />
                <p className="text-[10px]" style={{ color: 'rgba(26,42,16,0.45)' }}>{item.label}</p>
              </div>
              <p className="text-xl font-bold" style={{ color: '#1a2a10' }}>
                {item.value}<span className="text-xs font-normal ml-0.5" style={{ color: 'rgba(26,42,16,0.45)' }}>{item.unit}</span>
              </p>
            </div>
          ))}
        </div>

        {/* フィルター */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              style={{ color: 'rgba(26,42,16,0.35)' }} />
            <input
              type="text"
              placeholder="メールアドレス・表示名で検索"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl outline-none"
              style={{ background: '#fff', border: '1px solid rgba(26,42,16,0.12)', color: '#1a2a10' }}
            />
          </div>
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value as typeof sortKey)}
            className="text-sm rounded-xl px-3 py-2 outline-none"
            style={{ background: '#fff', border: '1px solid rgba(26,42,16,0.12)', color: '#1a2a10' }}>
            <option value="createdAt">登録日順</option>
            <option value="recordCount">記録数順</option>
            <option value="lastSignInAt">最終ログイン順</option>
          </select>
        </div>

        {/* ユーザーテーブル */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(26,42,16,0.08)' }}>
          {/* ヘッダー行 */}
          <div className="grid text-[10px] font-semibold px-4 py-2.5"
            style={{
              color: 'rgba(26,42,16,0.45)',
              borderBottom: '1px solid rgba(26,42,16,0.07)',
              gridTemplateColumns: '1fr 120px 100px 80px 140px',
            }}>
            <span>ユーザー</span>
            <span>TOTONOI CODE</span>
            <span className="text-center">記録数</span>
            <span className="text-center">登録日</span>
            <span>最終ログイン</span>
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-center py-10" style={{ color: 'rgba(26,42,16,0.35)' }}>
              該当するユーザーが見つかりません
            </p>
          ) : (
            filtered.map((user, idx) => (
              <div
                key={user.id}
                className="grid items-center px-4 py-3"
                style={{
                  gridTemplateColumns: '1fr 120px 80px 100px 140px',
                  borderBottom: idx < filtered.length - 1 ? '1px solid rgba(26,42,16,0.06)' : 'none',
                  background: idx % 2 === 0 ? '#fff' : 'rgba(26,42,16,0.015)',
                }}>
                {/* ユーザー情報 */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: 'rgba(124,179,66,0.15)', color: '#4a7c20' }}>
                      {(user.displayName ?? user.email)[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium truncate" style={{ color: '#1a2a10' }}>
                      {user.displayName ?? '（未設定）'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 ml-7.5">
                    <Mail className="w-3 h-3 shrink-0" style={{ color: 'rgba(26,42,16,0.3)' }} />
                    <span className="text-[10px] truncate" style={{ color: 'rgba(26,42,16,0.45)' }}>{user.email}</span>
                  </div>
                </div>

                {/* TOTONOI CODE */}
                <div>
                  {user.totonoiCode ? (
                    <div>
                      <span className="text-xs font-bold" style={{ color: '#4a7c20' }}>{user.totonoiCode}</span>
                      {user.typeName && (
                        <p className="text-[9px] mt-0.5" style={{ color: 'rgba(26,42,16,0.4)' }}>{user.typeName}</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px]" style={{ color: 'rgba(26,42,16,0.25)' }}>未診断</span>
                  )}
                </div>

                {/* 記録数 */}
                <div className="text-center">
                  <span className="text-sm font-semibold" style={{ color: user.recordCount > 0 ? '#1a2a10' : 'rgba(26,42,16,0.25)' }}>
                    {user.recordCount}
                  </span>
                  <span className="text-[10px]" style={{ color: 'rgba(26,42,16,0.35)' }}>件</span>
                </div>

                {/* 登録日 */}
                <div className="text-xs" style={{ color: 'rgba(26,42,16,0.5)' }}>
                  {formatDate(user.createdAt)}
                </div>

                {/* 最終ログイン */}
                <div className="text-[10px]" style={{ color: 'rgba(26,42,16,0.45)' }}>
                  {formatDateTime(user.lastSignInAt)}
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-[10px] text-center mt-3" style={{ color: 'rgba(26,42,16,0.3)' }}>
          {filtered.length}/{initialUsers.length}名を表示
        </p>
      </div>
    </div>
  )
}
