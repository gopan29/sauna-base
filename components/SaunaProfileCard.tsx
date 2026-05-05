'use client'

import React from 'react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer
} from 'recharts'
import { Thermometer, Droplets, Leaf, Users, CalendarDays } from 'lucide-react'
import { GlassCard } from './GlassCard'
import type { SaunaProfile } from '@/types'

interface Props {
  profile: SaunaProfile
  radarValues?: number[]
}

function outdoorLabel(v: number) {
  if (v >= 5) return '外気浴が大好き'
  if (v >= 4) return '外気浴が好き'
  if (v >= 3) return 'どちらでも'
  if (v >= 2) return 'やや苦手'
  return '特にこだわらない'
}

function crowdLabel(v: number) {
  if (v >= 5) return '気にしない'
  if (v >= 4) return 'やや平気'
  if (v >= 3) return 'どちらでも'
  if (v >= 2) return 'やや気になる'
  return '空いている時が好き'
}

export function SaunaProfileCard({ profile, radarValues }: Props) {
  const rv = radarValues ?? [3.5, 3.5, profile.outdoorPreference, profile.crowdTolerance, 3]

  const radarData = [
    { subject: 'サウナ温度', value: rv[0] },
    { subject: '水風呂温度', value: rv[1] },
    { subject: '外気浴',     value: rv[2] },
    { subject: '混雑耐性',   value: rv[3] },
    { subject: 'サウナ頻度', value: rv[4] },
  ]

  const profileItems = [
    { icon: Thermometer,   label: '好きなサウナ温度', value: profile.preferredSaunaTemp || '未設定' },
    { icon: Droplets,      label: '好きな水風呂温度', value: profile.preferredWaterTemp || '未設定' },
    { icon: Leaf,          label: '外気浴の好み',     value: outdoorLabel(profile.outdoorPreference) },
    { icon: Users,         label: '混雑耐性',         value: crowdLabel(profile.crowdTolerance) },
    { icon: CalendarDays,  label: 'サウナ頻度',       value: profile.visitFrequency || '未設定' },
  ]

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/80">あなたのサウナプロファイル</h3>
      </div>
      <p className="text-[9px] text-white/35 mb-3">プロフィールは記録データから自動生成されています</p>

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

      <div className="space-y-1.5">
        {profileItems.map(item => (
          <div key={item.label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-white/50">
              <item.icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </div>
            <span className="text-white/75 font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
