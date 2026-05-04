import Link from 'next/link'
import type { TotonoiProfile } from '@/types/sauna-base'
import { PenLine, Leaf } from 'lucide-react'

export function FirstDashboardPrompt({ profile }: { profile: TotonoiProfile }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">

        {/* アイコン */}
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
          style={{
            background: 'linear-gradient(135deg, #a5d63a 0%, #4a7c20 100%)',
            boxShadow: '0 0 40px rgba(165,214,58,0.35), 0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <Leaf className="w-10 h-10 text-white" />
        </div>

        {/* メッセージ */}
        <h2 className="text-2xl font-bold mb-2 text-[#1a2a10] lg:text-white">ようこそ、SAUNA BASE へ</h2>
        <div
          className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4"
          style={{
            background: 'rgba(165,214,58,0.12)',
            border: '1px solid rgba(165,214,58,0.3)',
            color: '#4d8a28',
          }}
        >
          TOTONOI CODE : {profile.code}
        </div>
        <p className="text-sm mb-8 text-[#1a2a10]/55 lg:text-white/50">
          最初のサウナ記録をつけて、<br />
          あなたのととのいをスコア化しましょう。
        </p>

        {/* CTAカード */}
        <div
          className="rounded-3xl p-5 mb-5"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
          }}
        >
          <div className="flex items-center gap-3 text-left mb-4">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(165,214,58,0.12)', border: '1px solid rgba(165,214,58,0.25)' }}
            >
              <PenLine className="w-5 h-5" style={{ color: '#a5d63a' }} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1a2a10] lg:text-white">サウナ記録を始める</p>
              <p className="text-[10px] text-[#1a2a10]/45 lg:text-white/42">
                施設・セット数・温度・ととのい度を記録
              </p>
            </div>
          </div>

          <Link
            href="/record"
            className="block w-full py-4 rounded-2xl text-sm font-bold text-white text-center transition-all active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #a5d63a 0%, #5a9e28 100%)',
              boxShadow: '0 4px 24px rgba(165,214,58,0.4)',
            }}
          >
            記録する →
          </Link>
        </div>

        <Link
          href="/"
          className="text-xs text-[#1a2a10]/35 lg:text-white/28"
        >
          まずはダッシュボードを見る
        </Link>
      </div>
    </div>
  )
}
