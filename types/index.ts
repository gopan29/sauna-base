export type RestStyle = 'outdoor' | 'indoor' | 'rest_only' | 'none'
export type BodyCondition = 'great' | 'normal' | 'tired' | 'sick'
export type ScoreRank = '神ととのい' | '最高' | '良い' | '普通' | '不完全燃焼'

export interface SaunaRecord {
  id: string
  date: string
  facilityName: string
  memo?: string
  sets: number
  saunaTemp: number
  waterTemp: number
  restStyle: RestStyle
  subjectiveRating: 1 | 2 | 3 | 4 | 5
  bodyCondition: BodyCondition
  totalMinutes?: number
  notes?: string
  score: number
  imageUrl?: string
}

export interface MonthlyStats {
  month: string
  visitCount: number
  totalMinutes: number
  streakDays: number
  avgScore: number
  bestScore: number
  avgSets: number
  avgSaunaTemp: number
  avgWaterTemp: number
  avgRestMinutes: number
  prevMonthVisitCount?: number
  prevMonthTotalMinutes?: number
  prevMonthAvgScore?: number
}

export interface ScoreTrendPoint {
  date: string
  score: number
  label?: string
}

export interface CalendarDay {
  date: string
  visited: boolean
  totonoied: boolean
  score?: number
}

export interface SaunaProfile {
  preferredSaunaTemp: string
  preferredWaterTemp: string
  outdoorPreference: number
  crowdTolerance: number
  visitFrequency: string
}

export interface AIAnalysis {
  bestTendency: string
  bestSaunaTemp: string
  bestWaterTemp: string
  bestSets: number
  bestRestStyle: RestStyle
  bestTimeSlot: string
  bestDays: string[]
  bestConditions: string[]
  conditionScore: number
  weeklyHighlight: string
  recommendations: SaunaRecommendation[]
}

export interface SaunaRecommendation {
  id: string
  name: string
  location: string
  imageUrl: string
  tags: string[]
  reason: string
}
