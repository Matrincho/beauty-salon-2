/**
 * Seeds staff + session catalog (if missing) and a handful of test bookings
 * for the two client profiles (by email). Run from repo root:
 *   node --env-file=.env.local scripts/seed-admin-test-bookings.mjs
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const CLIENT_EMAILS = ['test_client@gmail.com', 'test_client2@gmail.com']

async function main() {
  const { data: profiles, error: pe } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('role', 'client')
    .in('email', CLIENT_EMAILS)

  if (pe) throw pe
  if (!profiles?.length) {
    console.error('No client profiles found for:', CLIENT_EMAILS.join(', '))
    process.exit(1)
  }

  let staffId
  const { data: existingStaff } = await supabase.from('staff_members').select('id').eq('is_active', true).limit(1).maybeSingle()
  if (existingStaff?.id) {
    staffId = existingStaff.id
  } else {
    const { data: inserted, error: se } = await supabase
      .from('staff_members')
      .insert({ display_name: 'House stylist', title: 'Senior stylist', is_active: true })
      .select('id')
      .single()
    if (se) throw se
    staffId = inserted.id
  }

  const catalog = [
    {
      slug: 'full-manicure',
      title: 'Full manicure',
      description: 'Shape, cuticle care, gel polish.',
      duration_minutes: 60,
      base_price: 85,
      currency: 'BGN',
      is_active: true,
      sort_order: 1,
    },
    {
      slug: 'haircut-blowdry',
      title: 'Cut & blow-dry',
      description: 'Wash, cut, and style.',
      duration_minutes: 45,
      base_price: 65,
      currency: 'BGN',
      is_active: true,
      sort_order: 2,
    },
    {
      slug: 'balayage',
      title: 'Balayage',
      description: 'Hand-painted colour and tone.',
      duration_minutes: 120,
      base_price: 180,
      currency: 'BGN',
      is_active: true,
      sort_order: 3,
    },
  ]

  const { error: upErr } = await supabase.from('session_types').upsert(catalog, { onConflict: 'slug' })
  if (upErr) throw upErr

  const { data: types, error: te } = await supabase.from('session_types').select('id, slug').in('slug', catalog.map((c) => c.slug))
  if (te) throw te
  const bySlug = Object.fromEntries((types ?? []).map((t) => [t.slug, t.id]))

  const byEmail = Object.fromEntries(profiles.map((p) => [p.email, p.id]))

  const rows = [
    {
      client_id: byEmail['test_client@gmail.com'],
      session_type_id: bySlug['full-manicure'],
      staff_member_id: staffId,
      status: 'pending',
      starts_at: '2026-04-18T07:00:00.000Z',
      ends_at: '2026-04-18T08:00:00.000Z',
      price_final: 85,
      admin_note: 'Seed: tomorrow (pending)',
    },
    {
      client_id: byEmail['test_client@gmail.com'],
      session_type_id: bySlug['haircut-blowdry'],
      staff_member_id: staffId,
      status: 'confirmed',
      starts_at: '2026-04-22T11:00:00.000Z',
      ends_at: '2026-04-22T11:45:00.000Z',
      price_final: 65,
      admin_note: 'Seed: confirmed next week',
    },
    {
      client_id: byEmail['test_client2@gmail.com'],
      session_type_id: bySlug['full-manicure'],
      staff_member_id: staffId,
      status: 'completed',
      starts_at: '2026-04-10T08:00:00.000Z',
      ends_at: '2026-04-10T09:00:00.000Z',
      price_final: 85,
      admin_note: 'Seed: past completed',
    },
    {
      client_id: byEmail['test_client2@gmail.com'],
      session_type_id: bySlug['balayage'],
      staff_member_id: staffId,
      status: 'pending',
      starts_at: '2026-04-25T06:30:00.000Z',
      ends_at: '2026-04-25T08:30:00.000Z',
      price_final: 180,
      admin_note: 'Seed: long colour slot',
    },
    {
      client_id: byEmail['test_client@gmail.com'],
      session_type_id: bySlug['balayage'],
      staff_member_id: staffId,
      status: 'cancelled',
      starts_at: '2026-04-14T12:00:00.000Z',
      ends_at: '2026-04-14T14:00:00.000Z',
      price_final: 180,
      cancelled_at: '2026-04-13T10:00:00.000Z',
      cancel_reason: 'Seed: client rescheduled',
      admin_note: 'Seed: cancelled sample',
    },
  ]

  const { data: inserted, error: insErr } = await supabase.from('bookings').insert(rows).select('id, status, starts_at')
  if (insErr) throw insErr

  console.log(`Inserted ${inserted?.length ?? 0} bookings.`)
  console.table(inserted)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
