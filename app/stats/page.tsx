import { GlassCard } from '@/components/GlassCard'
import { ScoreTrendChart } from '@/components/ScoreTrendChart'
import { SaunaRecordCard } from '@/components/SaunaRecordCard'
import { getAllRecordsRaw } from '@/lib/actions'
import { getRestStyleLabel } from '@/lib/score'
import type { SaunaRecord, ScoreTrendPoint } from '@/types'
import type { RestStyle, BodyCondition } from '@/types'

function calcStreak(dates: string[]): number {
  if (!dates.length) return 0
  const sorted = [...new Set(dates)].sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  let streak = 0
  let cur = today
  for (const d of sorted) {
    if (d === cur) {
      streak++
      const prev = new Date(cur)
      prev.setDate(prev.getDate() - 1)
      cur = prev.toISOString().slice(0, 10)
    } else break
  }
  return streak
}

export default async function StatsPage() {
  const raw = await getAllRecordsRaw()

  if (raw.length === 0) {
    return (
      <div className="p-4 lg:p-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-white/90">統計</h1>
          <p className="text-sm text-white/45 mt-0.5">あなたのサウナデータを分析します。</p>
        </div>
        <GlassCard className="p-8 text-center">
          <p className="text-white/50 text-sm mb-1">まだ記録がありません</p>
          <p className="text-white/30 text-xs">記録を追加すると統計が表示されます。</p>
        </GlassCard>
      </div>
    )
  }

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const monthStr = `${year}年${month}月`

  const monthRecords = raw.filter(r => {
    const [y, m] = r.date.split('-').map(Number)
    return y === year && m === month
  })

  const scored = monthRecords.filter(r => r.score != null)
  const avgScore = scored.length
    ? Math.round(scored.reduce((a, r) => a + (r.score ?? 0), 0) / scored.length * 10) / 10
    : 0
  const bestScore = scored.length ? Math.max(...scored.map(r => r.score ?? 0)) : 0
  const bestDate = scored.length
    ? scored.reduce((a, r) => ((r.score ?? 0) > (a.score ?? 0) ? r : a)).date.slice(5).replace('-', '/')
    : '-'
  const visitCount = monthRecords.length
  const totalMinutes = monthRecords.reduce((a, r) => a + (r.total_minutes ?? 0), 0)
  const totalH = Math.floor(totalMinutes / 60)
  const totalM = totalMinutes % 60
  const avgSets = monthRecords.length
    ? Math.round(monthRecords.reduce((a, r) => a + r.sets, 0) / monthRecords.length * 10) / 10
    : 0
  const avgSaunaTemp = monthRecords.length
    ? Math.round(monthRecords.reduce((a, r) => a + r.sauna_temp, 0) / monthRecords.length * 10) / 10
    : 0
  const avgWaterTemp = monthRecords.length
    ? Math.round(monthRecords.reduce((a, r) => a + r.water_temp, 0) / monthRecords.length * 10) / 10
    : 0
  const streakDays = calcStreak(raw.map(r => r.date))

  const statItems = [
    { label: '平均スコア',    value: `${avgScore}点` },
    { label: 'ベストスコア',  value: `${bestScore}点`, sub: `更新日 ${bestDate}` },
    { label: '平均セット数',  value: `${avgSets}セット` },
    { label: 'サウナ回数',    value: `${visitCount}回` },
    { label: '総滞在時間',    value: `${totalH}h${totalM}m` },
    { label: '連続記録',      value: `${streakDays}日` },
    { label: '平均サウナ温度', value: `${avgSaunaTemp}℃` },
    { label: '平均水風呂温度', value: `${avgWaterTemp}℃` },
    { label: '記録総数',      value: `${raw.length}回` },
  ]

  const trend: ScoreTrendPoint[] = raw.slice(0, 14).reverse().map(r => ({
    date: r.date.slice(5).replace('-', '/'),
    score: r.score ?? 0,
  }))

  const records: SaunaRecord[] = raw.slice(0, 20).map(r => ({
    id: r.id,
    date: r.date.replace(/-/g, '/'),
    facilityName: r.facility_name,
    sets: r.sets,
    saunaTemp: r.sauna_temp,
    waterTemp: r.water_temp,
    restStyle: r.rest_style as RestStyle,
    subjectiveRating: r.subjective_rating as 1|2|3|4|5,
    bodyCondition: r.body_condition as BodyCondition,
    totalMinutes: r.total_minutes ?? undefined,
    notes: r.notes ?? undefined,
    score: r.score ?? 0,
  }))

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white/90">統計</h1>
        <p className="text-sm text-white/45 mt-0.5">あなたのサウナデータを分析します。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-4">
          <h2 className="text-sm font-semibold text-white/80 mb-3">{monthStr}の統計</h2>
          {monthRecords.length === 0 ? (
            <p className="text-xs text-white/40 text-center py-4">今月はまだ記録がありません</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {statItems.map(item => (
                <div key={item.label} className="glass rounded-xl p-2.5 text-center">
                  <p className="text-[9px] text-white/40 mb-0.5">{item.label}</p>
                  <p className="text-sm font-bold text-white/85">{item.value}</p>
                  {item.sub && <p className="text-[9px] mt-0.5 text-white/35">{item.sub}</p>}
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <ScoreTrendChart data={trend} />

        <div className="lg:col-span-2">
          <SaunaRecordCard records={records} showAll />
        </div>
      </div>
    </div>
  )
}
