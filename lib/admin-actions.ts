'use server'

import { createAdminClient } from './supabase-admin'
import { requireAdminAuth } from './admin-auth'
import { revalidatePath } from 'next/cache'

type FacilityRow = {
  id: string
  name: string
  address: string | null
  lat: number | null
  lng: number | null
  prefecture: string | null
  city: string | null
  status: string
  record_count: number
  avg_sauna_temp: number | null
  avg_water_temp: number | null
  source: string
  osm_id: number | null
  created_at: string
}

export async function adminGetFacilities({
  search = '',
  prefecture = 'all',
  status = 'all',
  page = 0,
  pageSize = 50,
}: {
  search?: string
  prefecture?: string
  status?: string
  page?: number
  pageSize?: number
}): Promise<{ data: FacilityRow[]; count: number }> {
  await requireAdminAuth()
  const supabase = createAdminClient()

  let query = supabase
    .from('sauna_facilities')
    .select('*', { count: 'exact' })
    .order('prefecture', { ascending: true })
    .order('name', { ascending: true })
    .range(page * pageSize, (page + 1) * pageSize - 1)

  if (search.trim()) query = query.ilike('name', `%${search.trim()}%`)
  if (prefecture !== 'all') query = query.eq('prefecture', prefecture)
  if (status !== 'all') query = query.eq('status', status)

  const { data, count } = await query
  return { data: (data ?? []) as FacilityRow[], count: count ?? 0 }
}

export async function adminUpdateFacility(
  id: string,
  updates: Partial<Pick<FacilityRow, 'name' | 'address' | 'prefecture' | 'city' | 'status'>>
): Promise<{ error?: string }> {
  await requireAdminAuth()
  const supabase = createAdminClient()
  const { error } = await supabase.from('sauna_facilities').update(updates).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/facilities')
  return {}
}

export async function adminDeleteFacility(id: string): Promise<{ error?: string }> {
  await requireAdminAuth()
  const supabase = createAdminClient()
  const { error } = await supabase.from('sauna_facilities').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/facilities')
  return {}
}

export async function adminCreateFacility(data: {
  name: string
  address?: string | null
  prefecture?: string | null
  city?: string | null
}): Promise<{ data?: FacilityRow; error?: string }> {
  await requireAdminAuth()
  const supabase = createAdminClient()
  const { data: result, error } = await supabase
    .from('sauna_facilities')
    .insert({ ...data, status: 'confirmed', source: 'manual' })
    .select()
    .single()
  if (error) return { error: error.message }
  revalidatePath('/admin/facilities')
  return { data: result as FacilityRow }
}

export type UserRow = {
  id: string
  email: string
  displayName: string | null
  createdAt: string
  lastSignInAt: string | null
  typeName: string | null
  totonoiCode: string | null
  recordCount: number
}

export async function adminGetUsers(): Promise<UserRow[]> {
  await requireAdminAuth()
  const supabase = createAdminClient()

  const [{ data: authData }, { data: profiles }, { data: saunaProfiles }, { data: recordData }] = await Promise.all([
    supabase.auth.admin.listUsers({ perPage: 1000 }),
    supabase.from('profiles').select('id, display_name'),
    supabase.from('sauna_profiles').select('user_id, type_name, totonoi_code'),
    supabase.from('sauna_records').select('user_id'),
  ])

  const profileMap = new Map((profiles ?? []).map(p => [p.id, p.display_name as string | null]))
  const saunaProfileMap = new Map((saunaProfiles ?? []).map(p => [p.user_id, p]))
  const recordCountMap = new Map<string, number>()
  for (const r of (recordData ?? [])) {
    recordCountMap.set(r.user_id, (recordCountMap.get(r.user_id) ?? 0) + 1)
  }

  return (authData?.users ?? [])
    .map(u => ({
      id: u.id,
      email: u.email ?? '',
      displayName: profileMap.get(u.id) ?? null,
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at ?? null,
      typeName: (saunaProfileMap.get(u.id) as { type_name?: string | null } | undefined)?.type_name ?? null,
      totonoiCode: (saunaProfileMap.get(u.id) as { totonoi_code?: string | null } | undefined)?.totonoi_code ?? null,
      recordCount: recordCountMap.get(u.id) ?? 0,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function adminGetPrefectures(): Promise<string[]> {
  await requireAdminAuth()
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('sauna_facilities')
    .select('prefecture')
    .not('prefecture', 'is', null)
  const prefs = [...new Set((data ?? []).map((r) => r.prefecture as string))].sort()
  return prefs
}
