import { requireAdminAuth } from '@/lib/admin-auth'
import { adminGetUsers } from '@/lib/admin-actions'
import { UserManager } from './UserManager'

export default async function AdminUsersPage() {
  await requireAdminAuth()
  const users = await adminGetUsers()
  return <UserManager initialUsers={users} />
}
