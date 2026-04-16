/** Allowed booking status changes for admin UI + server action validation. */
export function canTransitionBooking(from: string, to: string): boolean {
  if (from === to) return true
  if (from === 'completed') return false

  if (from === 'cancelled' && to === 'pending') return true
  if (from === 'cancelled') return false

  switch (to) {
    case 'pending':
      return from === 'confirmed' || from === 'no_show'
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

/** Stable order for sorting status column (pending → … → cancelled). */
export const BOOKING_STATUS_SORT_ORDER: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  completed: 2,
  no_show: 3,
  cancelled: 4,
}
