export type TotonoiAnimalData = {
  typeName: string
  animalKey: string
  animalName: string
  illustrationPath: string
  emoji: string
  color: string
}

export const totonoiTypeList: TotonoiAnimalData[] = [
  {
    typeName: '極限ストイック整い型',
    animalKey: 'tiger',
    animalName: 'トラ',
    illustrationPath: '/images/totonoi-types/tiger.png',
    emoji: '🐯',
    color: '#f97316',
  },
  {
    typeName: 'ディープストイック型',
    animalKey: 'otter',
    animalName: 'カワウソ',
    illustrationPath: '/images/totonoi-types/otter.png',
    emoji: '🦦',
    color: '#78716c',
  },
  {
    typeName: 'ハード整い型',
    animalKey: 'wolf',
    animalName: 'オオカミ',
    illustrationPath: '/images/totonoi-types/wolf.png',
    emoji: '🐺',
    color: '#6b7280',
  },
  {
    typeName: 'コントロール整い型',
    animalKey: 'penguin',
    animalName: 'ペンギン',
    illustrationPath: '/images/totonoi-types/penguin.png',
    emoji: '🐧',
    color: '#38bdf8',
  },
  {
    typeName: 'ストイック寄りエンジョイ型',
    animalKey: 'shiba',
    animalName: '柴犬',
    illustrationPath: '/images/totonoi-types/shiba.png',
    emoji: '🐕',
    color: '#d97706',
  },
  {
    typeName: '完成度重視バランス型',
    animalKey: 'squirrel',
    animalName: 'リス',
    illustrationPath: '/images/totonoi-types/squirrel.png',
    emoji: '🐿️',
    color: '#b45309',
  },
  {
    typeName: '安定整い型',
    animalKey: 'panda',
    animalName: 'パンダ',
    illustrationPath: '/images/totonoi-types/panda.png',
    emoji: '🐼',
    color: '#4ade80',
  },
  {
    typeName: 'ベーシック整い型',
    animalKey: 'bear',
    animalName: 'クマ',
    illustrationPath: '/images/totonoi-types/bear.png',
    emoji: '🐻',
    color: '#92400e',
  },
  {
    typeName: '深リラックス型',
    animalKey: 'sloth',
    animalName: 'ナマケモノ',
    illustrationPath: '/images/totonoi-types/sloth.png',
    emoji: '🦥',
    color: '#65a30d',
  },
  {
    typeName: 'ゆる整い型',
    animalKey: 'rabbit',
    animalName: 'ウサギ',
    illustrationPath: '/images/totonoi-types/rabbit.png',
    emoji: '🐰',
    color: '#f9a8d4',
  },
  {
    typeName: 'マイルド整い型',
    animalKey: 'sheep',
    animalName: 'ヒツジ',
    illustrationPath: '/images/totonoi-types/sheep.png',
    emoji: '🐑',
    color: '#e2e8f0',
  },
  {
    typeName: '瞑想サウナー型',
    animalKey: 'fox',
    animalName: 'キツネ',
    illustrationPath: '/images/totonoi-types/fox.png',
    emoji: '🦊',
    color: '#ea580c',
  },
  {
    typeName: '没入整い型',
    animalKey: 'capybara',
    animalName: 'カピバラ',
    illustrationPath: '/images/totonoi-types/capybara.png',
    emoji: '🦫',
    color: '#a16207',
  },
  {
    typeName: 'サウナ満喫型',
    animalKey: 'tanuki',
    animalName: 'タヌキ',
    illustrationPath: '/images/totonoi-types/tanuki.png',
    emoji: '🦝',
    color: '#78350f',
  },
  {
    typeName: '気分整い型',
    animalKey: 'hedgehog',
    animalName: 'ハリネズミ',
    illustrationPath: '/images/totonoi-types/hedgehog.png',
    emoji: '🦔',
    color: '#92400e',
  },
]

export function getAnimalByTypeName(typeName: string): TotonoiAnimalData {
  return (
    totonoiTypeList.find(t => t.typeName === typeName) ?? {
      typeName,
      animalKey: 'bear',
      animalName: 'クマ',
      illustrationPath: '/images/totonoi-types/bear.png',
      emoji: '🐻',
      color: '#92400e',
    }
  )
}
