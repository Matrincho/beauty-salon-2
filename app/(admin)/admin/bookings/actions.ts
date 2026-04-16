'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/auth'
import { z } from 'zod'

const bookingStatusSchema = z.enum([
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'no_show',
])

export type BookingActionResult =
  | { ok: true }
  | { ok: false; message: string }

function canTransition(from: string, to: z.infer<typeof bookingStatusSchema>): boolean {
  if (from === to) return true
  if (from === 'cancelled' || from === 'completed') return false

  switch (to) {
    case 'confirmed':
      return from === 'pending'
    case 'completed':
      return from === 'confirmed' || from === 'pending'
    case 'cancelled':
      return from === 'pending' || from === 'confirmed'
    case 'no_show':
      return from === 'confirmed'
    default:
      return false
  }
}

export async function updateBookingStatusAction(
  bookingId: string,
  nextStatus: string,
  cancelReason?: string | null
): Promise<BookingActionResult> {
  try {
    await requireAdmin()

    const parsed = bookingStatusSchema.safeParse(nextStatus)
    if (!parsed.success) {
      return { ok: false, message: 'Невалиден статус.' }
    }

    const supabase = await createSupabaseServerClient()
    const { data: row, error: fetchError } = await supabase
      .from('bookings')
      .select('status')
      .eq('id', bookingId)
      .single()

    if (fetchError || !row) {
      return { ok: false, message: 'Резервацията не е намерена.' }
    }

    if (!canTransition(row.status, parsed.data)) {
      return {
        ok: false,
        message: 'Този преход на статус не е позволен за текущото състояние.',
      }
    }

    const patch: Record<string, unknown> = { status: parsed.data }

    if (parsed.data === 'cancelled') {
      patch.cancelled_at = new Date().toISOString()
      const reason = cancelReason?.trim()
      if (reason) {
        patch.cancel_reason = reason
      }
    }

    const { error } = await supabase.from('bookings').update(patch).eq('id', bookingId)

    if (error) {
      return { ok: false, message: error.message }
    }

    revalidatePath('/admin/bookings')
    return { ok: true }
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : 'Неуспешна промяна.',
    }
  }
}
