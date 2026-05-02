import { CSSProperties, ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  onClick?: () => void
  dark?: boolean
  style?: CSSProperties
}

export function GlassCard({ children, className = '', onClick, dark, style }: Props) {
  const base = dark ? 'glass-dark' : 'glass'
  return (
    <div
      className={`${base} p-4 ${onClick ? 'cursor-pointer hover:border-white/20 transition-colors' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  )
}
