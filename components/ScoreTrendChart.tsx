'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Label
} from 'recharts'
import type { ScoreTrendPoint } from '@/types'
import { GlassCard } from './GlassCard'

interface Props {
  data: ScoreTrendPoint[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-2.5 py-2 text-xs">
      <p className="text-white/50">{label}</p>
      <p className="font-bold text-[#a5d63a]">{payload[0].value}点</p>
    </div>
  )
}

export function ScoreTrendChart({ data }: Props) {
  const max = Math.max(...data.map(d => d.score))
  const maxPoint = data.find(d => d.score === max)

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/80">スコア推移</h3>
        <p className="text-[10px] text-white/40">（5月）</p>
      </div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'rgba(232,245,224,0.35)', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 50]}
              tick={{ fill: 'rgba(232,245,224,0.35)', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              ticks={[0, 25, 50]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#7cb342"
              strokeWidth={2}
              dot={{ fill: '#7cb342', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#a5d63a', strokeWidth: 0 }}
            />
            {maxPoint && (
              <ReferenceLine
                x={maxPoint.date}
                stroke="rgba(245,158,11,0.3)"
                strokeDasharray="3 3"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}
