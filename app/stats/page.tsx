import { GlassCard } from '@/components/GlassCard'
import { ScoreTrendChart } from '@/components/ScoreTrendChart'
import { SaunaRecordCard } from '@/components/SaunaRecordCard'
import { mockRecords, mockMonthlyStats, mockScoreTrend } from '@/lib/mock-data'

export default function StatsPage() {
  const s = mockMonthlyStats
  const totalH = Math.floor(s.totalMinutes / 60)
  const totalM = s.totalMinutes % 60

  const statItems = [
    { label: '平均スコア', value: `${s.avgScore}点`, diff: '+4.1', pos: true },
    { label: 'ベストスコア', value: `${s.bestScore}点`, diff: `更新日 5/12` },
    { label: '平均セット数', value: `${s.avgSets.toFixed(1)}セット`, diff: '+0.6', pos: true },
    { label: 'サウナ回数', value: `${s.visitCount}回`, diff: '+3', pos: true },
    { label: '総滞在時間', value: `${totalH}h${totalM}m`, diff: '+2h15m', pos: true },
    { label: '連続記録日数', value: `${s.streakDays}日`, diff: 'ベスト更新中！', pos: true },
    { label: '平均サウナ温度', value: `${s.avgSaunaTemp}℃`, diff: '+1.3℃', pos: true },
    { label: '平均水風呂温度', value: `${s.avgWaterTemp}℃`, diff: '-0.4℃', pos: false },
    { label: '平均休憩時間', value: `${s.avgRestMinutes}分`, diff: '+1.2分', pos: true },
  ]

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white/90">統計</h1>
        <p className="text-sm text-white/45 mt-0.5">あなたのサウナデータを分析します。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 今月の統計 */}
        <GlassCard className="p-4">
          <h2 className="text-sm font-semibold text-white/80 mb-3">{s.month}の統計</h2>
          <div className="grid grid-cols-3 gap-2">
            {statItems.map(item => (
              <div key={item.label} className="glass rounded-xl p-2.5 text-center">
                <p className="text-[9px] text-white/40 mb-0.5">{item.label}</p>
                <p className="text-sm font-bold text-white/85">{item.value}</p>
                {item.diff && (
                  <p className={`text-[9px] mt-0.5 ${item.pos ? 'text-[#a5d63a]' : 'text-red-400'}`}>
                    {item.diff}
                  </p>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* スコア推移 */}
        <ScoreTrendChart data={mockScoreTrend} />

        {/* 全記録 */}
        <div className="lg:col-span-2">
          <SaunaRecordCard records={mockRecords} showAll />
        </div>
      </div>
    </div>
  )
}
