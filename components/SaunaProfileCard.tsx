'use client'

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer
} from 'recharts'
import { GlassCard } from './GlassCard'
import type { SaunaProfile } from '@/types'

interface Props {
  profile: SaunaProfile
}

const radarData = [
  { subject: 'サウナ温度', value: 4.5 },
  { subject: '水風呂温度', value: 4.8 },
  { subject: '外気浴', value: 5 },
  { subject: '混雑耐性', value: 2 },
  { subject: 'サウナ頻度', value: 4 },
]

const profileItems = [
  { icon: '🌡️', label: '好きなサウナ温度', value: '90〜100℃' },
  { icon: '❄️', label: '好きな水風呂温度', value: '14〜17℃' },
  { icon: '🌳', label: '外気浴の好み', value: '外気浴が好き' },
  { icon: '👥', label: '混雑耐性', value: 'やや平気' },
  { icon: '📅', label: 'サウナ頻度', value: '週2〜3回' },
]

export function SaunaProfileCard({ profile }: Props) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/80">あなたのサウナプロファイル</h3>
        <button className="text-[10px] text-[#7cb342] hover:text-[#a5d63a]">編集する &rsaquo;</button>
      </div>
      <p className="text-[9px] text-white/35 mb-3">プロフィールは記録データから自動生成されています</p>

      {/* レーダーチャート */}
      <div className="h-36 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.12)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: 'rgba(232,245,224,0.45)', fontSize: 9 }}
            />
            <Radar
              name="プロファイル"
              dataKey="value"
              stroke="#7cb342"
              fill="#7cb342"
              fillOpacity={0.25}
              strokeWidth={1.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 詳細リスト */}
      <div className="space-y-1.5">
        {profileItems.map(item => (
          <div key={item.label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-white/50">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <span className="text-white/75 font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
