'use client'

import { useEffect, useState } from 'react'
import { Leaf } from 'lucide-react'

const steps = [
  '回答データを解析中...',
  '熱耐性・冷水耐性を計算中...',
  'ととのいスタイルを分析中...',
  'TOTONOI CODEを生成中...',
]

export function DiagnosisLoading({ onDone }: { onDone: () => void }) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(i => {
        if (i >= steps.length - 1) {
          clearInterval(interval)
          setTimeout(onDone, 600)
          return i
        }
        return i + 1
      })
    }, 450)
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center">

        {/* スピナー */}
        <div className="relative w-28 h-28 mb-8">
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(165,214,58,0.8) 100%)',
              padding: '3px',
            }}
          >
            <div className="w-full h-full rounded-full bg-[#EFE8DD] lg:bg-[#0a1a08]" />
          </div>
          <div
            className="absolute inset-3 rounded-full animate-pulse"
            style={{ background: 'radial-gradient(circle, rgba(165,214,58,0.15) 0%, transparent 70%)' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="w-10 h-10" style={{ color: '#a5d63a' }} />
          </div>
          <div
            className="absolute -inset-2 rounded-full animate-pulse"
            style={{ background: 'radial-gradient(circle, rgba(165,214,58,0.12) 0%, transparent 70%)' }}
          />
        </div>

        {/* テキスト */}
        <p className="text-base font-semibold mb-2 text-[#1a2a10] lg:text-white">分析中...</p>
        <p
          key={stepIndex}
          className="text-sm text-center transition-opacity duration-300 text-[#4d8a28] lg:text-[#a5d63a]/70"
        >
          {steps[stepIndex]}
        </p>

        {/* ドット */}
        <div className="flex gap-1.5 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ background: '#a5d63a', opacity: 0.6, animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
