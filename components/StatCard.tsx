import { ReactNode } from 'react'
import { GlassCard } from './GlassCard'

interface Props {
  icon: ReactNode
  label: string
  value: string | number
  unit?: string
  diff?: string
  diffPositive?: boolean
  className?: string
}

export function StatCard({ icon, label, value, unit, diff, diffPositive, className }: Props) {
  return (
    <GlassCard className={`flex flex-col gap-1 ${className ?? ''}`}>
      <div className="flex items-center gap-1.5 text-white/50 text-xs">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-bold text-white/90">{value}</span>
        {unit && <span className="text-sm text-white/50 pb-0.5">{unit}</span>}
      </div>
      {diff && (
        <p className={`text-xs ${diffPositive ? 'text-[#a5d63a]' : 'text-red-400'}`}>
          {diff}
        </p>
      )}
    </GlassCard>
  )
}
