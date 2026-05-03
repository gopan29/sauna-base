'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase-browser'

type Tab = 'login' | 'signup'
type MessageType = 'success' | 'error'

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<MessageType>('error')

  const router = useRouter()
  const supabase = createClient()

  const resetMessage = () => setMessage('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    resetMessage()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage('メールアドレスまたはパスワードが正しくありません。')
      setMessageType('error')
    } else {
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('パスワードが一致しません。')
      setMessageType('error')
      return
    }
    if (password.length < 8) {
      setMessage('パスワードは8文字以上で入力してください。')
      setMessageType('error')
      return
    }
    setLoading(true)
    resetMessage()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName || email.split('@')[0] } },
    })
    if (error) {
      setMessage(error.message)
      setMessageType('error')
    } else {
      setMessage('確認メールを送信しました。メールをご確認の上、ログインしてください。')
      setMessageType('success')
    }
    setLoading(false)
  }

  const switchTab = (t: Tab) => { setTab(t); resetMessage() }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景グロー */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #7cb342 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #a5d63a 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="w-full max-w-sm relative z-10">

        {/* ロゴ */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 transition-transform group-hover:scale-[1.03]"
              style={{
                background: 'linear-gradient(135deg, #7cb342 0%, #4a7c20 100%)',
                boxShadow: '0 12px 40px rgba(124,179,66,0.45)',
              }}>
              <span className="text-4xl">♨️</span>
            </div>
            <h1 className="text-2xl font-bold tracking-wide" style={{ color: 'rgba(255,255,255,0.92)' }}>
              SAUNA BASE
            </h1>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>
              あなたのととのいを点数化する
            </p>
          </Link>
        </div>

        {/* タブ切り替え */}
        <div className="glass rounded-2xl p-1.5 flex mb-4">
          {(['login', 'signup'] as const).map(t => (
            <button key={t}
              onClick={() => switchTab(t)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: tab === t ? 'rgba(124,179,66,0.2)' : 'transparent',
                color: tab === t ? '#a5d63a' : 'rgba(255,255,255,0.38)',
                border: tab === t ? '1px solid rgba(124,179,66,0.35)' : '1px solid transparent',
              }}
            >
              {t === 'login' ? 'ログイン' : '新規登録'}
            </button>
          ))}
        </div>

        {/* フォームカード */}
        <div className="glass rounded-2xl p-6">

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-3">
                <InputField
                  icon={<Mail className="w-4 h-4" />}
                  label="メールアドレス"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="your@email.com"
                />
                <PasswordField
                  label="パスワード"
                  value={password}
                  onChange={setPassword}
                  show={showPassword}
                  onToggle={() => setShowPassword(p => !p)}
                />
              </div>

              {message && <StatusMessage text={message} type={messageType} />}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #7cb342 0%, #4a7c20 100%)',
                  boxShadow: '0 4px 24px rgba(124,179,66,0.38)',
                  color: '#fff',
                }}>
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>

              <div className="text-center">
                <button type="button"
                  className="text-xs transition-colors"
                  style={{ color: 'rgba(255,255,255,0.32)' }}
                  onMouseOver={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.32)')}>
                  パスワードをお忘れですか？
                </button>
              </div>
            </form>

          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* 登録フォームの特典アピール */}
              <div className="rounded-xl p-3 flex items-start gap-2.5"
                style={{ background: 'rgba(124,179,66,0.07)', border: '1px solid rgba(124,179,66,0.2)' }}>
                <span className="text-lg shrink-0 mt-0.5">🎉</span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#a5d63a' }}>登録無料・30秒で完了</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    ととのいスコア記録・AI分析・統計グラフがすべて使えます
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <InputField
                  icon={<User className="w-4 h-4" />}
                  label="表示名"
                  type="text"
                  value={displayName}
                  onChange={setDisplayName}
                  placeholder="サウナ太郎"
                  required={false}
                />
                <InputField
                  icon={<Mail className="w-4 h-4" />}
                  label="メールアドレス"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="your@email.com"
                />
                <PasswordField
                  label="パスワード（8文字以上）"
                  value={password}
                  onChange={setPassword}
                  show={showPassword}
                  onToggle={() => setShowPassword(p => !p)}
                />
                <PasswordField
                  label="パスワード（確認）"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  show={showPassword}
                  onToggle={() => setShowPassword(p => !p)}
                />
              </div>

              {message && <StatusMessage text={message} type={messageType} />}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #7cb342 0%, #4a7c20 100%)',
                  boxShadow: '0 4px 24px rgba(124,179,66,0.38)',
                  color: '#fff',
                }}>
                {loading ? '登録中...' : '無料ではじめる'}
              </button>

              <p className="text-[10px] text-center" style={{ color: 'rgba(255,255,255,0.22)' }}>
                登録することで利用規約およびプライバシーポリシーに同意したものとみなします。
              </p>
            </form>
          )}
        </div>

        {/* ゲストに戻るリンク */}
        <div className="text-center mt-5">
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: 'rgba(255,255,255,0.28)' }}>
            <ArrowLeft className="w-3 h-3" />
            ログインせずに見る
          </Link>
        </div>
      </div>
    </div>
  )
}

function InputField({
  icon, label, type, value, onChange, placeholder, required = true,
}: {
  icon: React.ReactNode
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  required?: boolean
}) {
  return (
    <div>
      <label className="text-xs block mb-1.5" style={{ color: 'rgba(255,255,255,0.48)' }}>{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.28)' }}>
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none transition-colors"
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.82)',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,179,66,0.5)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
        />
      </div>
    </div>
  )
}

function PasswordField({
  label, value, onChange, show, onToggle,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  show: boolean
  onToggle: () => void
}) {
  return (
    <div>
      <label className="text-xs block mb-1.5" style={{ color: 'rgba(255,255,255,0.48)' }}>{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.28)' }}>
          <Lock className="w-4 h-4" />
        </span>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          required
          placeholder="••••••••"
          className="w-full rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none transition-colors"
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.82)',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,179,66,0.5)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
        />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: 'rgba(255,255,255,0.28)' }}>
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

function StatusMessage({ text, type }: { text: string; type: MessageType }) {
  const isSuccess = type === 'success'
  return (
    <p className="text-xs text-center px-3 py-2.5 rounded-lg"
      style={{
        background: isSuccess ? 'rgba(124,179,66,0.1)' : 'rgba(239,68,68,0.1)',
        color: isSuccess ? '#a5d63a' : '#f87171',
        border: `1px solid ${isSuccess ? 'rgba(124,179,66,0.3)' : 'rgba(239,68,68,0.3)'}`,
      }}>
      {text}
    </p>
  )
}
