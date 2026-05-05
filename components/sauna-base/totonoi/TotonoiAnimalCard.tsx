'use client'

import { useState } from 'react'

interface Props {
  illustrationPath: string
  animalName: string
  animalKey: string
  emoji: string
  color: string
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
}

const sizeMap = {
  sm: { container: 'w-16 h-16', emoji: 'text-4xl' },
  md: { container: 'w-24 h-24', emoji: 'text-5xl' },
  lg: { container: 'w-36 h-36', emoji: 'text-7xl' },
}

export function TotonoiAnimalCard({
  illustrationPath,
  animalName,
  animalKey,
  emoji,
  color,
  size = 'lg',
  showName = true,
}: Props) {
  const [imgError, setImgError] = useState(false)
  const s = sizeMap[size]

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${s.container} rounded-3xl flex items-center justify-center relative overflow-hidden`}
        style={{
          background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
          border: `2px solid ${color}33`,
          boxShadow: `0 8px 32px ${color}22`,
        }}
      >
        {!imgError ? (
          <img
            src={illustrationPath}
            alt={animalName}
            className="w-full h-full object-contain p-2"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className={s.emoji} role="img" aria-label={animalName}>
            {emoji}
          </span>
        )}
      </div>
      {showName && (
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
        >
          {animalName}タイプ
        </span>
      )}
    </div>
  )
}
