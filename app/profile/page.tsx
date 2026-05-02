import { SaunaProfileCard } from '@/components/SaunaProfileCard'
import { GlassCard } from '@/components/GlassCard'
import { mockProfile } from '@/lib/mock-data'

export default function ProfilePage() {
  return (
    <div className="p-4 lg:p-6 max-w-lg">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white/90">サウナプロファイル</h1>
        <p className="text-sm text-white/45 mt-0.5">あなたの好みを登録するとAI分析の精度が上がります。</p>
      </div>

      {/* 誘導メッセージ */}
      <GlassCard className="p-3 mb-4"
        style={{ background: 'rgba(124,179,66,0.07)', border: '1px solid rgba(124,179,66,0.2)' }}>
        <p className="text-xs text-[#a5d63a]/80 leading-relaxed">
          💡 サウナプロファイルを入力すると、あなたに合ったサウナ提案・ととのい分析の精度が上がります。
          入力は任意です。記録データからも自動生成されます。
        </p>
      </GlassCard>

      <SaunaProfileCard profile={mockProfile} />
    </div>
  )
}
