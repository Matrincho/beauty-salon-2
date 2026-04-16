'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/auth'
import { USER_ROLES, type UserRole } from '@/lib/auth/roles'
import { z } from 'zod'

const roleSchema = z.enum(USER_ROLES)

const profilePatchSchema = z.object({
  first_name: z.string().max(200).optional().nullable(),
  last_name: z.string().max(200).optional().nullable(),
  phone_prefix: z.string().max(32).optional().nullable(),
  phone_number: z.string().max(64).optional().nullable(),
  address_line_1: z.string().max(500).optional().nullable(),
  address_line_2: z.string().max(500).optional().nullable(),
  city: z.string().max(200).optional().nullable(),
  county: z.string().max(200).optional().nullable(),
  postcode: z.string().max(32).optional().nullable(),
  country: z.string().max(200).optional().nullable(),
  role: roleSchema.optional(),
})

function trimOrNull(v: string | null | undefined): string | null {
  if (v == null) return null
  const t = v.trim()
  return t === '' ? null : t
}

export type ActionResult =
  | { ok: true }
  | { ok: false; message: string }

export async function updateClientRoleAction(
  profileId: string,
  nextRole: UserRole
): Promise<ActionResult> {
  try {
    const { profile: actor } = await requireAdmin()

    if (actor.id === profileId) {
      return {
        ok: false,
        message: 'You cannot change your own role from this screen.',
      }
    }

    const parsed = roleSchema.safeParse(nextRole)
    if (!parsed.success) {
      return { ok: false, message: 'Invalid role.' }
    }

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase
      .from('profiles')
      .update({ role: parsed.data })
      .eq('id', profileId)

    if (error) {
      return { ok: false, message: error.message }
    }

    revalidatePath('/admin/clients')
    return { ok: true }
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : 'Update failed.',
    }
  }
}

export type ClientProfilePatch = z.infer<typeof profilePatchSchema>

export async function updateClientProfileAction(
  profileId: string,
  raw: ClientProfilePatch
): Promise<ActionResult> {
  try {
    const { profile: actor } = await requireAdmin()

    const parsed = profilePatchSchema.safeParse(raw)
    if (!parsed.success) {
      return { ok: false, message: 'Invalid profile data.' }
    }

    const p = parsed.data
    const patch: Record<string, unknown> = {
      first_name: trimOrNull(p.first_name ?? undefined),
      last_name: trimOrNull(p.last_name ?? undefined),
      phone_prefix: trimOrNull(p.phone_prefix ?? undefined),
      phone_number: trimOrNull(p.phone_number ?? undefined),
      address_line_1: trimOrNull(p.address_line_1 ?? undefined),
      address_line_2: trimOrNull(p.address_line_2 ?? undefined),
      city: trimOrNull(p.city ?? undefined),
      county: trimOrNull(p.county ?? undefined),
      postcode: trimOrNull(p.postcode ?? undefined),
      country: trimOrNull(p.country ?? undefined),
    }

    if (actor.id !== profileId && p.role !== undefined) {
      patch.role = p.role
    }

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.from('profiles').update(patch).eq('id', profileId)

    if (error) {
      return { ok: false, message: error.message }
    }

    revalidatePath('/admin/clients')
    return { ok: true }
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : 'Update failed.',
    }
  }
}

/** Bans the profile (blocks sign-in). Bookings and history are kept — no auth user deletion. */
export async function deleteClientAccountAction(profileId: string): Promise<ActionResult> {
  try {
    const { profile: actor } = await requireAdmin()

    if (actor.id === profileId) {
      return { ok: false, message: 'You cannot remove your own account.' }
    }

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        account_status: 'banned',
        banned_at: new Date().toISOString(),
        ban_reason: 'Removed by admin',
      })
      .eq('id', profileId)

    if (error) {
      return { ok: false, message: error.message }
    }

    revalidatePath('/admin/clients')
    return { ok: true }
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : 'Remove failed.',
    }
  }
}
