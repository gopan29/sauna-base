export type ScoreAdjustment = {
  sets: number
  saunaTemp: number
  waterTemp: number
  rest: number
  subjective: number
}

export type BaseScores = {
  sets: number
  saunaTemp: number
  waterTemp: number
  rest: number
  subjective: number
}

export type AdjustedScores = BaseScores & { total: number }

export const scoreAdjustments: Record<string, ScoreAdjustment> = {
  '極限ストイック整い型': { sets: 1,  saunaTemp: 2,  waterTemp: 2,  rest: 0,  subjective: -1 },
  'ディープストイック型':  { sets: 1,  saunaTemp: 1,  waterTemp: 1,  rest: 2,  subjective: 0  },
  'ハード整い型':          { sets: 2,  saunaTemp: 1,  waterTemp: 1,  rest: 0,  subjective: 0  },
  'コントロール整い型':    { sets: 1,  saunaTemp: 1,  waterTemp: 1,  rest: 1,  subjective: 0  },
  'ストイック寄りエンジョイ型': { sets: 0, saunaTemp: 1, waterTemp: 1, rest: 0, subjective: 1 },
  '完成度重視バランス型':  { sets: 1,  saunaTemp: 1,  waterTemp: 1,  rest: 1,  subjective: 1  },
  '安定整い型':            { sets: 0,  saunaTemp: 1,  waterTemp: 1,  rest: 1,  subjective: 1  },
  'ベーシック整い型':      { sets: 0,  saunaTemp: 0,  waterTemp: 0,  rest: 1,  subjective: 1  },
  '深リラックス型':        { sets: -1, saunaTemp: 0,  waterTemp: 0,  rest: 2,  subjective: 2  },
  'ゆる整い型':            { sets: -1, saunaTemp: 0,  waterTemp: 0,  rest: 1,  subjective: 2  },
  'マイルド整い型':        { sets: -1, saunaTemp: -1, waterTemp: 0,  rest: 1,  subjective: 2  },
  '瞑想サウナー型':        { sets: 0,  saunaTemp: 0,  waterTemp: 0,  rest: 2,  subjective: 1  },
  '没入整い型':            { sets: 0,  saunaTemp: 1,  waterTemp: 0,  rest: 2,  subjective: 1  },
  'サウナ満喫型':          { sets: 0,  saunaTemp: 0,  waterTemp: 0,  rest: 1,  subjective: 2  },
  '気分整い型':            { sets: 0,  saunaTemp: 0,  waterTemp: 0,  rest: 1,  subjective: 1  },
}

export const adjustmentMessages: Record<string, string> = {
  '極限ストイック整い型':    '高温サウナと冷たい水風呂の相性が、ととのいスコアに強く反映されやすいタイプです。',
  'ディープストイック型':    '強い刺激だけでなく、休憩中の深い没入感もスコアに反映されやすいタイプです。',
  'ハード整い型':            'セット構成やサウナの負荷が整うほど、スコアが伸びやすいタイプです。',
  'コントロール整い型':      'サウナ・水風呂・休憩の流れが整うほど、安定してスコアが出やすいタイプです。',
  'ストイック寄りエンジョイ型': '刺激の強さと体験の満足感が、どちらもスコアに反映されやすいタイプです。',
  '完成度重視バランス型':    'すべての要素がバランスよく整うことで、高いスコアが出やすいタイプです。',
  '安定整い型':              '無理のない流れで安定したサウナ体験ができると、スコアが伸びやすいタイプです。',
  'ベーシック整い型':        '基本的な気持ちよさと休憩の満足度が、スコアに反映されやすいタイプです。',
  '深リラックス型':          '休憩の深さと満足感が、ととのいスコアに強く反映されやすいタイプです。',
  'ゆる整い型':              '無理のない気持ちよさや、その日の満足感がスコアに出やすいタイプです。',
  'マイルド整い型':          '刺激の強さよりも、心地よさや安心感がスコアに反映されやすいタイプです。',
  '瞑想サウナー型':          '静けさや呼吸、内面の落ち着きがスコアに反映されやすいタイプです。',
  '没入整い型':              'サウナ中の没入感と休憩の深さが、スコアに反映されやすいタイプです。',
  'サウナ満喫型':            '施設の雰囲気や体験全体の満足度が、スコアに反映されやすいタイプです。',
  '気分整い型':              'その日の気分や体調に合っていたかどうかが、スコアに反映されやすいタイプです。',
}

const zeroAdjustment: ScoreAdjustment = { sets: 0, saunaTemp: 0, waterTemp: 0, rest: 0, subjective: 0 }

function clamp(score: number): number {
  return Math.max(0, Math.min(10, score))
}

export function applyScoreAdjustment(base: BaseScores, typeName: string | null): AdjustedScores {
  const adj: ScoreAdjustment = (typeName ? scoreAdjustments[typeName] : undefined) ?? zeroAdjustment
  const adjusted: BaseScores = {
    sets:       clamp(base.sets       + adj.sets),
    saunaTemp:  clamp(base.saunaTemp  + adj.saunaTemp),
    waterTemp:  clamp(base.waterTemp  + adj.waterTemp),
    rest:       clamp(base.rest       + adj.rest),
    subjective: clamp(base.subjective + adj.subjective),
  }
  return {
    ...adjusted,
    total: adjusted.sets + adjusted.saunaTemp + adjusted.waterTemp + adjusted.rest + adjusted.subjective,
  }
}
