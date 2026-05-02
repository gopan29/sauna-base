import Link from 'next/link'
import { Sparkles, MapPin, ChevronRight } from 'lucide-react'
import { GlassCard } from './GlassCard'
import type { AIAnalysis } from '@/types'

interface Props {
  analysis: AIAnalysis
}

export function AIRecommendCard({ analysis }: Props) {
  const top = analysis.recommendations[0]

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#7cb342]" />
          <h3 className="text-sm font-semibold text-white/80">AIレコメンド</h3>
        </div>
        <Link href="/ai" className="text-[10px] text-[#7cb342] hover:text-[#a5d63a]">すべて見る &rsaquo;</Link>
      </div>

      <p className="text-[10px] text-white/40 mb-3">あなたにおすすめのサウナ</p>

      {top && (
        <div>
          <div className="w-full h-24 rounded-xl overflow-hidden mb-3">
            <img
              src={top.imageUrl}
              alt={top.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs font-semibold text-white/85">{top.name}</p>
          <div className="flex items-center gap-1 text-[10px] text-white/40 mb-2">
            <MapPin className="w-2.5 h-2.5" />
            <span>{top.location}</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {top.tags.map(tag => (
              <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full text-[#a5d63a]"
                style={{ background: 'rgba(124,179,66,0.15)', border: '1px solid rgba(124,179,66,0.3)' }}>
                {tag}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-white/45 mb-3 leading-relaxed">{top.reason}</p>
          <button className="w-full py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 text-white/70 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
            詳細を見る <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </GlassCard>
  )
}
