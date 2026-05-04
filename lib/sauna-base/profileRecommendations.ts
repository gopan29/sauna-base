import type { Heat, Water, Mind, Style, TotonoiProfile } from '@/types/sauna-base'

const heatLabel: Record<Heat, string> = {
  B: 'Balanced（バランス）',
  H: 'Hot（高温志向）',
  E: 'Extreme（激熱志向）',
}
const waterLabel: Record<Water, string> = {
  S: 'Soft（マイルド）',
  C: 'Cool（標準冷水）',
  I: 'Ice（極冷志向）',
}
const mindLabel: Record<Mind, string> = {
  C: 'Calm（リラックス）',
  F: 'Focus（集中）',
  D: 'Deep（深ととのい）',
}
const styleLabel: Record<Style, string> = {
  F: 'Flow（感覚型）',
  R: 'Routine（安定型）',
  P: 'Push（ストイック型）',
}

const mindAdj: Record<Mind, string> = { C: 'Calm', F: 'Focused', D: 'Deep' }
const heatNoun: Record<Heat, string> = { B: 'Balance', H: 'Heat', E: 'Extreme' }
const styleNoun: Record<Style, string> = { F: 'Flow', R: 'Routine', P: 'Push' }

const heatTempDesc: Record<Heat, string> = {
  B: 'バランスの取れた温度帯（80〜90℃）のサウナ',
  H: '高温サウナ（90〜100℃）',
  E: '極限の高温（100℃以上）のサウナ',
}
const waterTempDesc: Record<Water, string> = {
  S: 'ゆっくり入れるマイルドな水風呂（18℃以上）',
  C: '標準的な冷たさの水風呂（14〜17℃）',
  I: '極冷水の水風呂（シングル〜13℃台）',
}
const mindPhrase: Record<Mind, string> = {
  C: '癒しとリラックスを大切にしながら',
  F: '集中してサウナ・水風呂・休憩の流れを整えることで',
  D: '深く没入し、意識が落ちる感覚を楽しむことで',
}
const stylePhrase: Record<Style, string> = {
  F: 'その日の感覚に合わせて柔軟に',
  R: '安定したルーティンで',
  P: 'ストイックにセット数・時間を管理して',
}

const saunaTemp: Record<Heat, string> = {
  B: '80〜90℃',
  H: '90〜100℃',
  E: '100℃以上',
}
const waterTemp: Record<Water, string> = {
  S: '18℃以上',
  C: '14〜17℃',
  I: '13℃以下',
}
const sets: Record<Style, string> = {
  F: '気分に合わせる',
  R: '2〜3セット',
  P: '3セット以上',
}
const restStyle: Record<Mind, string> = {
  C: 'リラックス重視',
  F: '集中・呼吸重視',
  D: '深い外気浴・瞑想重視',
}

export function buildProfile(
  heat: Heat, water: Water, mind: Mind, style: Style
): TotonoiProfile {
  const code = `${heat}${water}${mind}${style}`
  const typeName = `${mindAdj[mind]} ${heatNoun[heat]} ${styleNoun[style]}`
  const description =
    `あなたは${heatTempDesc[heat]}と${waterTempDesc[water]}の組み合わせが合っているタイプです。` +
    `${mindPhrase[mind]}、${stylePhrase[style]}ととのいを深めることができます。`

  return {
    code,
    heat, water, mind, style,
    typeName,
    description,
    recommendedSaunaTemp: saunaTemp[heat],
    recommendedWaterTemp:  waterTemp[water],
    recommendedSets:       sets[style],
    recommendedRestStyle:  restStyle[mind],
  }
}

export { heatLabel, waterLabel, mindLabel, styleLabel }
