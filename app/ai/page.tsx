import { Sparkles, MapPin, TrendingUp, Thermometer, Droplets, RefreshCw, Leaf } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'
import { getAllRecordsRaw, getSaunaProfileData } from '@/lib/actions'
import { adjustmentMessages } from '@/lib/sauna-base/scoreAdjustments'

function mode<T>(arr: T[]): T | null {
  if (!arr.length) return null
  const freq = new Map<T, number>()
  for (const v of arr) freq.set(v, (freq.get(v) ?? 0) + 1)
  return [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

const STATIC_RECS = [
  {
    id: '1',
    name: '湯らっくす',
    location: '熊本県熊本市',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
    tags: ['外気浴', '高温サウナ', '水風呂16℃'],
    reason: '全国的にも評価の高いサウナ。整いを極めたいあなたにぴったり。',
  },
  {
    id: '2',
    name: 'サウナしきじ',
    location: '静岡県静岡市',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop',
    tags: ['天然水', '聖地', '水風呂'],
    reason: '「サウナの聖地」として知られる名施設。一度は訪れる価値あり。',
  },
  {
    id: '3',
    name: 'かるまる池袋',
    location: '東京都豊島区',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
    tags: ['岩サウナ', '都心', '複合施設'],
    reason: '都心でアクセス良好。多彩なサウナ体験が楽しめる人気施設。',
  },
]

export default async function AIPage() {
  const [records, saunaProfile] = await Promise.all([
    getAllRecordsRaw(),
    getSaunaProfileData(),
  ])

  const typeName = (saunaProfile as { type_name?: string | null } | null)?.type_name ?? null
  const totonoiCode = (saunaProfile as { totonoi_code?: string | null } | null)?.totonoi_code ?? null
  const adjustmentMsg = typeName ? adjustmentMessages[typeName] ?? null : null

  const hasRecords = records.length > 0
  const highScoreRecs = records.filter(r => (r.score ?? 0) >= 40)

  const bestSaunaTemp = highScoreRecs.length
    ? `${Math.round(highScoreRecs.reduce((a, r) => a + r.sauna_temp, 0) / highScoreRecs.length)}℃前後`
    : records.length ? `${Math.round(records.reduce((a, r) => a + r.sauna_temp, 0) / records.length)}℃前後` : '-'

  const bestWaterTemp = highScoreRecs.length
    ? `${Math.round(highScoreRecs.reduce((a, r) => a + r.water_temp, 0) / highScoreRecs.length * 10) / 10}℃前後`
    : records.length ? `${Math.round(records.reduce((a, r) => a + r.water_temp, 0) / records.length * 10) / 10}℃前後` : '-'

  const bestSets = highScoreRecs.length
    ? Math.round(highScoreRecs.reduce((a, r) => a + r.sets, 0) / highScoreRecs.length)
    : records.length ? Math.round(records.reduce((a, r) => a + r.sets, 0) / records.length) : 3

  const restMode = mode(highScoreRecs.map(r => r.rest_style)) ?? mode(records.map(r => r.rest_style))
  const restLabel = { outdoor: '外気浴', indoor: '内気浴', rest_only: '休憩のみ', none: 'なし' }
  const bestRestStyle = restMode ? (restLabel[restMode as keyof typeof restLabel] ?? restMode) : '外気浴'

  const conditionScore = records.length
    ? Math.round(records.filter(r => (r.score ?? 0) >= 40).length / records.length * 100)
    : 0

  const bestDayOfWeek = mode(highScoreRecs.map(r => new Date(r.date).getDay()))
  const bestDays = bestDayOfWeek !== null
    ? [DAY_LABELS[bestDayOfWeek], DAY_LABELS[(bestDayOfWeek + 2) % 7]]
    : ['土', '日']

  const bestTendency = `${bestSaunaTemp}サウナ × ${bestWaterTemp}水風呂`

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#7cb342]" />
          <h1 className="text-xl font-bold text-white/90">AIレコメンド</h1>
        </div>
        <p className="text-sm text-white/45 mt-0.5">あなたの記録データからパターンを分析します。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* TOTONOI CODE カード */}
        {totonoiCode && typeName && (
          <div
            className="rounded-2xl p-4 lg:col-span-2"
            style={{ background: 'rgba(165,214,58,0.07)', border: '1px solid rgba(165,214,58,0.25)' }}
          >
            <p className="text-[10px] text-[#a5d63a]/70 tracking-widest uppercase mb-1">YOUR TYPE</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xl font-bold text-[#a5d63a] tracking-wider">{totonoiCode}</span>
              <span className="text-sm font-semibold text-white/70">{typeName}</span>
            </div>
            {adjustmentMsg && (
              <p className="text-xs text-white/50 leading-relaxed">{adjustmentMsg}</p>
            )}
          </div>
        )}

        {/* ベスト傾向 */}
        <GlassCard className="p-4">
          <h2 className="text-sm font-semibold text-white/80 mb-3">あなたのベスト傾向</h2>
          {hasRecords ? (
            <>
              <p className="text-center text-xs text-white/50 mb-3">
                あなたは<span className="text-[#a5d63a] font-semibold">「{bestTendency}」</span>
                <br />の組み合わせでととのいやすい傾向です
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Thermometer, label: 'ベストサウナ温度',   value: bestSaunaTemp },
                  { icon: Droplets,    label: 'ベスト水風呂温度',   value: bestWaterTemp },
                  { icon: RefreshCw,   label: 'ベストセット数',     value: `${bestSets}セット` },
                  { icon: Leaf,        label: 'ベスト休憩スタイル', value: bestRestStyle },
                ].map(item => (
                  <div key={item.label} className="glass rounded-xl p-2.5 text-center">
                    <item.icon className="w-4 h-4 mx-auto mb-0.5 text-[#a5d63a]" />
                    <p className="text-[9px] text-white/40">{item.label}</p>
                    <p className="text-xs font-semibold text-[#a5d63a]">{item.value}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-white/40 text-center py-4">
              記録が増えると傾向が分析されます
            </p>
          )}
        </GlassCard>

        {/* コンディション分析 */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-[#7cb342]" />
            <h2 className="text-sm font-semibold text-white/80">コンディション分析</h2>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#7cb342" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - conditionScore / 100)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-[#a5d63a]">{conditionScore}%</span>
                </div>
              </div>
              <p className="text-[9px] text-white/35 mt-1">スコア40点以上の割合</p>
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <p className="text-[9px] text-white/40">ととのいやすい曜日</p>
                <div className="flex gap-1 mt-0.5">
                  {bestDays.map(d => (
                    <span key={d} className="text-[10px] px-1.5 py-0.5 rounded-md text-[#a5d63a]"
                      style={{ background: 'rgba(124,179,66,0.15)', border: '1px solid rgba(124,179,66,0.3)' }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] text-white/40">分析対象の記録数</p>
                <p className="text-xs text-white/60 mt-0.5">{records.length}件 / 高スコア {highScoreRecs.length}件</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* おすすめサウナ */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-white/70 mb-3">おすすめのサウナ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {STATIC_RECS.map(r => (
              <GlassCard key={r.id} className="p-3">
                <div className="w-full h-28 rounded-xl overflow-hidden mb-3">
                  <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-start gap-1 mb-1">
                  <Sparkles className="w-3 h-3 text-[#7cb342] mt-0.5 shrink-0" />
                  <p className="text-[10px] text-[#7cb342] font-medium">おすすめ</p>
                </div>
                <p className="text-sm font-semibold text-white/85 mb-0.5">{r.name}</p>
                <div className="flex items-center gap-1 text-[10px] text-white/40 mb-2">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>{r.location}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {r.tags.map(t => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full text-[#a5d63a]"
                      style={{ background: 'rgba(124,179,66,0.12)', border: '1px solid rgba(124,179,66,0.25)' }}>
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed">{r.reason}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
