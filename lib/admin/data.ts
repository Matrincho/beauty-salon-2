import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { AccountStatus, UserRole } from '@/lib/auth/roles'

export type AdminProfileRow = {
  id: string
  email: string | null
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
  role: UserRole
  account_status: AccountStatus
  created_at: string
}

export type AdminBookingSessionType = {
  id: string
  title: string
  slug: string
  duration_minutes: number
  base_price: number
  currency: string
}

export type AdminBookingStaff = {
  id: string
  display_name: string
}

export type AdminBookingClient = {
  id: string
  email: string | null
  full_name: string | null
  first_name: string | null
  last_name: string | null
  phone_prefix: string | null
  phone_number: string | null
  role: UserRole
  account_status: AccountStatus
}

export type AdminBookingRow = {
  id: string
  status: string
  starts_at: string
  ends_at: string
  price_final: number
  price_override: boolean
  admin_note: string | null
  internal_note: string | null
  cancelled_at: string | null
  cancel_reason: string | null
  created_at: string
  client: AdminBookingClient | null
  session_type: AdminBookingSessionType | null
  staff: AdminBookingStaff | null
}

/** Shared select for admin booking lists (joins). */
const ADMIN_BOOKINGS_LIST_SELECT = `
      id,
      status,
      starts_at,
      ends_at,
      price_final,
      price_override,
      admin_note,
      internal_note,
      cancelled_at,
      cancel_reason,
      created_at,
      client:profiles!bookings_client_id_fkey (
        id,
        email,
        full_name,
        first_name,
        last_name,
        phone_prefix,
        phone_number,
        role,
        account_status
      ),
      session_type:session_types!bookings_session_type_id_fkey (
        id,
        title,
        slug,
        duration_minutes,
        base_price,
        currency
      ),
      staff:staff_members!bookings_staff_member_id_fkey (
        id,
        display_name
      )
    `

export async function fetchAdminProfiles(): Promise<{
  data: AdminProfileRow[] | null
  error: string | null
}> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('profiles')
    .select(
      `
      id,
      email,
      full_name,
      first_name,
      last_name,
      phone_prefix,
      phone_number,
      address_line_1,
      address_line_2,
      city,
      county,
      postcode,
      country,
      role,
      account_status,
      created_at
    `
    )
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: error.message }
  }
  return { data: (data as AdminProfileRow[]) ?? [], error: null }
}

export async function fetchAdminBookings(): Promise<{
  data: AdminBookingRow[] | null
  error: string | null
}> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('bookings')
    .select(ADMIN_BOOKINGS_LIST_SELECT)
    .order('starts_at', { ascending: false })

  if (error) {
    return { data: null, error: error.message }
  }
  return { data: (data as AdminBookingRow[]) ?? [], error: null }
}

/** Pending or confirmed bookings whose end time has not passed (pipeline / “active”). */
export async function fetchAdminActiveSessionsBookings(): Promise<{
  data: AdminBookingRow[] | null
  error: string | null
}> {
  const supabase = await createSupabaseServerClient()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('bookings')
    .select(ADMIN_BOOKINGS_LIST_SELECT)
    .in('status', ['pending', 'confirmed'])
    .gte('ends_at', now)
    .order('starts_at', { ascending: true })
    .limit(100)

  if (error) {
    return { data: null, error: error.message }
  }
  return { data: (data as AdminBookingRow[]) ?? [], error: null }
}

export type AdminDashboardStats = {
  clientProfilesCount: number
  totalBookings: number
  pendingBookings: number
  completedRevenue: number
  revenueCurrency: string
  activeSessionTypes: number
  upcomingSessions: number
}

export async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = await createSupabaseServerClient()
  const now = new Date().toISOString()

  const [
    { count: clientProfilesCount },
    { count: totalBookings },
    { count: pendingBookings },
    { data: completedRows },
    { count: activeSessionTypes },
    { count: upcomingSessions },
    { data: currencyRow },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'client'),
    supabase.from('bookings').select('id', { count: 'exact', head: true }),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('bookings').select('price_final').eq('status', 'completed'),
    supabase
      .from('session_types')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .gte('starts_at', now)
      .in('status', ['pending', 'confirmed']),
    supabase.from('session_types').select('currency').limit(1).maybeSingle(),
  ])

  const completedRevenue = (completedRows ?? []).reduce(
    (sum, row) => sum + Number(row.price_final),
    0
  )

  const revenueCurrency =
    typeof currencyRow?.currency === 'string' && currencyRow.currency.length === 3
      ? currencyRow.currency
      : 'BGN'

  return {
    clientProfilesCount: clientProfilesCount ?? 0,
    totalBookings: totalBookings ?? 0,
    pendingBookings: pendingBookings ?? 0,
    completedRevenue,
    revenueCurrency,
    activeSessionTypes: activeSessionTypes ?? 0,
    upcomingSessions: upcomingSessions ?? 0,
  }
}

export type DashboardUpcomingRow = {
  id: string
  status: string
  starts_at: string
  client: AdminBookingClient | null | AdminBookingClient[]
  session_type: { title: string } | null | { title: string }[]
}

export async function fetchUpcomingBookingsForDashboard(
  limit: number
): Promise<{ data: DashboardUpcomingRow[]; error: string | null }> {
  const supabase = await createSupabaseServerClient()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      id,
      status,
      starts_at,
      client:profiles!bookings_client_id_fkey (
        id,
        email,
        full_name,
        first_name,
        last_name
      ),
      session_type:session_types!bookings_session_type_id_fkey (title)
    `
    )
    .gte('starts_at', now)
    .in('status', ['pending', 'confirmed'])
    .order('starts_at', { ascending: true })
    .limit(limit)

  if (error) {
    return { data: [], error: error.message }
  }
  return { data: (data as DashboardUpcomingRow[]) ?? [], error: null }
}

export type AuditLogLine = {
  id: number
  action: string
  entity_type: string
  entity_id: string
  created_at: string
}

export async function fetchRecentAuditLines(
  limit: number
): Promise<{ data: AuditLogLine[]; error: string | null }> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('audit_logs')
    .select('id, action, entity_type, entity_id, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return { data: [], error: error.message }
  }
  return { data: (data as AuditLogLine[]) ?? [], error: null }
}
