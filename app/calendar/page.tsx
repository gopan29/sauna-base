import { SaunaCalendar } from '@/components/SaunaCalendar'
import { getMonthRecords } from '@/lib/actions'
import type { CalendarDay } from '@/types'

export default async function CalendarPage() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const records = await getMonthRecords(year, month)

  const daysInMonth = new Date(year, month, 0).getDate()
  const days: CalendarDay[] = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const record = records.find(r => r.date === dateStr)
    return {
      date: dateStr,
      visited: !!record,
      totonoied: record ? (record.score ?? 0) >= 40 : false,
      score: record?.score ?? undefined,
    }
  })

  return (
    <div className="p-4 lg:p-6 max-w-lg">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white/90">カレンダー</h1>
        <p className="text-sm text-white/45 mt-0.5">サウナに行った日・ととのった日を確認できます。</p>
      </div>
      <SaunaCalendar days={days} year={year} month={month} />
    </div>
  )
}
