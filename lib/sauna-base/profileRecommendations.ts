import type { Heat, Water, Mind, Style, TotonoiProfile } from '@/types/sauna-base'
import { getAnimalByTypeName } from './totonoiTypes'

export const heatLabel: Record<Heat, string> = {
  B: 'Balanced（バランス）',
  H: 'Hot（高温志向）',
  E: 'Extreme（激熱志向）',
}
export const waterLabel: Record<Water, string> = {
  S: 'Soft（マイルド）',
  C: 'Cool（標準冷水）',
  I: 'Ice（極冷志向）',
}
export const mindLabel: Record<Mind, string> = {
  C: 'Calm（リラックス）',
  F: 'Focus（集中）',
  D: 'Deep（深ととのい）',
}
export const styleLabel: Record<Style, string> = {
  F: 'Flow（感覚型）',
  R: 'Routine（安定型）',
  P: 'Push（ストイック型）',
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
  F: '呼吸・体感重視',
  D: '深い外気浴・瞑想重視',
}

export function mapToType(code: string): string {
  const [heat, water, mind, style] = code.split('')

  if (heat === 'E' || water === 'I') {
    if (mind === 'D' && style === 'P') return '極限ストイック整い型'
    if (mind === 'D') return 'ディープストイック型'
    if (mind === 'F' && style === 'P') return 'ハード整い型'
    if (mind === 'F') return 'コントロール整い型'
    return 'ストイック寄りエンジョイ型'
  }

  if (heat === 'H' || water === 'C') {
    if (mind === 'F' && style === 'R') return '完成度重視バランス型'
    if (mind === 'F') return '安定整い型'
    return 'ベーシック整い型'
  }

  if (heat === 'B' && water === 'S') {
    if (mind === 'C' && style === 'F') return '深リラックス型'
    if (mind === 'C') return 'ゆる整い型'
    return 'マイルド整い型'
  }

  if (mind === 'D') {
    if (style === 'R') return '瞑想サウナー型'
    return '没入整い型'
  }

  if (mind === 'C') {
    if (style === 'F') return 'サウナ満喫型'
    return '気分整い型'
  }

  return 'ベーシック整い型'
}

const typeDescriptions: Record<string, string> = {
  '極限ストイック整い型':
    '極限に近い熱と冷たさに反応しやすいタイプ。\n熱・冷・セット構成がハマるほど、ととのいスコアが伸びやすいです。',
  'ディープストイック型':
    '強い刺激だけでなく、休憩中の深い没入まで含めてととのいを作るタイプです。',
  'ハード整い型':
    'しっかり入ること、セット数をこなすこと、負荷の強さでスコアが伸びやすいタイプです。',
  'コントロール整い型':
    'サウナ・水風呂・休憩の流れを整えることで、安定して高いスコアを出しやすいタイプです。',
  'ストイック寄りエンジョイ型':
    '熱や水風呂の刺激も楽しみつつ、最終的な満足感も大切にするタイプです。',
  '完成度重視バランス型':
    '特定の要素だけでなく、全体の完成度でととのいを感じるタイプです。',
  '安定整い型':
    '無理のない温度・水風呂・休憩の流れで、安定したととのいを作るタイプです。',
  'ベーシック整い型':
    '基本的な気持ちよさを大切にし、無理なくサウナ体験を楽しむタイプです。',
  '深リラックス型':
    '刺激よりも、休憩の深さと満足感でととのうタイプです。',
  'ゆる整い型':
    '無理に追い込まず、その日の気持ちよさを優先してととのうタイプです。',
  'マイルド整い型':
    '熱さや冷たさの刺激よりも、心地よさ・安心感・余韻を重視するタイプです。',
  '瞑想サウナー型':
    '静けさ、呼吸、内面の落ち着きがスコアに反映されやすいタイプです。',
  '没入整い型':
    'サウナ中の没入感と、休憩中に深く落ちる感覚を重視するタイプです。',
  'サウナ満喫型':
    'サウナだけでなく、施設の雰囲気や体験全体の満足度を重視するタイプです。',
  '気分整い型':
    'その日の気分や体調に合っていたかどうかが、スコアに反映されやすいタイプです。',
}

export function buildProfile(
  heat: Heat, water: Water, mind: Mind, style: Style
): TotonoiProfile {
  const code = `${heat}${water}${mind}${style}`
  const typeName = mapToType(code)
  const description = typeDescriptions[typeName] ?? ''
  const animal = getAnimalByTypeName(typeName)

  return {
    code,
    heat, water, mind, style,
    typeName,
    description,
    animalKey: animal.animalKey,
    animalName: animal.animalName,
    illustrationPath: animal.illustrationPath,
    emoji: animal.emoji,
    color: animal.color,
    recommendedSaunaTemp: saunaTemp[heat],
    recommendedWaterTemp: waterTemp[water],
    recommendedSets: sets[style],
    recommendedRestStyle: restStyle[mind],
  }
}
