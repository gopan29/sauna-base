import { SaunaCalendar } from '@/components/SaunaCalendar'
import { mockCalendarDays } from '@/lib/mock-data'

export default function CalendarPage() {
  return (
    <div className="p-4 lg:p-6 max-w-lg">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white/90">カレンダー</h1>
        <p className="text-sm text-white/45 mt-0.5">サウナに行った日・ととのった日を確認できます。</p>
      </div>
      <SaunaCalendar days={mockCalendarDays} year={2024} month={5} />
    </div>
  )
}
