'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Leaf } from 'lucide-react'
import { adminLogin } from '@/lib/admin-auth'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await adminLogin(password)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/admin/facilities')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#f0f4f0' }}>
      <div className="w-full max-w-xs">

        {/* ロゴ */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
            style={{ background: 'linear-gradient(135deg, #7cb342 0%, #4a7c20 100%)', boxShadow: '0 8px 24px rgba(124,179,66,0.35)' }}>
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-lg font-bold" style={{ color: '#1a2a10' }}>SAUNA BASE</h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(26,42,16,0.5)' }}>管理画面</p>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit}
          className="rounded-2xl p-6 space-y-4"
          style={{ background: 'rgba(255,255,255,0.85)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.9)' }}>

          <h2 className="text-sm font-semibold text-center" style={{ color: '#1a2a10' }}>
            管理者ログイン
          </h2>

          <div>
            <label className="text-xs block mb-1.5" style={{ color: 'rgba(26,42,16,0.55)' }}>
              管理者パスワード
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'rgba(26,42,16,0.3)' }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none"
                style={{
                  border: '1px solid rgba(26,42,16,0.15)',
                  background: 'rgba(255,255,255,0.7)',
                  color: '#1a2a10',
                }}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-center py-2 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #7cb342 0%, #4a7c20 100%)',
              boxShadow: '0 4px 16px rgba(124,179,66,0.35)',
              color: '#fff',
            }}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  )
}
