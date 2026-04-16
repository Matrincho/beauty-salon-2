import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { AccountStatus, UserRole } from './roles'

export type { ProfileNameSlice } from './profile-display'
export { profileDisplayName } from './profile-display'

export type ProfileResult = {
  id: string
  full_name: string | null
  first_name: string | null
  last_name: string | null
  phone_prefix: string | null
  phone_number: string | null
  address_line_1: string | null
  address_line_2: string | null
  city: string | null
  county: string | null
  postcode: string | null
  country: string | null
  avatar_url: string | null
  role: UserRole
  account_status: AccountStatus
}

export async function getCurrentUserProfile() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, profile: null }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      'id, full_name, first_name, last_name, phone_prefix, phone_number, address_line_1, address_line_2, city, county, postcode, country, avatar_url, role, account_status'
    )
    .eq('id', user.id)
    .single<ProfileResult>()

  return { user, profile: profile ?? null }
}

