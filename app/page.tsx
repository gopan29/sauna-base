import Link from 'next/link'
import { Cloud, Bell, TrendingUp, Clock, Flame, BarChart2, Shield, Leaf } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'
import { ScoreCircle } from '@/components/ScoreCircle'
import { StatCard } from '@/components/StatCard'
import { SaunaCalendar } from '@/components/SaunaCalendar'
import { SaunaRecordCard } from '@/components/SaunaRecordCard'
import { ScoreTrendChart } from '@/components/ScoreTrendChart'
import { AIRecommendCard } from '@/components/AIRecommendCard'
import { SaunaProfileCard } from '@/components/SaunaProfileCard'
import { getMonthRecords, getUserAndProfile } from '@/lib/actions'
import {
  mockMonthlyStats,
  mockScoreTrend,
  mockCalendarDays,
  mockAIAnalysis,
  mockProfile,
} from '@/lib/mock-data'
import { analyzeRecords } from '@/lib/ai-analysis'
import type { SaunaRecord, CalendarDay } from '@/types'
import type { Database } from '@/types/database'

type DbRecord = Database['public']['Tables']['sauna_records']['Row']

function dbToRecord(r: DbRecord): SaunaRecord {
  return {
    id: r.id,
    date: r.date,
    facilityName: r.facility_name,
    memo: r.memo ?? undefined,
    sets: r.sets,
    saunaTemp: r.sauna_temp,
    waterTemp: r.water_temp,
    restStyle: r.rest_style,
    subjectiveRating: r.subjective_rating as 1|2|3|4|5,
    bodyCondition: r.body_condition,
    totalMinutes: r.total_minutes ?? undefined,
    notes: r.notes ?? undefined,
    score: r.score,
  }
}

