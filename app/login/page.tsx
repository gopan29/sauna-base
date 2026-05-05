'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Leaf, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase-browser'
import { saveProfileType } from '@/lib/actions'

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
      const pending = localStorage.getItem('pending_totonoi')
      if (pending) {
        try {
          const { typeName, code } = JSON.parse(pending)
          await saveProfileType(typeName, code)
          localStorage.removeItem('pending_totonoi')
        } catch {}
      }
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName || email.split('@')[0] } },
    })
    if (error) {
      setMessage(error.message)
      setMessageType('error')
    } else if (data.session) {
      const pending = localStorage.getItem('pending_totonoi')
      if (pending) {
        try {
          const { typeName, code } = JSON.parse(pending)
          await saveProfileType(typeName, code)
          localStorage.removeItem('pending_totonoi')
          router.push('/')
        } catch {
          router.push('/onboarding')
        }
      } else {
        router.push('/onboarding')
      }
    } else {
      setMessage('確認メールを送信しました。メールをご確認の上、ログインしてください。')
      setMessageType('success')
    }
    setLoading(false)
  }

  const switchTab = (t: Tab) => { setTab(t); resetMessage() }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">

      <div className="w-full max-w-sm">

        {/* ロゴ */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-transform group-hover:scale-[1.03]"
              style={{
                background: 'linear-gradient(135deg, #7cb342 0%, #4a7c20 100%)',
                boxShadow: '0 8px 32px rgba(124,179,66,0.40)',
              }}
            >
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide" style={{ color: '#1a2a10' }}>
              SAUNA BASE
            </h1>
            <p className="text-xs mt-1" style={{ color: 'rgba(26,42,16,0.45)' }}>
              あなたのととのいを点数化する
            </p>
          </Link>
        </div>

        {/* カード */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 4px 32px rgba(0,0,0,0.10)', border: '1px solid rgba(0,0,0,0.07)' }}>

          {/* タブ */}
          <div className="flex border-b" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
            {(['login', 'signup'] as const).map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className="flex-1 py-3.5 text-sm font-semibold transition-colors"
                style={{
                  color: tab === t ? '#4a7c20' : 'rgba(26,42,16,0.35)',
                  borderBottom: tab === t ? '2px solid #7cb342' : '2px solid transparent',
                  background: 'transparent',
                }}
              >
                {t === 'login' ? 'ログイン' : '新規登録'}
              </button>
            ))}
          </div>

          {/* フォーム */}
          <div className="p-6">

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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #7cb342 0%, #4a7c20 100%)',
                    boxShadow: '0 4px 16px rgba(124,179,66,0.35)',
                    color: '#fff',
                  }}
                >
                  {loading ? 'ログイン中...' : 'ログイン'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-xs"
                    style={{ color: 'rgba(26,42,16,0.35)' }}
                  >
                    パスワードをお忘れですか？
                  </button>
                </div>
              </form>

            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                {/* 特典アピール */}
                <div
                  className="rounded-xl p-3 flex items-start gap-2.5"
                  style={{ background: 'rgba(124,179,66,0.07)', border: '1px solid rgba(124,179,66,0.22)' }}
                >
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#5a9e28' }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#4a7c20' }}>登録無料・30秒で完了</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(26,42,16,0.50)' }}>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #7cb342 0%, #4a7c20 100%)',
                    boxShadow: '0 4px 16px rgba(124,179,66,0.35)',
                    color: '#fff',
                  }}
                >
                  {loading ? '登録中...' : '無料ではじめる'}
                </button>

                <p className="text-[10px] text-center" style={{ color: 'rgba(26,42,16,0.30)' }}>
                  登録することで利用規約およびプライバシーポリシーに同意したものとみなします。
                </p>
              </form>
            )}
          </div>
        </div>

        {/* ゲストリンク */}
        <div className="text-center mt-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: 'rgba(26,42,16,0.35)' }}
          >
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
      <label className="text-xs block mb-1.5 font-medium" style={{ color: 'rgba(26,42,16,0.55)' }}>{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(26,42,16,0.30)' }}>
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
            border: '1px solid rgba(26,42,16,0.14)',
            background: 'rgba(26,42,16,0.03)',
            color: '#1a2a10',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,179,66,0.6)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(26,42,16,0.14)')}
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
      <label className="text-xs block mb-1.5 font-medium" style={{ color: 'rgba(26,42,16,0.55)' }}>{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(26,42,16,0.30)' }}>
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
            border: '1px solid rgba(26,42,16,0.14)',
            background: 'rgba(26,42,16,0.03)',
            color: '#1a2a10',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,179,66,0.6)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(26,42,16,0.14)')}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: 'rgba(26,42,16,0.30)' }}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

function StatusMessage({ text, type }: { text: string; type: MessageType }) {
  const isSuccess = type === 'success'
  return (
    <p
      className="text-xs text-center px-3 py-2.5 rounded-lg"
      style={{
        background: isSuccess ? 'rgba(124,179,66,0.08)' : 'rgba(239,68,68,0.08)',
        color: isSuccess ? '#4a7c20' : '#dc2626',
        border: `1px solid ${isSuccess ? 'rgba(124,179,66,0.25)' : 'rgba(239,68,68,0.25)'}`,
      }}
    >
      {text}
    </p>
  )
}
