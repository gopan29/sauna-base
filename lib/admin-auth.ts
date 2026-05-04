'use server'

import { cookies } from 'next/headers'
import crypto from 'crypto'
import { redirect } from 'next/navigation'

function getExpectedToken() {
  const secret = process.env.ADMIN_SECRET ?? 'sauna-base-admin-secret-key'
  const password = process.env.ADMIN_PASSWORD ?? ''
  return crypto.createHmac('sha256', secret).update(password).digest('hex')
}

export async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  return token === getExpectedToken()
}

export async function requireAdminAuth() {
  const ok = await verifyAdminAuth()
  if (!ok) redirect('/admin/login')
}

export async function adminLogin(password: string): Promise<{ error?: string }> {
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: 'パスワードが正しくありません' }
  }
  const cookieStore = await cookies()
  cookieStore.set('admin_token', getExpectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return {}
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
}
