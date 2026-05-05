import { Leaf, Flame, Droplets, Brain } from 'lucide-react'
import Link from 'next/link'

export function DiagnosisStart({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* ロゴアイコン */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #a5d63a 0%, #4a7c20 100%)',
              boxShadow: '0 0 40px rgba(165,214,58,0.4), 0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <p className="text-xs tracking-[0.25em] uppercase text-[#4d8a28] lg:text-[#a5d63a]/70">
            SAUNA BASE
          </p>
        </div>

        {/* メインカード */}
        <div
          className="rounded-3xl p-7 mb-5"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          <div className="text-center mb-6">
            <p className="text-xs tracking-widest uppercase mb-2 text-[#4d8a28] lg:text-[#a5d63a]/65">
              DIAGNOSIS
            </p>
            <h1 className="text-2xl font-bold mb-1 text-[#1a2a10] lg:text-white">サウナー診断</h1>
            <p className="text-sm text-[#1a2a10]/60 lg:text-white/50">
              あなただけの TOTONOI CODE を発見しよう
            </p>
          </div>

          {/* 特徴3点 */}
          <div className="space-y-3 mb-7">
            {[
              { icon: Flame,    text: '14問でわかるあなたの熱耐性と好み' },
              { icon: Droplets, text: '水風呂・休憩スタイルを分析' },
              { icon: Brain,    text: 'ととのいスコアに反映する初期設定を生成' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(165,214,58,0.12)', border: '1px solid rgba(165,214,58,0.25)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: '#a5d63a' }} />
                </div>
                <p className="text-xs text-[#1a2a10]/70 lg:text-white/65">{text}</p>
              </div>
            ))}
          </div>

          {/* スタートボタン */}
          <button
            onClick={onStart}
            className="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #a5d63a 0%, #5a9e28 100%)',
              boxShadow: '0 4px 24px rgba(165,214,58,0.4), 0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            診断スタート →
          </button>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-[#1a2a10]/40 lg:text-white/28"
          >
            スキップしてダッシュボードへ
          </Link>
        </div>
      </div>
    </div>
  )
}
