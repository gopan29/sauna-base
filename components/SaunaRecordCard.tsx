import Link from 'next/link'
import { GlassCard } from './GlassCard'
import { getScoreColor, getRestStyleLabel } from '@/lib/score'
import type { SaunaRecord } from '@/types'

interface Props {
  records: SaunaRecord[]
  showAll?: boolean
}

function MiniRecord({ r }: { r: SaunaRecord }) {
  const color = getScoreColor(r.score)
  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/6 last:border-0">
      <div className="text-center min-w-[36px]">
        <p className="text-lg font-bold" style={{ color }}>{r.score}</p>
        <p className="text-[9px] text-white/35">点</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white/80 truncate">{r.facilityName}</p>
        <p className="text-[10px] text-white/40">{r.date}（{['月','火','水','木','金','土','日'][new Date(r.date.replace(/\//g,'-')).getDay()]}）</p>
      </div>
    </div>
  )
}

export function SaunaRecordCard({ records, showAll }: Props) {
  const latest = records[0]
  const rest = records.slice(1, showAll ? undefined : 3)

  if (!latest) return null

  const color = getScoreColor(latest.score)

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/80">最新のサウナ記録</h3>
        <Link href="/stats" className="text-[10px] text-[#7cb342] hover:text-[#a5d63a]">すべて見る &rsaquo;</Link>
      </div>

      {/* 最新記録 */}
      <div className="flex gap-3 mb-3">
        {latest.imageUrl && (
          <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
            <img src={latest.imageUrl} alt={latest.facilityName} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-white/40">{latest.date}（{['月','火','水','木','金','土','日'][new Date(latest.date.replace(/\//g,'-')).getDay()]}）</p>
          <p className="text-sm font-semibold text-white/90 truncate">{latest.facilityName}</p>
          <p className="text-[10px] text-white/45 truncate">東京都・奥多摩</p>
        </div>
      </div>

      {/* スコア詳細 */}
      <div className="grid grid-cols-4 gap-1 mb-3">
        {[
          { label: 'スコア', value: `${latest.score}/50`, color },
          { label: 'セット数', value: `${latest.sets}セット` },
          { label: 'サウナ', value: `${latest.saunaTemp}℃` },
          { label: '水風呂', value: `${latest.waterTemp}℃` },
        ].map(item => (
          <div key={item.label} className="glass rounded-lg p-1.5 text-center">
            <p className="text-[9px] text-white/40">{item.label}</p>
            <p className="text-xs font-bold" style={item.color ? { color: item.color } : { color: '#e8f5e0' }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-center text-white/40 mb-3">
        休憩：{getRestStyleLabel(latest.restStyle)}
      </div>

      {/* 過去記録 */}
      <div>
        {rest.map(r => <MiniRecord key={r.id} r={r} />)}
      </div>
    </GlassCard>
  )
}
