'use server'

import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/database'

type SaunaRecordInsert = Database['sauna']['Tables']['sauna_records']['Insert']

export async function getUserAndProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, profile: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const displayName =
    (profile as { display_name: string | null } | null)?.display_name
    ?? (user.user_metadata?.display_name as string | undefined)
    ?? null

  return { user, profile, displayName }
}

export async function saveRecord(data: Omit<SaunaRecordInsert, 'user_id'>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('sauna_records')
    .insert({ ...data, user_id: user.id })

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/stats')
  revalidatePath('/calendar')
  return { success: true }
}

export async function getRecords(limit = 20) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('sauna_records')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(limit)

  return data ?? []
}

export async function getMonthRecords(year: number, month: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const from = `${year}-${String(month).padStart(2, '0')}-01`
  const to = `${year}-${String(month).padStart(2, '0')}-31`

  const { data } = await supabase
    .from('sauna_records')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: true })

  return data ?? []
}

export async function searchFacilities(query: string) {
  if (!query.trim()) return []
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('sauna_facilities')
    .select('id, name, address, prefecture, city')
    .ilike('name', `%${query}%`)
    .order('record_count', { ascending: false })
    .limit(8)
  return data ?? []
}

export async function addFacility(name: string, prefecture?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase
    .from('sauna_facilities')
    .insert({
      name,
      prefecture: prefecture ?? null,
      status: user ? 'pending' : 'pending',
      source: 'user',
    })
    .select('id, name')
    .single()
  return data
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
}

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}

export async function saveProfileType(typeName: string, totonoiCode: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('sauna_profiles')
    .upsert(
      { user_id: user.id, type_name: typeName, totonoi_code: totonoiCode, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )

  if (error) return { error: error.message }
  return { success: true }
}

export async function getSaunaProfileData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('sauna_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return data
}

export async function getAllRecordsRaw() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('sauna_records')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  return data ?? []
}

export async function getUserTypeName(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('sauna_profiles')
    .select('type_name')
    .eq('user_id', user.id)
    .single()

  return (data as { type_name: string | null } | null)?.type_name ?? null
}
