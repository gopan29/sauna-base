import { requireAdminAuth } from '@/lib/admin-auth'
import { adminGetFacilities, adminGetPrefectures } from '@/lib/admin-actions'
import { FacilityManager } from './FacilityManager'

export default async function AdminFacilitiesPage() {
  await requireAdminAuth()

  const [{ data: facilities, count }, prefectures] = await Promise.all([
    adminGetFacilities({ pageSize: 50 }),
    adminGetPrefectures(),
  ])

  return <FacilityManager initialFacilities={facilities} initialCount={count} prefectures={prefectures} />
}
