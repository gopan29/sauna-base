import type { TotonoiProfile } from '@/types/sauna-base'
import { heatLabel, waterLabel, mindLabel, styleLabel } from '@/lib/sauna-base/profileRecommendations'
import { Thermometer, Droplets, Wind, BarChart2 } from 'lucide-react'

const axisLabels = [
  { key: 'heat' as const,  icon: Thermometer, color: '#f97316', label: 'HEAT' },
  { key: 'water' as const, icon: Droplets,    color: '#38bdf8', label: 'WATER' },
  { key: 'mind' as const,  icon: Wind,        color: '#a5d63a', label: 'MIND' },
  { key: 'style' as const, icon: BarChart2,   color: '#c084fc', label: 'STYLE' },
]

const labelMap = {
  heat:  heatLabel,
  water: waterLabel,
  mind:  mindLabel,
  style: styleLabel,
}

export function DiagnosisResult({
  profile,
  onContinue,
}: {
  profile: TotonoiProfile
  onContinue: () => void
}) {
  const letters = profile.code.split('')

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-sm space-y-4">

        {/* コードカード */}
        <div
          className="rounded-3xl p-6 text-center"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          <p className="text-[10px] tracking-[0.3em] uppercase mb-3 text-[#1a2a10]/40 lg:text-white/38">
            Your TOTONOI CODE
          </p>

          {/* 4文字コード */}
          <div className="flex justify-center gap-2 mb-4">
            {letters.map((letter, i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(165,214,58,0.12)',
                  border: '1px solid rgba(165,214,58,0.35)',
                  boxShadow: '0 0 16px rgba(165,214,58,0.2)',
                }}
              >
                <span className="text-2xl font-bold" style={{ color: '#a5d63a' }}>{letter}</span>
              </div>
            ))}
          </div>

          {/* タイプ名 */}
          <div
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{
              background: 'rgba(165,214,58,0.15)',
              border: '1px solid rgba(165,214,58,0.3)',
              color: '#4d8a28',
              letterSpacing: '0.05em',
            }}
          >
            TYPE : {profile.typeName}
          </div>

          {/* 説明 */}
          <p className="text-xs leading-relaxed text-left text-[#1a2a10]/65 lg:text-white/62">
            {profile.description}
          </p>
        </div>

        {/* 軸詳細カード */}
        <div
          className="rounded-3xl p-5"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          <div className="space-y-3">
            {axisLabels.map(({ key, icon: Icon, color, label }) => (
              <div key={key} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}18`, border: `1px solid ${color}35` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold tracking-widest mr-2" style={{ color: `${color}cc` }}>
                    {label}
                  </span>
                  <span className="text-xs font-semibold text-[#1a2a10]/80 lg:text-white/82">
                    {profile[key]} — {(labelMap[key] as Record<string, string>)[profile[key]]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* おすすめ設定カード */}
        <div
          className="rounded-3xl p-5"
          style={{
            background: 'rgba(165,214,58,0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(165,214,58,0.18)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          <p className="text-xs font-bold mb-3 text-[#4d8a28]">おすすめ初期設定</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'サウナ温度',   value: profile.recommendedSaunaTemp },
              { label: '水風呂温度',   value: profile.recommendedWaterTemp },
              { label: '推奨セット数', value: profile.recommendedSets },
              { label: '休憩スタイル', value: profile.recommendedRestStyle },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl p-2.5"
                style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.06)' }}
              >
                <p className="text-[9px] mb-0.5 text-[#1a2a10]/45 lg:text-white/38">{label}</p>
                <p className="text-xs font-semibold text-[#1a2a10]/85 lg:text-white/85">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ボタン */}
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.97]"
          style={{
            background: 'linear-gradient(135deg, #a5d63a 0%, #5a9e28 100%)',
            boxShadow: '0 4px 24px rgba(165,214,58,0.4), 0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          アプリを始める →
        </button>
      </div>
    </div>
  )
}
