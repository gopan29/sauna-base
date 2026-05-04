'use client'

import { useState } from 'react'
import type { Question } from '@/types/sauna-base'
import { DiagnosisProgress } from './DiagnosisProgress'

export function DiagnosisQuestion({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
}: {
  question: Question
  questionIndex: number
  totalQuestions: number
  onAnswer: (optionId: 'A' | 'B' | 'C') => void
}) {
  const [selected, setSelected] = useState<'A' | 'B' | 'C' | null>(null)

  const handleSelect = (id: 'A' | 'B' | 'C') => {
    setSelected(id)
    setTimeout(() => {
      setSelected(null)
      onAnswer(id)
    }, 320)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* 進捗 */}
        <div className="mb-6">
          <DiagnosisProgress current={questionIndex + 1} total={totalQuestions} />
        </div>

        {/* 質問カード */}
        <div
          className="rounded-3xl p-6 mb-4"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          <p className="text-xs mb-3 tracking-widest text-[#4d8a28] lg:text-[#a5d63a]/65">
            Q{questionIndex + 1}
          </p>
          <h2 className="text-lg font-bold leading-snug text-[#1a2a10] lg:text-white">
            {question.text}
          </h2>
        </div>

        {/* 選択肢 */}
        <div className="space-y-3">
          {question.options.map((opt) => {
            const isSelected = selected === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={selected !== null}
                className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98] flex items-start gap-3.5"
                style={{
                  background: isSelected ? 'rgba(165,214,58,0.18)' : 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: isSelected ? '1px solid rgba(165,214,58,0.5)' : '1px solid rgba(0,0,0,0.08)',
                  boxShadow: isSelected ? '0 0 20px rgba(165,214,58,0.2)' : '0 2px 12px rgba(0,0,0,0.08)',
                }}
              >
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isSelected ? '' : 'text-[#1a2a10]/50 lg:text-white/50'
                  }`}
                  style={isSelected ? {
                    background: 'rgba(165,214,58,0.3)',
                    color: '#a5d63a',
                    border: '1px solid rgba(165,214,58,0.4)',
                  } : {
                    background: 'rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  {opt.id}
                </span>
                <span
                  className={`text-sm leading-relaxed ${
                    isSelected ? '' : 'text-[#1a2a10]/78 lg:text-white/78'
                  }`}
                  style={isSelected ? { color: '#a5d63a' } : undefined}
                >
                  {opt.text}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
