'use client'

import { useState, useTransition, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Search, Plus, Pencil, Trash2, Leaf, LogOut, X, Check, Building2, Users } from 'lucide-react'
import {
  adminGetFacilities,
  adminUpdateFacility,
  adminDeleteFacility,
  adminCreateFacility,
} from '@/lib/admin-actions'
import { adminLogout } from '@/lib/admin-auth'

type Facility = {
  id: string
  name: string
  address: string | null
  prefecture: string | null
  city: string | null
  status: string
  record_count: number
  source: string
  created_at: string
}

type FacilityForm = {
  name: string
  prefecture: string
  city: string
  address: string
  status: string
}

const emptyForm: FacilityForm = { name: '', prefecture: '', city: '', address: '', status: 'confirmed' }

export function FacilityManager({
  initialFacilities,
  initialCount,
  prefectures,
}: {
  initialFacilities: Facility[]
  initialCount: number
  prefectures: string[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities)
  const [count, setCount] = useState(initialCount)
  const [search, setSearch] = useState('')
  const [prefFilter, setPrefFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 50

  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editTarget, setEditTarget] = useState<Facility | null>(null)
  const [form, setForm] = useState<FacilityForm>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Facility | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchFacilities = useCallback(
    async (params: { search?: string; prefecture?: string; status?: string; page?: number }) => {
      startTransition(async () => {
        const result = await adminGetFacilities({
          search: params.search ?? search,
          prefecture: params.prefecture ?? prefFilter,
          status: params.status ?? statusFilter,
          page: params.page ?? page,
          pageSize: PAGE_SIZE,
        })
        setFacilities(result.data as Facility[])
        setCount(result.count)
      })
    },
    [search, prefFilter, statusFilter, page]
  )

  const handleSearch = (v: string) => {
    setSearch(v); setPage(0)
    fetchFacilities({ search: v, page: 0 })
  }
  const handlePref = (v: string) => {
    setPrefFilter(v); setPage(0)
    fetchFacilities({ prefecture: v, page: 0 })
  }
  const handleStatus = (v: string) => {
    setStatusFilter(v); setPage(0)
    fetchFacilities({ status: v, page: 0 })
  }
  const handlePage = (p: number) => {
    setPage(p)
    fetchFacilities({ page: p })
  }

  const openAdd = () => { setForm(emptyForm); setFormError(''); setModal('add') }
  const openEdit = (f: Facility) => {
    setEditTarget(f)
    setForm({ name: f.name, prefecture: f.prefecture ?? '', city: f.city ?? '', address: f.address ?? '', status: f.status })
    setFormError('')
    setModal('edit')
  }
  const closeModal = () => { setModal(null); setEditTarget(null) }

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError('施設名は必須です'); return }
    setSaving(true); setFormError('')
    if (modal === 'add') {
      const result = await adminCreateFacility({
        name: form.name.trim(),
        prefecture: form.prefecture || null,
        city: form.city || null,
        address: form.address || null,
      })
      if (result.error) { setFormError(result.error); setSaving(false); return }
    } else if (modal === 'edit' && editTarget) {
      const result = await adminUpdateFacility(editTarget.id, {
        name: form.name.trim(),
        prefecture: form.prefecture || null,
        city: form.city || null,
        address: form.address || null,
        status: form.status,
      })
      if (result.error) { setFormError(result.error); setSaving(false); return }
    }
    setSaving(false)
    closeModal()
    fetchFacilities({})
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setSaving(true)
    await adminDeleteFacility(deleteTarget.id)
    setSaving(false)
    setDeleteTarget(null)
    fetchFacilities({})
  }

  const handleLogout = async () => {
    await adminLogout()
    router.push('/admin/login')
  }

  const totalPages = Math.ceil(count / PAGE_SIZE)

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

        {/* ページタイトル */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-bold" style={{ color: '#1a2a10' }}>施設管理</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(26,42,16,0.45)' }}>
              {count.toLocaleString()}件
            </p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #7cb342 0%, #4a7c20 100%)', color: '#fff', boxShadow: '0 4px 12px rgba(124,179,66,0.3)' }}>
            <Plus className="w-4 h-4" />
            施設を追加
          </button>
        </div>

        {/* フィルター */}
        <div className="rounded-2xl p-4 mb-4 flex flex-wrap gap-3 items-center"
          style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {/* 検索 */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(26,42,16,0.35)' }} />
            <input
              type="text" value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="施設名で検索..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none"
              style={{ border: '1px solid rgba(26,42,16,0.12)', background: '#f8faf8', color: '#1a2a10' }}
            />
          </div>

          {/* 都道府県 */}
          <select value={prefFilter} onChange={e => handlePref(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm outline-none cursor-pointer"
            style={{ border: '1px solid rgba(26,42,16,0.12)', background: '#f8faf8', color: '#1a2a10' }}>
            <option value="all">全都道府県</option>
            {prefectures.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* ステータス */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(26,42,16,0.12)' }}>
            {[['all','全て'], ['confirmed','確認済'], ['pending','承認待ち']].map(([val, label]) => (
              <button key={val} onClick={() => handleStatus(val)}
                className="px-3 py-2 text-xs font-medium transition-colors"
                style={{
                  background: statusFilter === val ? '#7cb342' : '#f8faf8',
                  color: statusFilter === val ? '#fff' : 'rgba(26,42,16,0.6)',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* テーブル */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(26,42,16,0.08)' }}>
                  {['施設名', '都道府県', '市区町村', 'ステータス', '記録数', 'ソース', '操作'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold"
                      style={{ color: 'rgba(26,42,16,0.5)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: 'rgba(26,42,16,0.4)' }}>
                      読み込み中...
                    </td>
                  </tr>
                ) : facilities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: 'rgba(26,42,16,0.4)' }}>
                      施設が見つかりませんでした
                    </td>
                  </tr>
                ) : facilities.map((f, i) => (
                  <tr key={f.id}
                    style={{ borderBottom: i < facilities.length - 1 ? '1px solid rgba(26,42,16,0.06)' : 'none' }}
                    className="hover:bg-[rgba(124,179,66,0.04)] transition-colors">
                    <td className="px-4 py-3 font-medium" style={{ color: '#1a2a10' }}>{f.name}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'rgba(26,42,16,0.65)' }}>{f.prefecture ?? '—'}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'rgba(26,42,16,0.65)' }}>{f.city ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={f.status === 'confirmed'
                          ? { background: 'rgba(124,179,66,0.15)', color: '#4a7c20' }
                          : { background: 'rgba(251,191,36,0.15)', color: '#92400e' }}>
                        {f.status === 'confirmed' ? <><Check className="w-2.5 h-2.5" />確認済</> : <>⏳ 承認待ち</>}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'rgba(26,42,16,0.65)' }}>{f.record_count}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'rgba(26,42,16,0.45)' }}>{f.source}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(f)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors hover:bg-green-50"
                          style={{ color: '#4a7c20', border: '1px solid rgba(124,179,66,0.3)' }}>
                          <Pencil className="w-3 h-3" />編集
                        </button>
                        <button onClick={() => setDeleteTarget(f)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors hover:bg-red-50"
                          style={{ color: '#dc2626', border: '1px solid rgba(239,68,68,0.25)' }}>
                          <Trash2 className="w-3 h-3" />削除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(26,42,16,0.06)' }}>
              <span className="text-xs" style={{ color: 'rgba(26,42,16,0.45)' }}>
                {page * PAGE_SIZE + 1}〜{Math.min((page + 1) * PAGE_SIZE, count)} / {count}件
              </span>
              <div className="flex gap-2">
                <button onClick={() => handlePage(page - 1)} disabled={page === 0}
                  className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-40 transition-colors hover:bg-green-50"
                  style={{ border: '1px solid rgba(26,42,16,0.12)', color: '#1a2a10' }}>
                  ← 前へ
                </button>
                <span className="px-3 py-1.5 text-xs" style={{ color: 'rgba(26,42,16,0.55)' }}>
                  {page + 1} / {totalPages}
                </span>
                <button onClick={() => handlePage(page + 1)} disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-40 transition-colors hover:bg-green-50"
                  style={{ border: '1px solid rgba(26,42,16,0.12)', color: '#1a2a10' }}>
                  次へ →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 追加・編集モーダル */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="w-full max-w-md rounded-2xl p-6"
            style={{ background: '#fff', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold" style={{ color: '#1a2a10' }}>
                {modal === 'add' ? '施設を追加' : '施設を編集'}
              </h3>
              <button onClick={closeModal} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100">
                <X className="w-4 h-4" style={{ color: 'rgba(26,42,16,0.5)' }} />
              </button>
            </div>

            <div className="space-y-3">
              <FormField label="施設名 *" value={form.name} onChange={v => setForm(f => ({...f, name: v}))} placeholder="例：新宮温泉" />
              <div className="grid grid-cols-2 gap-3">
                <FormField label="都道府県" value={form.prefecture} onChange={v => setForm(f => ({...f, prefecture: v}))} placeholder="大阪府" />
                <FormField label="市区町村" value={form.city} onChange={v => setForm(f => ({...f, city: v}))} placeholder="大阪市" />
              </div>
              <FormField label="住所" value={form.address} onChange={v => setForm(f => ({...f, address: v}))} placeholder="住所（任意）" />

              {modal === 'edit' && (
                <div>
                  <label className="text-xs block mb-1.5" style={{ color: 'rgba(26,42,16,0.55)' }}>ステータス</label>
                  <div className="flex gap-2">
                    {[['confirmed','✓ 確認済み'], ['pending','⏳ 承認待ち']].map(([val, label]) => (
                      <button key={val} type="button"
                        onClick={() => setForm(f => ({...f, status: val}))}
                        className="flex-1 py-2 rounded-xl text-xs font-medium transition-colors"
                        style={{
                          background: form.status === val ? (val === 'confirmed' ? '#7cb342' : '#f59e0b') : '#f8faf8',
                          color: form.status === val ? '#fff' : 'rgba(26,42,16,0.6)',
                          border: '1px solid rgba(26,42,16,0.1)',
                        }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {formError && (
              <p className="mt-3 text-xs text-center py-2 rounded-lg"
                style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626' }}>
                {formError}
              </p>
            )}

            <div className="flex gap-3 mt-5">
              <button onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-gray-50"
                style={{ border: '1px solid rgba(26,42,16,0.15)', color: 'rgba(26,42,16,0.65)' }}>
                キャンセル
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #7cb342 0%, #4a7c20 100%)', color: '#fff' }}>
                {saving ? '保存中...' : '保存する'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 削除確認モーダル */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={e => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: '#fff', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(239,68,68,0.1)' }}>
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color: '#1a2a10' }}>施設を削除しますか？</h3>
              <p className="text-sm" style={{ color: 'rgba(26,42,16,0.6)' }}>
                「{deleteTarget.name}」を削除します。<br />この操作は取り消せません。
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid rgba(26,42,16,0.15)', color: 'rgba(26,42,16,0.65)' }}>
                キャンセル
              </button>
              <button onClick={handleDelete} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60"
                style={{ background: '#dc2626', color: '#fff' }}>
                {saving ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FormField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div>
      <label className="text-xs block mb-1.5" style={{ color: 'rgba(26,42,16,0.55)' }}>{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl text-sm outline-none"
        style={{ border: '1px solid rgba(26,42,16,0.12)', background: '#f8faf8', color: '#1a2a10' }}
      />
    </div>
  )
}
