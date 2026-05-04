import { Sparkles, MapPin, TrendingUp, Thermometer, Droplets, RefreshCw, Leaf } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'
import { mockAIAnalysis } from '@/lib/mock-data'

export default function AIPage() {
  const a = mockAIAnalysis

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
        {/* あなたのベスト傾向 */}
        <GlassCard className="p-4">
          <h2 className="text-sm font-semibold text-white/80 mb-3">あなたのベスト傾向</h2>
          <p className="text-center text-xs text-white/50 mb-3">
            あなたは<span className="text-[#a5d63a] font-semibold">「{a.bestTendency}」</span>
            <br />の組み合わせでととのいやすい傾向です
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Thermometer, label: 'ベストサウナ温度', value: a.bestSaunaTemp },
              { icon: Droplets,    label: 'ベスト水風呂温度', value: a.bestWaterTemp },
              { icon: RefreshCw,   label: 'ベストセット数',   value: `${a.bestSets}セット` },
              { icon: Leaf,        label: 'ベスト体験スタイル', value: '外気浴（長め）' },
            ].map(item => (
              <div key={item.label} className="glass rounded-xl p-2.5 text-center">
                <item.icon className="w-4 h-4 mx-auto mb-0.5 text-[#a5d63a]" />
                <p className="text-[9px] text-white/40">{item.label}</p>
                <p className="text-xs font-semibold text-[#a5d63a]">{item.value}</p>
              </div>
            ))}
          </div>
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
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - a.conditionScore / 100)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-[#a5d63a]">{a.conditionScore}%</span>
                </div>
              </div>
              <p className="text-[9px] text-[#a5d63a] mt-1">先月比 +8%↑</p>
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <p className="text-[9px] text-white/40">ベストコンディション時間帯</p>
                <p className="text-xs text-white/70">{a.bestTimeSlot}</p>
              </div>
              <div>
                <p className="text-[9px] text-white/40">ととのいやすい曜日</p>
                <div className="flex gap-1 mt-0.5">
                  {a.bestDays.map(d => (
                    <span key={d} className="text-[10px] px-1.5 py-0.5 rounded-md text-[#a5d63a]"
                      style={{ background: 'rgba(124,179,66,0.15)', border: '1px solid rgba(124,179,66,0.3)' }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] text-white/40">ベストなサウナ条件</p>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {a.bestConditions.map(c => (
                    <span key={c} className="text-[9px] px-1.5 py-0.5 rounded-md text-white/50"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* おすすめサウナ一覧 */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-white/70 mb-3">あなたにおすすめのサウナ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {a.recommendations.map(r => (
              <GlassCard key={r.id} className="p-3">
                <div className="w-full h-28 rounded-xl overflow-hidden mb-3">
                  <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-start gap-1 mb-1">
                  <Sparkles className="w-3 h-3 text-[#7cb342] mt-0.5 shrink-0" />
                  <p className="text-[10px] text-[#7cb342] font-medium">AIレコメンド</p>
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

        {/* 今週のハイライト */}
        <GlassCard className="p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-white/80 mb-2">今週のハイライト</h2>
          <p className="text-sm text-white/60">{a.weeklyHighlight}</p>
        </GlassCard>
      </div>
    </div>
  )
}