export default async function DashboardPage() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const [dbRecords, { profile: profileData, displayName: fetchedDisplayName }] = await Promise.all([
    getMonthRecords(year, month),
    getUserAndProfile(),
  ])
  const profile = profileData as { display_name: string | null } | null
  const isGuest = !profile

  const records = dbRecords.map(dbToRecord)
  const hasData = records.length > 0

  const visitCount = hasData ? records.length : mockMonthlyStats.visitCount
  const avgScore = hasData
    ? Math.round(records.reduce((s, r) => s + r.score, 0) / records.length)
    : mockMonthlyStats.avgScore
  const bestScore = hasData
    ? Math.max(...records.map(r => r.score))
    : mockMonthlyStats.bestScore
  const avgSets = hasData
    ? +(records.reduce((s, r) => s + r.sets, 0) / records.length).toFixed(1)
    : mockMonthlyStats.avgSets
  const avgSaunaTemp = hasData
    ? Math.round(records.reduce((s, r) => s + r.saunaTemp, 0) / records.length)
    : mockMonthlyStats.avgSaunaTemp
  const avgWaterTemp = hasData
    ? +(records.reduce((s, r) => s + r.waterTemp, 0) / records.length).toFixed(1)
    : mockMonthlyStats.avgWaterTemp
  const totalMinutes = hasData
    ? records.reduce((s, r) => s + (r.totalMinutes ?? 0), 0)
    : mockMonthlyStats.totalMinutes

  const stats = {
    visitCount,
    avgScore,
    bestScore,
    avgSets,
    avgSaunaTemp,
    avgWaterTemp,
    totalMinutes,
    avgRestMinutes: mockMonthlyStats.avgRestMinutes,
    streakDays: mockMonthlyStats.streakDays,
    prevMonthVisitCount: mockMonthlyStats.prevMonthVisitCount,
    prevMonthTotalMinutes: mockMonthlyStats.prevMonthTotalMinutes,
    prevMonthAvgScore: mockMonthlyStats.prevMonthAvgScore,
  }

  const calendarDays: CalendarDay[] = hasData
    ? Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => {
        const d = String(i + 1).padStart(2, '0')
        const dayStr = `${year}-${String(month).padStart(2, '0')}-${d}`
        const dayRecords = records.filter(r => r.date === dayStr)
        return {
          date: dayStr,
          visited: dayRecords.length > 0,
          score: dayRecords.length > 0 ? Math.max(...dayRecords.map(r => r.score)) : undefined,
          totonoied: dayRecords.some(r => r.score >= 40),
        }
      })
    : mockCalendarDays

  const scoreTrend = hasData
    ? records.slice(-14).map(r => ({ date: r.date, score: r.score }))
    : mockScoreTrend

  const aiAnalysis = hasData ? analyzeRecords(records) : mockAIAnalysis

  const displayName = fetchedDisplayName ?? 'ゲスト'
  const latestScore = hasData ? records[0]?.score ?? 0 : 42
  const visitDiff = stats.prevMonthVisitCount
    ? stats.visitCount - stats.prevMonthVisitCount
    : 0
  const minutesDiff = stats.prevMonthTotalMinutes
    ? stats.totalMinutes - stats.prevMonthTotalMinutes
    : 0
  const scoreDiff = stats.prevMonthAvgScore
    ? +(stats.avgScore - stats.prevMonthAvgScore).toFixed(1)
    : 0

  const totalH = Math.floor(stats.totalMinutes / 60)
  const totalM = stats.totalMinutes % 60

  return (
    <div className="p-4 lg:p-6">

      {/* 管理画面ショートカット */}
      <div className="flex justify-end mb-3">
        <Link href="/admin"
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-white/45 hover:text-white/70 transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Shield className="w-3.5 h-3.5" />
          <span>管理画面</span>
        </Link>
      </div>

      {/* ゲストバナー */}
      {isGuest && (
        <div className="glass rounded-xl p-3 flex items-center gap-3 mb-5"
          style={{ border: '1px solid rgba(124,179,66,0.25)' }}>
          <Leaf className="w-5 h-5 shrink-0 text-[#7cb342]" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white/80">ログインして自分のサウナ記録を管理しよう</p>
            <p className="text-[10px] text-white/40 mt-0.5">今はサンプルデータを表示しています</p>
          </div>
          <Link href="/login"
            className="shrink-0 text-xs px-3 py-1.5 rounded-lg font-semibold"
            style={{
              background: 'rgba(124,179,66,0.2)',
              border: '1px solid rgba(124,179,66,0.4)',
              color: '#a5d63a',
            }}>
            登録無料
          </Link>
        </div>
      )}

      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-white/90">
            {isGuest ? 'SAUNA BASE へようこそ' : `おはようございます、${displayName}さん`}
          </h1>
          <p className="text-sm text-white/45 mt-0.5">
            {isGuest ? 'サウナ体験をデータで進化させよう。' : '今日も最高のととのいを記録しましょう。'}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 glass rounded-xl px-3 py-1.5 text-xs text-white/60">
            <Cloud className="w-3.5 h-3.5" />
            <span>23℃ 東京都 渋谷区 晴れ</span>
          </div>
          <Link href="/admin"
            className="glass flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-white/50 hover:text-white/75 transition-colors">
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">管理画面</span>
          </Link>
          <button className="glass w-8 h-8 rounded-full flex items-center justify-center relative">
            <Bell className="w-4 h-4 text-white/60" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#a5d63a]" />
          </button>
        </div>
      </div>

      {/* メインレイアウト */}
      <div className="lg:grid lg:gap-4" style={{ gridTemplateColumns: '1fr 288px' }}>

        {/* 左・メインエリア */}
        <div className="space-y-4">

          {/* Row 1: スコアカード + 統計 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ととのいスコアカード */}
            <GlassCard className="p-5 sm:col-span-1">
              <p className="text-xs font-medium text-white/50 mb-3">今日のととのいスコア</p>
              <div className="flex items-center gap-6">
                <ScoreCircle
                  score={latestScore}
                  size="lg"
                  bestScore={bestScore}
                />
                <div className="flex-1 space-y-1.5">
                  {[
                    { label: 'セット数（今月）', value: `${stats.avgSets.toFixed(1)}セット`, diff: '先月比 +0.6↑', pos: true },
                    { label: 'サウナ温度', value: `${stats.avgSaunaTemp}℃`, diff: '先月比 +1.3℃↑', pos: true },
                    { label: '水風呂温度', value: `${stats.avgWaterTemp}℃`, diff: '先月比 -0.4℃↓', pos: false },
                    { label: '平均休憩時間', value: `${stats.avgRestMinutes}分`, diff: '先月比 +1.2分↑', pos: true },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center text-xs">
                      <span className="text-white/40">{item.label}</span>
                      <div className="text-right">
                        <span className="text-white/75 font-medium">{item.value}</span>
                        <span className={`ml-1.5 text-[10px] ${item.pos ? 'text-[#a5d63a]' : 'text-red-400'}`}>{item.diff}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* 統計カード群 */}
            <div className="grid grid-cols-2 gap-2">
              <StatCard
                icon={<BarChart2 className="w-3.5 h-3.5" />}
                label="サウナ回数（今月）"
                value={stats.visitCount}
                unit="回"
                diff={`先月比 +${visitDiff}↑`}
                diffPositive={visitDiff >= 0}
              />
              <StatCard
                icon={<Clock className="w-3.5 h-3.5" />}
                label="総滞在時間（今月）"
                value={`${totalH}h`}
                unit={`${totalM}m`}
                diff={`先月比 +${Math.floor(minutesDiff/60)}h${minutesDiff%60}m↑`}
                diffPositive={minutesDiff >= 0}
              />
              <StatCard
                icon={<Flame className="w-3.5 h-3.5" />}
                label="連続記録日数"
                value={stats.streakDays}
                unit="日"
                diff="自己ベスト更新中！"
                diffPositive
              />
              <StatCard
                icon={<TrendingUp className="w-3.5 h-3.5" />}
                label="平均スコア（今月）"
                value={stats.avgScore}
                unit="点"
                diff={`先月比 +${scoreDiff}↑`}
                diffPositive={scoreDiff >= 0}
              />
            </div>
          </div>

          {/* Row 2: カレンダー + 最新記録 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SaunaCalendar days={calendarDays} year={year} month={month} />
            <SaunaRecordCard records={records.slice(0, 5)} />
          </div>

          {/* Row 3: 今月の統計 + スコア推移 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 今月の統計 */}
            <GlassCard className="p-4">
              <h3 className="text-sm font-semibold text-white/80 mb-3">今月の統計</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '平均スコア', value: `${stats.avgScore}点`, diff: `先月比 +${scoreDiff}↑`, pos: true },
                  { label: 'ベストスコア', value: `${stats.bestScore}点`, diff: '更新日 5/12' },
                  { label: '平均セット数', value: `${stats.avgSets.toFixed(1)}セット`, diff: '先月比 +0.6↑', pos: true },
                  { label: '平均サウナ温度', value: `${stats.avgSaunaTemp}℃`, diff: '先月比 +1.3℃↑', pos: true },
                  { label: '平均水風呂温度', value: `${stats.avgWaterTemp}℃`, diff: '先月比 -0.4℃↓', pos: false },
                  { label: '平均休憩時間', value: `${stats.avgRestMinutes}分`, diff: '先月比 +1.2分↑', pos: true },
                ].map(item => (
                  <div key={item.label} className="glass rounded-xl p-2 text-center">
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

            <ScoreTrendChart data={scoreTrend} />
          </div>
        </div>

        {/* 右パネル（PC）*/}
        <div className="hidden lg:flex flex-col gap-4 mt-0">
          {/* コンディション */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white/80">あなたのコンディション</h3>
              <button className="text-[10px] text-[#7cb342]">詳細を見る &rsaquo;</button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[10px] text-white/40 mb-1">ととのいやすさ指数</p>
                <div className="flex items-center justify-center">
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#7cb342" strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.78)}`}
                        style={{ filter: 'drop-shadow(0 0 4px rgba(124,179,66,0.5))' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-[#a5d63a]">78%</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-[#a5d63a] text-center">先月比 +8%↑</p>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-[9px] text-white/40">ベストコンディション時間帯</p>
                  <p className="text-xs font-medium text-white/75">15:00 - 18:00</p>
                </div>
                <div>
                  <p className="text-[9px] text-white/40">ととのいやすい曜日</p>
                  <div className="flex gap-1 mt-0.5">
                    {['金', '土', '日'].map(d => (
                      <span key={d} className="text-[10px] px-1.5 py-0.5 rounded-md text-[#a5d63a]"
                        style={{ background: 'rgba(124,179,66,0.15)', border: '1px solid rgba(124,179,66,0.3)' }}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] text-white/40">ベストなサウナ条件</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {['95℃前後', '15℃前後', '外気浴あり'].map(c => (
                      <span key={c} className="text-[9px] px-1.5 py-0.5 rounded-md text-white/50"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <AIRecommendCard analysis={aiAnalysis} />
          <SaunaProfileCard profile={mockProfile} />
        </div>
      </div>

      {/* スマホ用 右パネルコンテンツ */}
      <div className="lg:hidden mt-4 space-y-4">
        <AIRecommendCard analysis={aiAnalysis} />
        <SaunaProfileCard profile={mockProfile} />
      </div>
    </div>
  )
}
