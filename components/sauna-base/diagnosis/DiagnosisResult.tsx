import type { TotonoiProfile } from '@/types/sauna-base'
import { TotonoiResultCard } from '@/components/sauna-base/totonoi/TotonoiResultCard'

export function DiagnosisResult({
  profile,
  onContinue,
}: {
  profile: TotonoiProfile
  onContinue: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-sm space-y-4">

        {/* メイン結果カード */}
        <TotonoiResultCard profile={profile} variant="full" />

        {/* おすすめ初期設定 */}
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
