import type { Question } from '@/types/sauna-base'

export const questions: Question[] = [
  {
    id: 1,
    displayNumber: 1,
    text: 'サウナの熱さ、どれが一番しっくりくる？',
    options: [
      { id: 'A', text: '80〜90℃くらいでゆっくり入る', contributions: { heat: 'B' } },
      { id: 'B', text: '90〜100℃くらいでしっかり入る', contributions: { heat: 'H' } },
      { id: 'C', text: '100℃を超えるような高温サウナで汗を出したい', contributions: { heat: 'E' } },
    ],
  },
  {
    id: 2,
    displayNumber: 2,
    text: 'サウナ室ではどの位置にいることが多い？',
    options: [
      { id: 'A', text: '下段〜中段で8〜12分', contributions: { heat: 'B', style: 'F' } },
      { id: 'B', text: '上段で6〜10分', contributions: { heat: 'H', style: 'R' } },
      { id: 'C', text: '最上段で短時間集中', contributions: { heat: 'E', style: 'P' } },
    ],
  },
  {
    id: 3,
    displayNumber: 3,
    text: '水風呂の好みは？',
    options: [
      { id: 'A', text: '18〜22℃くらいでゆっくり入れる方がいい', contributions: { water: 'S' } },
      { id: 'B', text: '14〜17℃くらいの冷たさがちょうどいい', contributions: { water: 'C' } },
      { id: 'C', text: '10℃前後やシングルでキンキンが気持ちいい', contributions: { water: 'I' } },
    ],
  },
  {
    id: 4,
    displayNumber: 4,
    text: '水風呂にはどれくらい入る？',
    options: [
      { id: 'A', text: '30秒〜1分くらいでサッと出る', contributions: { water: 'S', style: 'F' } },
      { id: 'B', text: '1〜2分くらいでちょうどよく冷やす', contributions: { water: 'C', style: 'R' } },
      { id: 'C', text: '2分以上、しっかり冷えきるまで入る', contributions: { water: 'I', style: 'P' } },
      { id: 'D', text: '水風呂は入らず、シャワーや休憩で整える', contributions: { water: 'S', mind: 'C' } },
    ],
  },
  {
    id: 5,
    displayNumber: 5,
    text: 'サウナで一番大事にしたいのは？',
    options: [
      { id: 'A', text: 'リラックス・気持ちよさ', contributions: { mind: 'C' } },
      { id: 'B', text: 'しっかり"ととのう"こと', contributions: { mind: 'F' } },
      { id: 'C', text: '深く意識が落ちる感覚（トリップ感）', contributions: { mind: 'D' } },
      { id: 'D', text: '友達との時間を楽しみたい', contributions: { mind: 'C', style: 'F' } },
    ],
  },
  {
    id: 6,
    displayNumber: 6,
    text: '休憩（外気浴）はどんな感じ？',
    options: [
      { id: 'A', text: '5〜10分くらい、風を感じてゆっくり', contributions: { mind: 'C', style: 'F' } },
      { id: 'B', text: '8〜12分くらい、呼吸や体感を意識', contributions: { mind: 'F', style: 'R' } },
      { id: 'C', text: '10分以上、深く入り込む感覚を楽しむ', contributions: { mind: 'D', style: 'P' } },
      { id: 'D', text: 'さくっと5分以内が多い', contributions: { style: 'F', mind: 'F' } },
    ],
  },
  {
    id: 7,
    displayNumber: 7,
    text: '1回で何セットくらい？',
    options: [
      { id: 'A', text: '1〜2セット（無理しない）', contributions: { style: 'F' } },
      { id: 'B', text: '2〜3セット（安定）', contributions: { style: 'R' } },
      { id: 'C', text: '3セット以上（しっかりやる）', contributions: { style: 'P' } },
    ],
  },
  {
    id: 8,
    displayNumber: 8,
    text: 'サウナの入り方は？',
    options: [
      { id: 'A', text: 'その日の体調や気分で変える', contributions: { style: 'F' } },
      { id: 'B', text: 'だいたい同じ流れで入る', contributions: { style: 'R' } },
      { id: 'C', text: '時間やセットをしっかり管理する', contributions: { style: 'P' } },
      { id: 'D', text: '誰かと一緒に楽しむことが多い', contributions: { mind: 'C', style: 'F' } },
    ],
  },
  {
    id: 9,
    displayNumber: 9,
    text: 'どんな施設が好き？',
    options: [
      { id: 'A', text: '静かでゆっくりできる、長くいられる場所', contributions: { mind: 'C', heat: 'B' } },
      { id: 'B', text: '温度・水風呂・外気浴がバランス良い', contributions: { mind: 'F', heat: 'H', water: 'C' } },
      { id: 'C', text: '熱さや水風呂に特徴がある施設', contributions: { heat: 'E', water: 'I' } },
      { id: 'D', text: '話題のサウナや有名な施設に行きたい', contributions: { mind: 'C', style: 'F' } },
    ],
  },
  {
    id: 10,
    displayNumber: 10,
    text: '理想のサウナ体験は？',
    options: [
      { id: 'A', text: 'じんわり気持ちよくリラックス', contributions: { mind: 'C', style: 'F' } },
      { id: 'B', text: '流れがハマってしっかりととのう', contributions: { mind: 'F', style: 'R' } },
      { id: 'C', text: '強い熱と冷たさで深く落ちる', contributions: { heat: 'E', water: 'I', mind: 'D', style: 'P' } },
    ],
  },
  {
    id: 11,
    displayNumber: 12,
    text: '休憩スペースのこだわりは？',
    options: [
      { id: 'A', text: 'とりあえず座れればOK', contributions: { mind: 'F' } },
      { id: 'B', text: '外気浴・椅子は重要', contributions: { mind: 'C' } },
      { id: 'C', text: 'インフィニティチェアなどこだわる', contributions: { mind: 'D' } },
    ],
  },
  {
    id: 12,
    displayNumber: 13,
    text: 'どっちのサウナが好き？',
    options: [
      { id: 'A', text: 'スーパー銭湯・温浴施設', contributions: { style: 'F', mind: 'C' } },
      { id: 'B', text: 'プライベートサウナ・専門施設', contributions: { style: 'P', mind: 'D' } },
    ],
  },
  {
    id: 13,
    displayNumber: 14,
    text: 'サウナ後の楽しみは？',
    options: [
      { id: 'A', text: 'そのまま帰る or 休む', contributions: { mind: 'F' } },
      { id: 'B', text: '軽く何か食べる・飲む', contributions: { mind: 'C' } },
      { id: 'C', text: 'サ飯やお酒も含めて楽しむ', contributions: { mind: 'C', style: 'F' } },
    ],
  },
  {
    id: 14,
    displayNumber: 15,
    text: 'サウナは誰と行く？',
    options: [
      { id: 'A', text: '一人で行くことが多い', contributions: { mind: 'D' } },
      { id: 'B', text: '一人でも友達・誰かと行くこともある', contributions: { mind: 'F' } },
      { id: 'C', text: '友達・誰かと行くことが多い', contributions: { mind: 'C', style: 'F' } },
    ],
  },
]
