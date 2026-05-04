import { redirect } from 'next/navigation'
import { requireAdminAuth } from '@/lib/admin-auth'

export default async function AdminPage() {
  await requireAdminAuth()
  redirect('/admin/facilities')
}
