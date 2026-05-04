import type { Question } from '@/types/sauna-base'

export const questions: Question[] = [
  {
    id: 1,
    text: '好きなサウナ温度は？',
    options: [
      { id: 'A', text: '80〜90℃くらいがちょうどいい', contributions: { heat: 'B' } },
      { id: 'B', text: '90〜100℃くらいの熱さが好き', contributions: { heat: 'H' } },
      { id: 'C', text: '100℃以上、最上段、強めが好き', contributions: { heat: 'E' } },
    ],
  },
  {
    id: 2,
    text: 'サウナ室ではどの位置が好き？',
    options: [
      { id: 'A', text: '中段〜下段でじっくり', contributions: { heat: 'B', style: 'F' } },
      { id: 'B', text: '上段でしっかり汗をかきたい', contributions: { heat: 'H', style: 'R' } },
      { id: 'C', text: '最上段で限界に近い熱さを楽しむ', contributions: { heat: 'E', style: 'P' } },
    ],
  },
  {
    id: 3,
    text: '水風呂の好みは？',
    options: [
      { id: 'A', text: '18℃以上の入りやすい水風呂', contributions: { water: 'S' } },
      { id: 'B', text: '14〜17℃くらいの冷たい水風呂', contributions: { water: 'C' } },
      { id: 'C', text: 'シングル〜13℃台のキンキン水風呂', contributions: { water: 'I' } },
    ],
  },
  {
    id: 4,
    text: '水風呂の入り方は？',
    options: [
      { id: 'A', text: '無理せず短めに入る', contributions: { water: 'S', style: 'F' } },
      { id: 'B', text: 'ある程度決めた時間入る', contributions: { water: 'C', style: 'R' } },
      { id: 'C', text: 'しっかり冷やし切るまで入る', contributions: { water: 'I', style: 'P' } },
    ],
  },
  {
    id: 5,
    text: 'サウナで一番大事にしたいことは？',
    options: [
      { id: 'A', text: '癒し・リラックス', contributions: { mind: 'C' } },
      { id: 'B', text: 'しっかりととのうこと', contributions: { mind: 'F' } },
      { id: 'C', text: '無心・没入・深い感覚', contributions: { mind: 'D' } },
    ],
  },
  {
    id: 6,
    text: '休憩中の過ごし方は？',
    options: [
      { id: 'A', text: '風や景色を楽しみながらゆっくり', contributions: { mind: 'C', style: 'F' } },
      { id: 'B', text: '呼吸や体感を意識して休む', contributions: { mind: 'F', style: 'R' } },
      { id: 'C', text: '目を閉じて意識が落ちる感覚を楽しむ', contributions: { mind: 'D', style: 'P' } },
    ],
  },
  {
    id: 7,
    text: 'セット数の決め方は？',
    options: [
      { id: 'A', text: 'その日の気分で決める', contributions: { style: 'F' } },
      { id: 'B', text: 'だいたい2〜3セットで決めている', contributions: { style: 'R' } },
      { id: 'C', text: 'セット数・時間をきっちり管理する', contributions: { style: 'P' } },
    ],
  },
  {
    id: 8,
    text: 'サウナに行く目的は？',
    options: [
      { id: 'A', text: '疲れを癒したい', contributions: { mind: 'C' } },
      { id: 'B', text: 'コンディションを整えたい', contributions: { mind: 'F' } },
      { id: 'C', text: '自分を追い込みたい・深く入りたい', contributions: { mind: 'D', style: 'P' } },
    ],
  },
  {
    id: 9,
    text: '好きな施設タイプは？',
    options: [
      { id: 'A', text: '雰囲気が良くてゆっくりできる施設', contributions: { mind: 'C', heat: 'B' } },
      { id: 'B', text: '温度・水風呂・外気浴のバランスが良い施設', contributions: { mind: 'F', heat: 'H', water: 'C' } },
      { id: 'C', text: '熱さや水風呂に尖りがある施設', contributions: { heat: 'E', water: 'I' } },
    ],
  },
  {
    id: 10,
    text: '理想のサウナ体験は？',
    options: [
      { id: 'A', text: '気持ちよくリラックスできること', contributions: { mind: 'C', style: 'F' } },
      { id: 'B', text: 'サウナ・水風呂・休憩の流れが気持ちよく決まること', contributions: { mind: 'F', style: 'R' } },
      { id: 'C', text: '強い熱と冷たさで深くととのうこと', contributions: { heat: 'E', water: 'I', mind: 'D', style: 'P' } },
    ],
  },
]
