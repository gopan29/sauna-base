'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Star, Thermometer, Droplets, Check, MapPin, Plus, Wind, Home, Clock, X, Leaf } from 'lucide-react'
import { GlassCard } from './GlassCard'
import { calculateBaseScores, getScoreRank } from '@/lib/score'
import { applyScoreAdjustment, adjustmentMessages } from '@/lib/sauna-base/scoreAdjustments'
import { saveRecord, searchFacilities, addFacility } from '@/lib/actions'
import { useAuth } from '@/contexts/AuthContext'
import type { RestStyle, BodyCondition } from '@/types'

type FacilitySuggestion = {
  id: string
  name: string
  address: string | null
  prefecture: string | null
  city: string | null
}

const restOptions: { value: RestStyle; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'outdoor',   label: '外気浴',   icon: Wind },
  { value: 'indoor',    label: '内気浴',   icon: Home },
  { value: 'rest_only', label: '休憩のみ', icon: Clock },
  { value: 'none',      label: 'なし',     icon: X },
]

const conditionOptions: { value: BodyCondition; label: string }[] = [
  { value: 'great',  label: '良い'     },
  { value: 'normal', label: '普通'     },
  { value: 'tired',  label: '疲れ気味' },
  { value: 'sick',   label: '不調'     },
]

export function RecordForm({ typeName }: { typeName?: string | null }) {
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
  const [suggestions, setSuggestions] = useState<FacilitySuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [facilityId, setFacilityId] = useState<string | null>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suggestRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleFacilityInput = (value: string) => {
    set('facilityName', value)
    setFacilityId(null)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (value.trim().length < 1) { setSuggestions([]); setShowSuggestions(false); return }
    searchTimer.current = setTimeout(async () => {
      const results = await searchFacilities(value)
      setSuggestions(results as FacilitySuggestion[])
      setShowSuggestions(true)
    }, 300)
  }

  const selectFacility = (f: FacilitySuggestion) => {
    set('facilityName', f.name)
    setFacilityId(f.id)
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleAddNewFacility = async () => {
    if (!form.facilityName.trim()) return
    const result = await addFacility(form.facilityName.trim())
    if (result) setFacilityId(result.id)
    setShowSuggestions(false)
  }

  const baseScores = calculateBaseScores(
    form.sets, form.saunaTemp, form.waterTemp, form.restStyle, form.subjectiveRating
  )
  const adjusted = applyScoreAdjustment(baseScores, typeName ?? null)
  const score = adjusted.total
  const rank = getScoreRank(score)
  const adjustmentMessage = typeName ? adjustmentMessages[typeName] ?? null : null

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
          <Leaf className="w-12 h-12 mx-auto mb-4 text-[#7cb342]/50" />
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
        {adjustmentMessage && (
          <p className="text-[10px] text-white/35 mt-2 leading-relaxed">{adjustmentMessage}</p>
        )}
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
        <div className="relative" ref={suggestRef}>
          <label className="text-xs text-white/50 block mb-1">施設名</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={form.facilityName}
              onChange={e => handleFacilityInput(e.target.value)}
              onFocus={() => form.facilityName && setShowSuggestions(suggestions.length > 0)}
              placeholder="施設名を入力して検索..."
              autoComplete="off"
              className="w-full rounded-xl pl-8 pr-3 py-2 text-sm text-white/80 outline-none placeholder-white/20"
              style={{ border: `1px solid ${facilityId ? 'rgba(124,179,66,0.5)' : 'rgba(255,255,255,0.12)'}`, background: 'rgba(255,255,255,0.05)' }}
            />
            {facilityId && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#7cb342] font-medium">✓ 登録済み</span>
            )}
          </div>

          {/* サジェストドロップダウン */}
          {showSuggestions && (
            <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden"
              style={{ background: 'rgba(10,20,8,0.96)', border: '1px solid rgba(124,179,66,0.25)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
              {suggestions.map(f => (
                <button key={f.id} type="button"
                  onMouseDown={() => selectFacility(f)}
                  className="w-full flex items-start gap-2 px-3 py-2.5 text-left hover:bg-white/5 transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-[#7cb342] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm text-white/85 font-medium truncate">{f.name}</p>
                    {(f.city || f.prefecture) && (
                      <p className="text-[10px] text-white/40">{f.prefecture}{f.city ? ` ${f.city}` : ''}</p>
                    )}
                  </div>
                </button>
              ))}
              {/* DBにない場合は新規追加ボタン */}
              <button type="button"
                onMouseDown={handleAddNewFacility}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left border-t hover:bg-white/5 transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <Plus className="w-3.5 h-3.5 text-[#7cb342] shrink-0" />
                <span className="text-sm text-[#7cb342]">「{form.facilityName}」を新しく追加</span>
              </button>
            </div>
          )}
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
                <o.icon className="w-4 h-4" />
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
