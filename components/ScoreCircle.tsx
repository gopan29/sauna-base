'use client'

import { getScoreRank, getScoreColor } from '@/lib/score'

interface Props {
  score: number
  maxScore?: number
  size?: 'sm' | 'md' | 'lg'
  bestScore?: number
  bestDate?: string
}

const sizeMap = {
  sm: { container: 'w-20 h-20', text: 'text-2xl', sub: 'text-[10px]' },
  md: { container: 'w-32 h-32', text: 'text-4xl', sub: 'text-xs' },
  lg: { container: 'w-40 h-40', text: 'text-5xl', sub: 'text-sm' },
}

export function ScoreCircle({ score, maxScore = 50, size = 'md', bestScore, bestDate }: Props) {
  const pct = Math.min(score / maxScore, 1)
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const offset = circumference - pct * circumference
  const color = getScoreColor(score)
  const rank = getScoreRank(score)
  const sz = sizeMap[size]

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative ${sz.container}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="7"
          />
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 6px ${color}88)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${sz.text} font-bold leading-none`} style={{ color }}>
            {score}
          </span>
          <span className={`${sz.sub} text-white/50`}>/{maxScore}点</span>
        </div>
      </div>
      <p className="text-sm font-medium" style={{ color }}>{rank}</p>
      {bestScore !== undefined && bestDate && (
        <p className="text-xs text-white/40">あなたのベスト {bestScore}点（{bestDate}）</p>
      )}
    </div>
  )
}
