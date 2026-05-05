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
import { getMonthRecords, getUserAndProfile, getAllRecordsRaw, getSaunaProfileData } from '@/lib/actions'
import { mockScoreTrend, mockCalendarDays, mockAIAnalysis, mockProfile } from '@/lib/mock-data'
import { analyzeRecords } from '@/lib/ai-analysis'
import type { SaunaRecord, SaunaProfile, CalendarDay } from '@/types'
import type { Database } from '@/types/database'

type DbRecord = Database['public']['Tables']['sauna_records']['Row']

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

function mode<T>(arr: T[]): T | null {
  if (!arr.length) return null
  const freq = new Map<T, number>()
  for (const v of arr) freq.set(v, (freq.get(v) ?? 0) + 1)
  return [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

function calcStreak(records: SaunaRecord[]): number {
  if (!records.length) return 0
  const dateSet = new Set(records.map(r => r.date))
  let streak = 0
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  while (true) {
    const s = d.toISOString().split('T')[0]
    if (!dateSet.has(s)) break
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

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
  const prevYear = month === 1 ? year - 1 : year
  const prevMonth = month === 1 ? 12 : month - 1

  const [allDbRecords, prevMonthDbRecords, { profile: profileData, displayName: fetchedDisplayName }, saunaProfileRaw] = await Promise.all([
    getAllRecordsRaw(),
    getMonthRecords(prevYear, prevMonth),
    getUserAndProfile(),
    getSaunaProfileData(),
  ])

  const profile = profileData as { display_name: string | null } | null
  const isGuest = !profile

  const allRecords = allDbRecords.map(dbToRecord)
  const hasAllData = allRecords.length > 0

  const curMonthPrefix = `${year}-${String(month).padStart(2, '0')}`
  const records = allRecords.filter(r => r.date.startsWith(curMonthPrefix))
  const hasData = records.length > 0

  // Prev month stats
  const prevVisitCount = prevMonthDbRecords.length
  const prevTotalMinutes = prevMonthDbRecords.reduce((s, r) => s + (r.total_minutes ?? 0), 0)
  const prevAvgScore = prevMonthDbRecords.length
    ? prevMonthDbRecords.reduce((s, r) => s + r.score, 0) / prevMonthDbRecords.length
    : null
  const prevAvgSets = prevMonthDbRecords.length
    ? prevMonthDbRecords.reduce((s, r) => s + r.sets, 0) / prevMonthDbRecords.length
    : null
  const prevAvgSaunaTemp = prevMonthDbRecords.length
    ? Math.round(prevMonthDbRecords.reduce((s, r) => s + r.sauna_temp, 0) / prevMonthDbRecords.length)
    : null
  const prevAvgWaterTemp = prevMonthDbRecords.length
    ? +(prevMonthDbRecords.reduce((s, r) => s + r.water_temp, 0) / prevMonthDbRecords.length).toFixed(1)
    : null
  const prevConditionScore = prevMonthDbRecords.length
    ? Math.round(prevMonthDbRecords.filter(r => r.score >= 40).length / prevMonthDbRecords.length * 100)
    : null

  // Current month stats
  const visitCount = hasData ? records.length : isGuest ? 12 : 0
  const avgScore = hasData
    ? Math.round(records.reduce((s, r) => s + r.score, 0) / records.length)
    : isGuest ? 34 : 0
  const bestScore = hasData ? Math.max(...records.map(r => r.score)) : isGuest ? 46 : 0
  const avgSets = hasData
    ? +(records.reduce((s, r) => s + r.sets, 0) / records.length).toFixed(1)
    : isGuest ? 3.1 : 0
  const avgSaunaTemp = hasData
    ? Math.round(records.reduce((s, r) => s + r.saunaTemp, 0) / records.length)
    : isGuest ? 95 : 0
  const avgWaterTemp = hasData
    ? +(records.reduce((s, r) => s + r.waterTemp, 0) / records.length).toFixed(1)
    : isGuest ? 15.3 : 0
  const totalMinutes = hasData
    ? records.reduce((s, r) => s + (r.totalMinutes ?? 0), 0)
    : isGuest ? 1104 : 0
  const streakDays = hasAllData ? calcStreak(allRecords) : isGuest ? 5 : 0

  // Diffs vs prev month
  const visitDiff = isGuest ? 3 : prevVisitCount ? visitCount - prevVisitCount : 0
  const minutesDiff = isGuest ? 255 : prevTotalMinutes ? totalMinutes - prevTotalMinutes : 0
  const scoreDiff = isGuest ? 4.1 : prevAvgScore !== null ? +(avgScore - prevAvgScore).toFixed(1) : 0
  const setsDiff = isGuest ? 0.6 : prevAvgSets !== null ? +(avgSets - prevAvgSets).toFixed(1) : null
  const saunaTempDiff = isGuest ? 1 : prevAvgSaunaTemp !== null ? avgSaunaTemp - prevAvgSaunaTemp : null
  const waterTempDiff = isGuest ? -0.4 : prevAvgWaterTemp !== null ? +(avgWaterTemp - prevAvgWaterTemp).toFixed(1) : null

  const totalH = Math.floor(totalMinutes / 60)
  const totalM = totalMinutes % 60

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

  const scoreTrend = hasAllData
    ? allRecords.slice(0, 14).reverse().map(r => ({ date: r.date, score: r.score }))
    : mockScoreTrend

  const aiAnalysis = hasAllData ? analyzeRecords(allRecords) : mockAIAnalysis

  // Condition panel (all records)
  const highScoreAll = allRecords.filter(r => r.score >= 40)
  const conditionScoreVal = hasAllData
    ? Math.round(highScoreAll.length / allRecords.length * 100)
    : isGuest ? 78 : 0
  const conditionDiff = hasAllData && prevConditionScore !== null
    ? conditionScoreVal - prevConditionScore
    : isGuest ? 8 : null

  const bestDayOfWeek = mode(highScoreAll.map(r => new Date(r.date).getDay()))
  const bestDays = bestDayOfWeek !== null
    ? [DAY_LABELS[bestDayOfWeek], DAY_LABELS[(bestDayOfWeek + 2) % 7]]
    : isGuest ? ['金', '土'] : ['土', '日']

  const allAvgSaunaTemp = hasAllData
    ? allRecords.reduce((s, r) => s + r.saunaTemp, 0) / allRecords.length
    : null
  const allAvgWaterTemp = hasAllData
    ? allRecords.reduce((s, r) => s + r.waterTemp, 0) / allRecords.length
    : null

  const condBestSaunaTemp = highScoreAll.length
    ? `${Math.round(highScoreAll.reduce((a, r) => a + r.saunaTemp, 0) / highScoreAll.length)}℃前後`
    : allAvgSaunaTemp ? `${Math.round(allAvgSaunaTemp)}℃前後` : '95℃前後'
  const condBestWaterTemp = highScoreAll.length
    ? `${Math.round(highScoreAll.reduce((a, r) => a + r.waterTemp, 0) / highScoreAll.length * 10) / 10}℃前後`
    : allAvgWaterTemp ? `${Math.round(allAvgWaterTemp * 10) / 10}℃前後` : '15℃前後'
  const outdoorCountHigh = highScoreAll.filter(r => r.restStyle === 'outdoor').length
  const condBestRest = !highScoreAll.length || outdoorCountHigh >= highScoreAll.length * 0.5
    ? '外気浴あり' : '内気浴'
  const bestConditions = hasAllData
    ? [condBestSaunaTemp, condBestWaterTemp, condBestRest]
    : ['95℃前後', '15℃前後', '外気浴あり']

  // SaunaProfile for card
  const sp = saunaProfileRaw as {
    preferred_sauna_temp?: string | null
    preferred_water_temp?: string | null
    outdoor_preference?: number
    crowd_tolerance?: number
    visit_frequency?: string | null
  } | null
  const realSaunaProfile: SaunaProfile = {
    preferredSaunaTemp: sp?.preferred_sauna_temp
      ?? (allAvgSaunaTemp ? `${Math.round(allAvgSaunaTemp)}℃前後` : '未設定'),
    preferredWaterTemp: sp?.preferred_water_temp
      ?? (allAvgWaterTemp ? `${Math.round(allAvgWaterTemp * 10) / 10}℃前後` : '未設定'),
    outdoorPreference: sp?.outdoor_preference ?? 3,
    crowdTolerance: sp?.crowd_tolerance ?? 3,
    visitFrequency: sp?.visit_frequency ?? '未設定',
  }
  const displaySaunaProfile: SaunaProfile = isGuest ? mockProfile : realSaunaProfile

  const displayName = fetchedDisplayName ?? 'ゲスト'
  const latestScore = hasData ? (records[0]?.score ?? 0) : isGuest ? 42 : 0

  return (
    <div className="p-4 lg:p-6">

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
        {isGuest && (
          <div>
            <h1 className="text-xl font-bold text-white/90">SAUNA BASE へようこそ</h1>
            <p className="text-sm text-white/45 mt-0.5">サウナ体験をデータで進化させよう。</p>
          </div>
        )}
        {!isGuest && <div />}
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
                    {
                      label: 'セット数（今月）',
                      value: `${avgSets.toFixed(1)}セット`,
                      diff: setsDiff !== null ? `先月比 ${setsDiff >= 0 ? '+' : ''}${setsDiff}↑` : null,
                      pos: setsDiff !== null ? setsDiff >= 0 : true,
                    },
                    {
                      label: 'サウナ温度',
                      value: `${avgSaunaTemp}℃`,
                      diff: saunaTempDiff !== null ? `先月比 ${saunaTempDiff >= 0 ? '+' : ''}${saunaTempDiff}℃↑` : null,
                      pos: saunaTempDiff !== null ? saunaTempDiff >= 0 : true,
                    },
                    {
                      label: '水風呂温度',
                      value: `${avgWaterTemp}℃`,
                      diff: waterTempDiff !== null ? `先月比 ${waterTempDiff >= 0 ? '+' : ''}${waterTempDiff}℃↑` : null,
                      pos: waterTempDiff !== null ? waterTempDiff <= 0 : true,
                    },
                    {
                      label: '訪問回数（今月）',
                      value: `${visitCount}回`,
                      diff: prevVisitCount || isGuest ? `先月比 ${visitDiff >= 0 ? '+' : ''}${visitDiff}↑` : null,
                      pos: visitDiff >= 0,
                    },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center text-xs">
                      <span className="text-white/40">{item.label}</span>
                      <div className="text-right">
                        <span className="text-white/75 font-medium">{item.value}</span>
                        {item.diff && (
                          <span className={`ml-1.5 text-[10px] ${item.pos ? 'text-[#a5d63a]' : 'text-red-400'}`}>{item.diff}</span>
                        )}
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
                value={visitCount}
                unit="回"
                diff={`先月比 ${visitDiff >= 0 ? '+' : ''}${visitDiff}↑`}
                diffPositive={visitDiff >= 0}
              />
              <StatCard
                icon={<Clock className="w-3.5 h-3.5" />}
                label="総滞在時間（今月）"
                value={`${totalH}h`}
                unit={`${totalM}m`}
                diff={`先月比 ${minutesDiff >= 0 ? '+' : ''}${Math.floor(Math.abs(minutesDiff)/60)}h${Math.abs(minutesDiff)%60}m${minutesDiff >= 0 ? '↑' : '↓'}`}
                diffPositive={minutesDiff >= 0}
              />
              <StatCard
                icon={<Flame className="w-3.5 h-3.5" />}
                label="連続記録日数"
                value={streakDays}
                unit="日"
                diff={streakDays > 0 ? '継続中！' : '記録してスタート'}
                diffPositive={streakDays > 0}
              />
              <StatCard
                icon={<TrendingUp className="w-3.5 h-3.5" />}
                label="平均スコア（今月）"
                value={avgScore}
                unit="点"
                diff={`先月比 ${scoreDiff >= 0 ? '+' : ''}${scoreDiff}↑`}
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
            <GlassCard className="p-4">
              <h3 className="text-sm font-semibold text-white/80 mb-3">今月の統計</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '訪問回数', value: `${visitCount}回`, diff: prevVisitCount || isGuest ? `先月比 ${visitDiff >= 0 ? '+' : ''}${visitDiff}↑` : null, pos: visitDiff >= 0 },
                  { label: '平均スコア', value: `${avgScore}点`, diff: `先月比 ${scoreDiff >= 0 ? '+' : ''}${scoreDiff}↑`, pos: scoreDiff >= 0 },
                  { label: 'ベストスコア', value: `${bestScore}点`, diff: null },
                  { label: '平均セット数', value: `${avgSets.toFixed(1)}セット`, diff: setsDiff !== null ? `先月比 ${setsDiff >= 0 ? '+' : ''}${setsDiff}↑` : null, pos: setsDiff !== null ? setsDiff >= 0 : true },
                  { label: '平均サウナ温度', value: `${avgSaunaTemp}℃`, diff: saunaTempDiff !== null ? `先月比 ${saunaTempDiff >= 0 ? '+' : ''}${saunaTempDiff}℃↑` : null, pos: saunaTempDiff !== null ? saunaTempDiff >= 0 : true },
                  { label: '平均水風呂温度', value: `${avgWaterTemp}℃`, diff: waterTempDiff !== null ? `先月比 ${waterTempDiff >= 0 ? '+' : ''}${waterTempDiff}℃↑` : null, pos: waterTempDiff !== null ? waterTempDiff <= 0 : true },
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
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - conditionScoreVal / 100)}`}
                        style={{ filter: 'drop-shadow(0 0 4px rgba(124,179,66,0.5))' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-[#a5d63a]">{conditionScoreVal}%</span>
                    </div>
                  </div>
                </div>
                {conditionDiff !== null && (
                  <p className={`text-[10px] text-center ${conditionDiff >= 0 ? 'text-[#a5d63a]' : 'text-red-400'}`}>
                    先月比 {conditionDiff >= 0 ? '+' : ''}{conditionDiff}%{conditionDiff >= 0 ? '↑' : '↓'}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-[9px] text-white/40">ととのいやすい曜日</p>
                  <div className="flex gap-1 mt-0.5">
                    {bestDays.map(d => (
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
                    {bestConditions.map(c => (
                      <span key={c} className="text-[9px] px-1.5 py-0.5 rounded-md text-white/50"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] text-white/40">分析対象の記録数</p>
                  <p className="text-xs text-white/60 mt-0.5">{allRecords.length}件 / 高スコア {highScoreAll.length}件</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <AIRecommendCard analysis={aiAnalysis} />
          <SaunaProfileCard profile={displaySaunaProfile} />
        </div>
      </div>

      {/* スマホ用 右パネルコンテンツ */}
      <div className="lg:hidden mt-4 space-y-4">
        <AIRecommendCard analysis={aiAnalysis} />
        <SaunaProfileCard profile={displaySaunaProfile} />
      </div>
    </div>
  )
}
