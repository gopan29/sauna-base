export function DiagnosisProgress({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
        <span>Q{current} / {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.12)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #a5d63a 0%, #7cb342 100%)',
            boxShadow: '0 0 8px rgba(165,214,58,0.6)',
          }}
        />
      </div>
    </div>
  )
}
