import { SaunaProfileCard } from '@/components/SaunaProfileCard'
import { GlassCard } from '@/components/GlassCard'
import { getSaunaProfileData, getAllRecordsRaw } from '@/lib/actions'
import { adjustmentMessages } from '@/lib/sauna-base/scoreAdjustments'
import { buildProfile } from '@/lib/sauna-base/profileRecommendations'
import { TotonoiResultCard } from '@/components/sauna-base/totonoi/TotonoiResultCard'
import type { SaunaProfile } from '@/types'
import type { Heat, Water, Mind, Style } from '@/types/sauna-base'

function tempToRadar(avgTemp: number | null): number {
  if (!avgTemp) return 3
  if (avgTemp >= 100) return 5
  if (avgTemp >= 95) return 4
  if (avgTemp >= 88) return 3
  if (avgTemp >= 80) return 2
  return 1
}

function waterTempToRadar(avgTemp: number | null): number {
  if (!avgTemp) return 3
  if (avgTemp <= 14) return 5
  if (avgTemp <= 16) return 4
  if (avgTemp <= 18) return 3
  if (avgTemp <= 20) return 2
  return 1
}

function freqToRadar(freq: string | null): number {
  if (!freq) return 2
  if (freq.includes('4回') || freq.includes('毎日')) return 5
  if (freq.includes('2〜3') || freq.includes('2-3')) return 4
  if (freq.includes('1〜2') || freq.includes('1-2')) return 3
  if (freq.includes('週1')) return 2
  return 1
}

export default async function ProfilePage() {
  const [saunaProfile, records] = await Promise.all([
    getSaunaProfileData(),
    getAllRecordsRaw(),
  ])

  const hasRecords = records.length > 0
  const avgSaunaTemp = hasRecords
    ? records.reduce((a, r) => a + r.sauna_temp, 0) / records.length
    : null
  const avgWaterTemp = hasRecords
    ? records.reduce((a, r) => a + r.water_temp, 0) / records.length
    : null

  const profile: SaunaProfile = {
    preferredSaunaTemp: saunaProfile?.preferred_sauna_temp
      ?? (avgSaunaTemp ? `${Math.round(avgSaunaTemp)}℃前後` : '未設定'),
    preferredWaterTemp: saunaProfile?.preferred_water_temp
      ?? (avgWaterTemp ? `${Math.round(avgWaterTemp)}℃前後` : '未設定'),
    outdoorPreference: saunaProfile?.outdoor_preference ?? 3,
    crowdTolerance: saunaProfile?.crowd_tolerance ?? 3,
    visitFrequency: saunaProfile?.visit_frequency ?? '未設定',
  }

  const radarValues = [
    tempToRadar(avgSaunaTemp),
    waterTempToRadar(avgWaterTemp),
    profile.outdoorPreference,
    profile.crowdTolerance,
    freqToRadar(profile.visitFrequency),
  ]

  const rawCode = (saunaProfile as { totonoi_code?: string | null } | null)?.totonoi_code ?? null
  const totonoiProfile = rawCode && rawCode.length === 4 ? (() => {
    const [h, w, m, s] = rawCode.split('')
    try { return buildProfile(h as Heat, w as Water, m as Mind, s as Style) } catch { return null }
  })() : null
  const adjustmentMsg = totonoiProfile ? adjustmentMessages[totonoiProfile.typeName] ?? null : null

  return (
    <div className="p-4 lg:p-6 max-w-lg">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white/90">サウナプロファイル</h1>
        <p className="text-sm text-white/45 mt-0.5">あなたの好みを登録するとAI分析の精度が上がります。</p>
      </div>

      {/* TOTONOI CODE カード */}
      {totonoiProfile ? (
        <div className="mb-4">
          <TotonoiResultCard profile={totonoiProfile} variant="compact" />
          {adjustmentMsg && (
            <p className="text-[10px] text-white/40 mt-2 leading-relaxed px-1">{adjustmentMsg}</p>
          )}
        </div>
      ) : (
        <GlassCard className="p-3 mb-4"
          style={{ background: 'rgba(124,179,66,0.07)', border: '1px solid rgba(124,179,66,0.2)' }}>
          <p className="text-xs text-[#a5d63a]/70 leading-relaxed">
            診断タブから「サウナー診断」を受けると、あなただけの TOTONOI CODE が発行されます。
          </p>
        </GlassCard>
      )}

      <SaunaProfileCard profile={profile} radarValues={radarValues} />

      {hasRecords && (
        <p className="text-[10px] text-white/25 mt-3 text-center">
          {records.length}件の記録データから自動生成しています
        </p>
      )}
    </div>
  )
}
