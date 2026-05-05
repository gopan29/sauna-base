import type { TotonoiProfile } from '@/types/sauna-base'
import { TotonoiAnimalCard } from './TotonoiAnimalCard'
import { heatLabel, waterLabel, mindLabel, styleLabel } from '@/lib/sauna-base/profileRecommendations'
import { Thermometer, Droplets, Wind, BarChart2, Leaf } from 'lucide-react'

const axisInfo = [
  { key: 'heat' as const,  icon: Thermometer, color: '#f97316', label: 'HEAT',  labelMap: heatLabel },
  { key: 'water' as const, icon: Droplets,    color: '#38bdf8', label: 'WATER', labelMap: waterLabel },
  { key: 'mind' as const,  icon: Wind,        color: '#a5d63a', label: 'MIND',  labelMap: mindLabel },
  { key: 'style' as const, icon: BarChart2,   color: '#c084fc', label: 'STYLE', labelMap: styleLabel },
]

interface Props {
  profile: TotonoiProfile
  variant?: 'full' | 'compact'
}

export function TotonoiResultCard({ profile, variant = 'full' }: Props) {
  const letters = profile.code.split('')

  if (variant === 'compact') {
    return (
      <div
        className="rounded-2xl p-4 flex items-center gap-4"
        style={{
          background: 'rgba(165,214,58,0.07)',
          border: '1px solid rgba(165,214,58,0.25)',
        }}
      >
        <TotonoiAnimalCard
          illustrationPath={profile.illustrationPath}
          animalName={profile.animalName}
          animalKey={profile.animalKey}
          emoji={profile.emoji}
          color={profile.color}
          size="sm"
          showName={false}
        />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[#a5d63a]/70 tracking-widest uppercase mb-0.5">TOTONOI CODE</p>
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-xl font-bold tracking-wider" style={{ color: '#a5d63a' }}>{profile.code}</span>
            <span className="text-xs font-semibold text-white/60">{profile.typeName}</span>
          </div>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: `${profile.color}18`, color: profile.color, border: `1px solid ${profile.color}30` }}
          >
            {profile.animalName}タイプ
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
      }}
    >
      {/* ヘッダー：SAUNA BASEロゴ */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-1.5">
          <Leaf className="w-4 h-4" style={{ color: '#a5d63a' }} />
          <span className="text-xs font-bold tracking-wider text-[#1a2a10]/60 lg:text-white/60">SAUNA BASE</span>
        </div>
        <span className="text-[10px] tracking-widest text-[#1a2a10]/35 lg:text-white/30">あなたのととのいタイプ</span>
      </div>

      <div className="p-6">
        {/* TOTONOI CODE */}
        <div className="text-center mb-5">
          <p className="text-[10px] tracking-[0.3em] uppercase mb-3 text-[#1a2a10]/40 lg:text-white/38">
            Your TOTONOI CODE
          </p>
          <div className="flex justify-center gap-2 mb-3">
            {letters.map((letter, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(165,214,58,0.12)',
                  border: '1px solid rgba(165,214,58,0.35)',
                  boxShadow: '0 0 12px rgba(165,214,58,0.18)',
                }}
              >
                <span className="text-xl font-bold" style={{ color: '#a5d63a' }}>{letter}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 動物キャラクター（中央・大きく） */}
        <div className="flex flex-col items-center mb-5">
          <TotonoiAnimalCard
            illustrationPath={profile.illustrationPath}
            animalName={profile.animalName}
            animalKey={profile.animalKey}
            emoji={profile.emoji}
            color={profile.color}
            size="lg"
            showName={false}
          />
          <div className="text-center mt-3">
            <p className="text-lg font-bold mb-1 text-[#1a2a10] lg:text-white">{profile.typeName}</p>
            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full"
              style={{
                background: `${profile.color}18`,
                color: profile.color,
                border: `1px solid ${profile.color}30`,
              }}
            >
              {profile.animalName}タイプ
            </span>
          </div>
        </div>

        {/* タイプ説明 */}
        <p className="text-xs leading-relaxed text-center text-[#1a2a10]/65 lg:text-white/62 mb-5">
          {profile.description}
        </p>

        {/* 4軸詳細 */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="space-y-2.5">
            {axisInfo.map(({ key, icon: Icon, color, label, labelMap }) => (
              <div key={key} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${color}18`, border: `1px solid ${color}35` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <span className="text-[10px] font-bold tracking-widest w-12 shrink-0" style={{ color: `${color}cc` }}>
                  {label}
                </span>
                <span className="text-xs font-semibold text-[#1a2a10]/80 lg:text-white/80 truncate">
                  {profile[key]} — {(labelMap as Record<string, string>)[profile[key]]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
