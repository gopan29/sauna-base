'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, Thermometer, Droplets, Check } from 'lucide-react'
import { GlassCard } from './GlassCard'
import { calculateScore, getScoreRank } from '@/lib/score'
import { saveRecord } from '@/lib/actions'
import { useAuth } from '@/contexts/AuthContext'
import type { RestStyle, BodyCondition } from '@/types'

const restOptions: { value: RestStyle; label: string; icon: string }[] = [
  { value: 'outdoor', label: '外気浴', icon: '🌿' },
  { value: 'indoor',  label: '内気浴', icon: '🛋️' },
  { value: 'rest_only', label: '休憩のみ', icon: '😴' },
  { value: 'none',    label: 'なし', icon: '✗' },
]

const conditionOptions: { value: BodyCondition; label: string; emoji: string }[] = [
  { value: 'great',  label: '良い',     emoji: '😊' },
  { value: 'normal', label: '普通',     emoji: '😐' },
  { value: 'tired',  label: '疲れ気味', emoji: '😪' },
  { value: 'sick',   label: '不調',     emoji: '🤒' },
]

export function RecordForm() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    facilityName: '',
    memo: '',
    sets: 3,
    saunaTemp: 92,
    waterTemp: 16,
    restStyle: 'outdoor' as RestStyle,
    subjectiveRating: 4 as 1|2|3|4|5,
    bodyCondition: 'normal' as BodyCondition,
    totalMinutes: 90,
    notes: '',
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const score = calculateScore(
    form.sets, form.saunaTemp, form.waterTemp, form.restStyle, form.subjectiveRating
  )
  const rank = getScoreRank(score)

  if (!user) {
    return (
      <div className="space-y-4 max-w-lg mx-auto">
        {/* スコアプレビュー（デモ） */}
        <GlassCard className="p-4 text-center"
          style={{ background: 'rgba(124,179,66,0.08)', border: '1px solid rgba(124,179,66,0.25)' }}>
          <p className="text-xs text-white/50 mb-1">ととのいスコア（サンプル）</p>
          <p className="text-5xl font-bold text-[#a5d63a]">42</p>
          <p className="text-sm text-[#7cb342] mt-1">ととのい上級者</p>
        </GlassCard>

        <GlassCard className="p-8 text-center">
          <div className="text-5xl mb-4">♨️</div>
          <h3 className="text-base font-semibold text-white/85 mb-2">
            ログインして記録をはじめよう
          </h3>
          <p className="text-sm text-white/45 mb-1">
            あなたのサウナ体験をスコア化・記録・分析するには
          </p>
          <p className="text-sm text-white/45 mb-6">
            アカウントが必要です。登録は無料です。
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/login?tab=signup"
              className="inline-block w-full py-3.5 rounded-xl text-sm font-bold text-center"
              style={{
                background: 'linear-gradient(135deg, #7cb342 0%, #4a7c20 100%)',
                boxShadow: '0 4px 20px rgba(124,179,66,0.35)',
                color: '#fff',
              }}>
              無料で新規登録
            </Link>
            <Link href="/login"
              className="inline-block w-full py-3 rounded-xl text-sm font-medium text-center"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.6)',
              }}>
              ログイン
            </Link>
          </div>
          <p className="text-[10px] text-white/25 mt-4">登録無料 · メールアドレスのみ · 30秒で完了</p>
        </GlassCard>
      </div>
    )
  }

  const handleSave = async () => {
    if (!form.facilityName.trim()) {
      setError('施設名を入力してください。')
      return
    }
    setSaving(true)
    setError('')
    const result = await saveRecord({
      date: form.date,
      facility_name: form.facilityName,
      memo: form.memo || null,
      sets: form.sets,
      sauna_temp: form.saunaTemp,
      water_temp: form.waterTemp,
      rest_style: form.restStyle,
      subjective_rating: form.subjectiveRating,
      body_condition: form.bodyCondition,
      total_minutes: form.totalMinutes,
      notes: form.notes || null,
      score,
    })
    setSaving(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* スコアプレビュー */}
      <GlassCard className="p-4 text-center"
        style={{ background: 'rgba(124,179,66,0.08)', border: '1px solid rgba(124,179,66,0.25)' }}>
        <p className="text-xs text-white/50 mb-1">ととのいスコア（プレビュー）</p>
        <p className="text-5xl font-bold text-[#a5d63a]">{score}</p>
        <p className="text-sm text-[#7cb342] mt-1">{rank}</p>
      </GlassCard>

      {/* 基本情報 */}
      <GlassCard className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white/70">基本情報</h3>
        <div>
          <label className="text-xs text-white/50 block mb-1">日付</label>
          <input
            type="date"
            value={form.date}
            onChange={e => set('date', e.target.value)}
            className="w-full glass rounded-xl px-3 py-2 text-sm text-white/80 outline-none focus:border-[#7cb342]/50"
            style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }}
          />
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">施設名</label>
          <input
            type="text"
            value={form.facilityName}
            onChange={e => set('facilityName', e.target.value)}
            placeholder="森の湯"
            className="w-full rounded-xl px-3 py-2 text-sm text-white/80 outline-none placeholder-white/20"
            style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }}
          />
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">メモ（任意）</label>
          <input
            type="text"
            value={form.memo}
            onChange={e => set('memo', e.target.value)}
            placeholder="気持ちよくととのえた！"
            className="w-full rounded-xl px-3 py-2 text-sm text-white/80 outline-none placeholder-white/20"
            style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }}
          />
        </div>
      </GlassCard>

      {/* セット記録 */}
      <GlassCard className="p-4 space-y-4">
        <h3 className="text-sm font-semibold text-white/70">セット記録</h3>

        {/* セット数 */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-white/50">セット数</label>
            <span className="text-sm font-bold text-[#a5d63a]">{form.sets}セット</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => set('sets', Math.max(1, form.sets - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white glass">−</button>
            <div className="flex-1 h-2 rounded-full bg-white/10 relative">
              <div className="h-full rounded-full bg-[#7cb342]" style={{ width: `${(form.sets / 10) * 100}%` }} />
            </div>
            <button onClick={() => set('sets', Math.min(10, form.sets + 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white glass">+</button>
          </div>
        </div>

        {/* サウナ温度 */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-white/50 flex items-center gap-1">
              <Thermometer className="w-3 h-3" /> サウナ温度
            </label>
            <span className="text-sm font-bold text-[#a5d63a]">{form.saunaTemp}℃</span>
          </div>
          <input type="range" min={60} max={120} step={1}
            value={form.saunaTemp}
            onChange={e => set('saunaTemp', Number(e.target.value))}
            className="w-full"
            style={{ accentColor: '#7cb342' }}
          />
          <div className="flex justify-between text-[10px] text-white/25 mt-0.5">
            <span>60℃</span><span>110℃</span>
          </div>
        </div>

        {/* 水風呂温度 */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-white/50 flex items-center gap-1">
              <Droplets className="w-3 h-3" /> 水風呂温度
            </label>
            <span className="text-sm font-bold text-[#a5d63a]">{form.waterTemp}℃</span>
          </div>
          <input type="range" min={5} max={30} step={0.5}
            value={form.waterTemp}
            onChange={e => set('waterTemp', Number(e.target.value))}
            className="w-full"
            style={{ accentColor: '#7cb342' }}
          />
          <div className="flex justify-between text-[10px] text-white/25 mt-0.5">
            <span>5℃</span><span>30℃</span>
          </div>
        </div>

        {/* 休憩スタイル */}
        <div>
          <label className="text-xs text-white/50 block mb-2">休憩スタイル</label>
          <div className="grid grid-cols-4 gap-2">
            {restOptions.map(o => (
              <button key={o.value}
                onClick={() => set('restStyle', o.value)}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-xs transition-all
                  ${form.restStyle === o.value
                    ? 'text-[#a5d63a]'
                    : 'text-white/45 hover:text-white/65'
                  }`}
                style={{
                  background: form.restStyle === o.value ? 'rgba(124,179,66,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${form.restStyle === o.value ? 'rgba(124,179,66,0.4)' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                <span className="text-lg">{o.icon}</span>
                <span>{o.label}</span>
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* 主観評価 */}
      <GlassCard className="p-4 space-y-4">
        <h3 className="text-sm font-semibold text-white/70">主観評価</h3>

        <div>
          <label className="text-xs text-white/50 block mb-2">ととのい度</label>
          <div className="flex gap-2">
            {([1,2,3,4,5] as const).map(n => (
              <button key={n} onClick={() => set('subjectiveRating', n)}
                className="text-2xl transition-transform hover:scale-110">
                <Star
                  className={`w-7 h-7 ${n <= form.subjectiveRating ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-white/20'}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-white/50 block mb-2">体調</label>
          <div className="grid grid-cols-4 gap-2">
            {conditionOptions.map(o => (
              <button key={o.value}
                onClick={() => set('bodyCondition', o.value)}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-xs transition-all
                  ${form.bodyCondition === o.value ? 'text-[#a5d63a]' : 'text-white/45 hover:text-white/65'}`}
                style={{
                  background: form.bodyCondition === o.value ? 'rgba(124,179,66,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${form.bodyCondition === o.value ? 'rgba(124,179,66,0.4)' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                <span className="text-xl">{o.emoji}</span>
                <span>{o.label}</span>
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* その他 */}
      <GlassCard className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white/70">その他の情報（任意）</h3>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-white/50">総滞在時間</label>
            <span className="text-sm font-bold text-[#a5d63a]">{form.totalMinutes}分</span>
          </div>
          <input type="range" min={30} max={300} step={5}
            value={form.totalMinutes}
            onChange={e => set('totalMinutes', Number(e.target.value))}
            className="w-full"
            style={{ accentColor: '#7cb342' }}
          />
          <div className="flex justify-between text-[10px] text-white/25 mt-0.5">
            <span>30分</span><span>300分</span>
          </div>
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">メモ・感想</label>
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            rows={3}
            placeholder="最高にととのえた！外気浴が特に気持ちよかった。"
            className="w-full rounded-xl px-3 py-2 text-sm text-white/80 outline-none placeholder-white/20 resize-none"
            style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }}
          />
        </div>
      </GlassCard>

      {error && (
        <p className="text-xs text-red-400 text-center px-3 py-2 rounded-lg"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          {error}
        </p>
      )}

      {/* 保存ボタン */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
        style={{
          background: saved
            ? 'rgba(124,179,66,0.3)'
            : 'linear-gradient(135deg, #7cb342 0%, #4a7c20 100%)',
          boxShadow: '0 4px 20px rgba(124,179,66,0.35)',
          color: '#fff',
        }}
      >
        {saved ? (
          <><Check className="w-5 h-5" /> 記録しました！</>
        ) : saving ? (
          '保存中...'
        ) : (
          '記録を保存'
        )}
      </button>
    </div>
  )
}
