import type { SaunaRecord, AIAnalysis, SaunaRecommendation } from '@/types'
import { mockAIAnalysis } from './mock-data'

export function analyzeRecords(records: SaunaRecord[]): AIAnalysis {
  if (records.length === 0) return mockAIAnalysis

  const sorted = [...records].sort((a, b) => b.score - a.score)
  const topRecords = sorted.slice(0, Math.ceil(sorted.length * 0.3))

  const avgSaunaTemp =
    topRecords.reduce((s, r) => s + r.saunaTemp, 0) / topRecords.length
  const avgWaterTemp =
    topRecords.reduce((s, r) => s + r.waterTemp, 0) / topRecords.length

  const outdoorCount = topRecords.filter((r) => r.restStyle === 'outdoor').length
  const bestRestStyle = outdoorCount >= topRecords.length * 0.5 ? 'outdoor' : 'indoor'

  const avgScore = records.reduce((s, r) => s + r.score, 0) / records.length
  const conditionScore = Math.min(Math.round(avgScore * 1.5) + 10, 100)

  const bestSaunaRange =
    avgSaunaTemp >= 95 ? '95℃前後' : avgSaunaTemp >= 88 ? '88〜95℃' : '80〜88℃'
  const bestWaterRange =
    avgWaterTemp <= 14 ? '〜14℃' : avgWaterTemp <= 16 ? '14〜16℃' : '16〜18℃'

  const tendency =
    avgSaunaTemp >= 95 && avgWaterTemp <= 16
      ? '高温サウナ × 冷たい水風呂'
      : avgSaunaTemp >= 88 && bestRestStyle === 'outdoor'
        ? '中高温サウナ × 外気浴'
        : 'バランス型サウナ'

  return {
    ...mockAIAnalysis,
    bestTendency: tendency,
    bestSaunaTemp: bestSaunaRange,
    bestWaterTemp: bestWaterRange,
    bestRestStyle,
    conditionScore,
  }
}

export function getScoreRankLabel(score: number): string {
  if (score >= 45) return '神ととのい'
  if (score >= 40) return '最高に近いととのい！'
  if (score >= 30) return '良いととのい'
  if (score >= 20) return '普通のととのい'
  return '不完全燃焼...'
}
