import type { SaunaRecord, ScoreRank, RestStyle } from '@/types'
import type { BaseScores } from '@/lib/sauna-base/scoreAdjustments'

function setsToScore(sets: number): number {
  if (sets >= 5) return 5
  if (sets === 4) return 4
  if (sets === 3) return 3
  if (sets === 2) return 2
  return 1
}

function saunaTempToScore(temp: number): number {
  if (temp >= 100) return 5
  if (temp >= 95) return 4
  if (temp >= 88) return 3
  if (temp >= 80) return 2
  return 1
}

function waterTempToScore(temp: number): number {
  if (temp <= 14) return 5
  if (temp <= 16) return 4
  if (temp <= 18) return 3
  if (temp <= 20) return 2
  return 1
}

function restStyleToScore(style: RestStyle): number {
  const map: Record<RestStyle, number> = {
    outdoor: 5,
    indoor: 3,
    rest_only: 2,
    none: 1,
  }
  return map[style]
}

export function calculateBaseScores(
  sets: number,
  saunaTemp: number,
  waterTemp: number,
  restStyle: RestStyle,
  subjectiveRating: number
): BaseScores {
  return {
    sets:       setsToScore(sets) * 2,
    saunaTemp:  saunaTempToScore(saunaTemp) * 2,
    waterTemp:  waterTempToScore(waterTemp) * 2,
    rest:       restStyleToScore(restStyle) * 2,
    subjective: Math.min(Math.max(subjectiveRating, 1), 5) * 2,
  }
}

export function calculateScore(
  sets: number,
  saunaTemp: number,
  waterTemp: number,
  restStyle: RestStyle,
  subjectiveRating: number
): number {
  const b = calculateBaseScores(sets, saunaTemp, waterTemp, restStyle, subjectiveRating)
  return b.sets + b.saunaTemp + b.waterTemp + b.rest + b.subjective
}

export function getScoreRank(score: number): ScoreRank {
  if (score >= 45) return '神ととのい'
  if (score >= 40) return '最高'
  if (score >= 30) return '良い'
  if (score >= 20) return '普通'
  return '不完全燃焼'
}

export function getScoreStars(score: number): number {
  if (score >= 45) return 5
  if (score >= 40) return 4
  if (score >= 30) return 3
  if (score >= 20) return 2
  return 1
}

export function getScoreColor(score: number): string {
  if (score >= 45) return '#f59e0b'
  if (score >= 40) return '#86c52d'
  if (score >= 30) return '#7cb342'
  if (score >= 20) return '#8bc34a'
  return '#6b7280'
}

export function getRestStyleLabel(style: RestStyle): string {
  const map: Record<RestStyle, string> = {
    outdoor: '外気浴',
    indoor: '内気浴',
    rest_only: '休憩のみ',
    none: 'なし',
  }
  return map[style]
}
