import type { Heat, Water, Mind, Style, Scores, ScoreContribution } from '@/types/sauna-base'

export function initialScores(): Scores {
  return {
    heat:  { B: 0, H: 0, E: 0 },
    water: { S: 0, C: 0, I: 0 },
    mind:  { C: 0, F: 0, D: 0 },
    style: { F: 0, R: 0, P: 0 },
  }
}

export function applyContribution(scores: Scores, c: ScoreContribution): Scores {
  const next = {
    heat:  { ...scores.heat },
    water: { ...scores.water },
    mind:  { ...scores.mind },
    style: { ...scores.style },
  }
  if (c.heat)  next.heat[c.heat]++
  if (c.water) next.water[c.water]++
  if (c.mind)  next.mind[c.mind]++
  if (c.style) next.style[c.style]++
  return next
}

function pickHeat(s: Record<Heat, number>): Heat {
  const order: Heat[] = ['B', 'H', 'E']
  return order.reduce((best, cur) => s[cur] > s[best] ? cur : best, order[0])
}
function pickWater(s: Record<Water, number>): Water {
  const order: Water[] = ['S', 'C', 'I']
  return order.reduce((best, cur) => s[cur] > s[best] ? cur : best, order[0])
}
function pickMind(s: Record<Mind, number>): Mind {
  const order: Mind[] = ['C', 'F', 'D']
  return order.reduce((best, cur) => s[cur] > s[best] ? cur : best, order[0])
}
function pickStyle(s: Record<Style, number>): Style {
  const order: Style[] = ['F', 'R', 'P']
  return order.reduce((best, cur) => s[cur] > s[best] ? cur : best, order[0])
}

export function generateCode(scores: Scores): { heat: Heat; water: Water; mind: Mind; style: Style; code: string } {
  const heat  = pickHeat(scores.heat)
  const water = pickWater(scores.water)
  const mind  = pickMind(scores.mind)
  const style = pickStyle(scores.style)
  return { heat, water, mind, style, code: `${heat}${water}${mind}${style}` }
}
