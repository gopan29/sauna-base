import type { TotonoiProfile } from '@/types/sauna-base'
import { CheckCircle, Thermometer, Droplets, BarChart2, Wind } from 'lucide-react'

export function InitialProfileApplied({
  profile,
  onContinue,
}: {
  profile: TotonoiProfile
  onContinue: () => void
}) {
  const settings = [
    { icon: Thermometer, label: 'サウナ温度',  value: profile.recommendedSaunaTemp, color: '#f97316' },
    { icon: Droplets,    label: '水風呂温度',  value: profile.recommendedWaterTemp,  color: '#38bdf8' },
    { icon: BarChart2,   label: '推奨セット数', value: profile.recommendedSets,       color: '#a5d63a' },
    { icon: Wind,        label: '休憩スタイル', value: profile.recommendedRestStyle,  color: '#c084fc' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* ヘッダー */}
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'rgba(165,214,58,0.15)',
              border: '1px solid rgba(165,214,58,0.35)',
              boxShadow: '0 0 24px rgba(165,214,58,0.25)',
            }}
          >
            <CheckCircle className="w-8 h-8" style={{ color: '#a5d63a' }} />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">初期設定が反映されました</h2>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
            TOTONOI CODE <span style={{ color: '#a5d63a', fontWeight: 700 }}>{profile.code}</span> に基づいて設定しました
          </p>
        </div>

        {/* 設定リスト */}
        <div
          className="rounded-3xl p-5 mb-5"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          <div className="space-y-3.5">
            {settings.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
                  <p className="text-sm font-semibold text-white">{value}</p>
                </div>
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#a5d63a' }} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.97]"
          style={{
            background: 'linear-gradient(135deg, #a5d63a 0%, #5a9e28 100%)',
            boxShadow: '0 4px 24px rgba(165,214,58,0.4), 0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          ダッシュボードへ →
        </button>
      </div>
    </div>
  )
}
