import { RecordForm } from '@/components/RecordForm'

export default function RecordPage() {
  return (
    <div className="p-4 lg:p-6 max-w-xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white/90">記録する</h1>
        <p className="text-sm text-white/45 mt-0.5">今日のサウナ体験を記録しましょう。</p>
      </div>
      <RecordForm />
    </div>
  )
}
