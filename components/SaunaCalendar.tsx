'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { GlassCard } from './GlassCard'
import type { CalendarDay } from '@/types'

interface Props {
  days: CalendarDay[]
  year?: number
  month?: number
}

const DOW = ['日', '月', '火', '水', '木', '金', '土']

export function SaunaCalendar({ days, year = 2024, month = 5 }: Props) {
  const [current, setCurrent] = useState({ year, month })

  const firstDay = new Date(current.year, current.month - 1, 1).getDay()
  const daysInMonth = new Date(current.year, current.month, 0).getDate()
  const prevMonth = () => setCurrent(c => c.month === 1 ? { year: c.year - 1, month: 12 } : { ...c, month: c.month - 1 })
  const nextMonth = () => setCurrent(c => c.month === 12 ? { year: c.year + 1, month: 1 } : { ...c, month: c.month + 1 })

  const dayMap = new Map(days.map(d => {
    const dt = new Date(d.date)
    return [dt.getDate(), d]
  }))

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/80">サウナカレンダー</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">{current.year}年{current.month}月</span>
          <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white/80">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white/80">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 mb-1">
        {DOW.map((d, i) => (
          <div key={d} className={`text-center text-[10px] py-1 font-medium
            ${i === 0 ? 'text-red-400/60' : i === 6 ? 'text-blue-400/60' : 'text-white/35'}`}>
            {d}
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const data = dayMap.get(day)
          const isToday = day === 31 && current.month === 5 && current.year === 2024
          return (
            <div key={day} className="relative flex items-center justify-center aspect-square">
              <div className={`w-7 h-7 flex items-center justify-center rounded-full text-xs transition-all
                ${data?.totonoied
                  ? 'bg-[#7cb342] text-white font-bold shadow-[0_0_8px_rgba(124,179,66,0.5)]'
                  : data?.visited
                    ? 'border border-[#7cb342]/50 text-[#a5d63a]'
                    : isToday
                      ? 'border border-white/30 text-white/80'
                      : 'text-white/45'
                }`}>
                {day}
              </div>
              {data?.totonoied && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#a5d63a]" />
              )}
              {data?.visited && !data.totonoied && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/30" />
              )}
            </div>
          )
        })}
      </div>

      {/* 凡例 */}
      <div className="flex items-center gap-4 mt-3 text-[10px] text-white/40">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#7cb342]" />
          <span>ととのった日</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full border border-[#7cb342]/50" />
          <span>サウナに行った日</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <span>未記録</span>
        </div>
      </div>
    </GlassCard>
  )
}
