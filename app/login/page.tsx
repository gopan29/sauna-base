'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(error.message)
      } else {
        setMessage('確認メールを送信しました。メールをご確認ください。')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage('メールアドレスまたはパスワードが正しくありません。')
      } else {
        window.location.href = '/'
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #7cb342 0%, #4a7c20 100%)', boxShadow: '0 8px 32px rgba(124,179,66,0.4)' }}>
            <span className="text-3xl">♨️</span>
          </div>
          <h1 className="text-2xl font-bold text-white/90">SAUNA BASE</h1>
          <p className="text-sm text-white/40 mt-1">あなたのととのいを点数化する</p>
        </div>

        {/* フォーム */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white/80 text-center">
            {isSignUp ? 'アカウント作成' : 'ログイン'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-white/50 block mb-1">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white/80 outline-none placeholder-white/20"
                style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }}
              />
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white/80 outline-none placeholder-white/20"
                style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }}
              />
            </div>

            {message && (
              <p className="text-xs text-center px-3 py-2 rounded-lg"
                style={{
                  background: message.includes('送信') ? 'rgba(124,179,66,0.1)' : 'rgba(239,68,68,0.1)',
                  color: message.includes('送信') ? '#a5d63a' : '#f87171',
                  border: `1px solid ${message.includes('送信') ? 'rgba(124,179,66,0.3)' : 'rgba(239,68,68,0.3)'}`,
                }}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #7cb342 0%, #4a7c20 100%)',
                boxShadow: '0 4px 20px rgba(124,179,66,0.35)',
                color: '#fff',
              }}
            >
              {loading ? '...' : isSignUp ? 'アカウントを作成' : 'ログイン'}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setMessage('') }}
              className="text-xs text-[#7cb342] hover:text-[#a5d63a] transition-colors"
            >
              {isSignUp ? 'すでにアカウントをお持ちの方はこちら' : 'アカウントを作成する'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
