export type Heat = 'B' | 'H' | 'E'
export type Water = 'S' | 'C' | 'I'
export type Mind = 'C' | 'F' | 'D'
export type Style = 'F' | 'R' | 'P'

export type TotonoiProfile = {
  code: string
  heat: Heat
  water: Water
  mind: Mind
  style: Style
  typeName: string
  description: string
  recommendedSaunaTemp: string
  recommendedWaterTemp: string
  recommendedSets: string
  recommendedRestStyle: string
}

export type Scores = {
  heat: Record<Heat, number>
  water: Record<Water, number>
  mind: Record<Mind, number>
  style: Record<Style, number>
}

export type ScoreContribution = {
  heat?: Heat
  water?: Water
  mind?: Mind
  style?: Style
}

export type AnswerOption = {
  id: 'A' | 'B' | 'C' | 'D'
  text: string
  contributions: ScoreContribution
}

export type Question = {
  id: number
  displayNumber: number
  text: string
  options: AnswerOption[]
}

export type DiagnosisStep = 'start' | 'question' | 'loading' | 'result' | 'profile' | 'prompt'
