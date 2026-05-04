'use client'

import { useState, useCallback } from 'react'
import type { DiagnosisStep, Scores, TotonoiProfile } from '@/types/sauna-base'
import { questions } from '@/lib/sauna-base/diagnosisQuestions'
import { initialScores, applyContribution, generateCode } from '@/lib/sauna-base/totonoiCode'
import { buildProfile } from '@/lib/sauna-base/profileRecommendations'
import { DiagnosisStart } from '@/components/sauna-base/diagnosis/DiagnosisStart'
import { DiagnosisQuestion } from '@/components/sauna-base/diagnosis/DiagnosisQuestion'
import { DiagnosisLoading } from '@/components/sauna-base/diagnosis/DiagnosisLoading'
import { DiagnosisResult } from '@/components/sauna-base/diagnosis/DiagnosisResult'
import { InitialProfileApplied } from '@/components/sauna-base/diagnosis/InitialProfileApplied'
import { FirstDashboardPrompt } from '@/components/sauna-base/diagnosis/FirstDashboardPrompt'

export default function OnboardingPage() {
  const [step, setStep] = useState<DiagnosisStep>('start')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [scores, setScores] = useState<Scores>(initialScores())
  const [profile, setProfile] = useState<TotonoiProfile | null>(null)

  const handleStart = () => setStep('question')

  const handleAnswer = useCallback((optionId: 'A' | 'B' | 'C') => {
    const option = questions[questionIndex].options.find(o => o.id === optionId)!
    const newScores = applyContribution(scores, option.contributions)
    setScores(newScores)

    if (questionIndex >= questions.length - 1) {
      const { heat, water, mind, style } = generateCode(newScores)
      setProfile(buildProfile(heat, water, mind, style))
      setStep('loading')
    } else {
      setQuestionIndex(i => i + 1)
    }
  }, [questionIndex, scores])

  const handleLoadingDone = () => setStep('result')
  const handleResultContinue = () => setStep('profile')
  const handleProfileContinue = () => setStep('prompt')

  return (
    <div style={{ background: 'linear-gradient(180deg, #0a1a08 0%, #0d2210 100%)', minHeight: '100svh' }}>
      {step === 'start' && (
        <DiagnosisStart onStart={handleStart} />
      )}
      {step === 'question' && (
        <DiagnosisQuestion
          question={questions[questionIndex]}
          questionIndex={questionIndex}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
        />
      )}
      {step === 'loading' && (
        <DiagnosisLoading onDone={handleLoadingDone} />
      )}
      {step === 'result' && profile && (
        <DiagnosisResult profile={profile} onContinue={handleResultContinue} />
      )}
      {step === 'profile' && profile && (
        <InitialProfileApplied profile={profile} onContinue={handleProfileContinue} />
      )}
      {step === 'prompt' && profile && (
        <FirstDashboardPrompt profile={profile} />
      )}
    </div>
  )
}
