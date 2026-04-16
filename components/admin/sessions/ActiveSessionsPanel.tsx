'use client'

import Link from 'next/link'
import type { AdminBookingRow } from '@/lib/admin/data'
import { BOOKING_STATUS_LABELS } from '@/lib/admin/labels-bg'
import { profileDisplayName } from '@/lib/auth/profile-display'
import { Button } from '@/components/ui/button'

function one<T>(x: T | T[] | null | undefined): T | null {
  if (x == null) return null
  return Array.isArray(x) ? (x[0] ?? null) : x
}

function formatEn(dt: string) {
  return new Date(dt).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function ActiveSessionsPanel({
  bookings,
  error,
}: {
  bookings: AdminBookingRow[]
  error: string | null
}) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-800">
        Could not load active sessions: {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="max-w-2xl space-y-1">
        <h3 className="font-sans text-base font-semibold text-[#1A1A1B]">
          Active sessions
        </h3>
        <p className="text-sm leading-relaxed text-[#8C8074]">
          Real bookings from Supabase with status <span className="font-medium text-[#1A1A1B]/80">pending</span> or{' '}
          <span className="font-medium text-[#1A1A1B]/80">confirmed</span> whose end time has not passed yet (soonest
          first). Manage statuses on the Bookings page.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-[#8C8074]">
          {bookings.length === 0
            ? 'No rows match right now.'
            : `${bookings.length} booking${bookings.length === 1 ? '' : 's'}`}
        </p>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-[#E5E0D8] text-[#1A1A1B] hover:border-[#D4AF37]/50"
        >
          <Link href="/admin/bookings">Open all bookings</Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E5E0D8] bg-white shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E0D8] bg-[#F9F8F6] text-xs uppercase tracking-wide text-[#8C8074]">
              <th className="px-3 py-3 font-medium">Client</th>
              <th className="px-3 py-3 font-medium">Service</th>
              <th className="px-3 py-3 font-medium">Staff</th>
              <th className="px-3 py-3 font-medium">Starts</th>
              <th className="px-3 py-3 font-medium">Ends</th>
              <th className="px-3 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#8C8074]">
                  No active sessions. When you add bookings in the database (or via a future booking flow), they appear
                  here.
                </td>
              </tr>
            ) : (
              bookings.map((b) => {
                const client = one(b.client)
                const name = client ? profileDisplayName(client) : '—'
                const service = b.session_type?.title ?? '—'
                const staff = b.staff?.display_name ?? '—'
                const statusLabel =
                  BOOKING_STATUS_LABELS[b.status] ?? b.status
                return (
                  <tr key={b.id} className="border-b border-[#E5E0D8]/80 last:border-0">
                    <td className="px-3 py-3 font-medium text-[#1A1A1B]">{name}</td>
                    <td className="px-3 py-3 text-[#8C8074]">{service}</td>
                    <td className="px-3 py-3 text-[#8C8074]">{staff}</td>
                    <td className="px-3 py-3 tabular-nums text-[#1A1A1B]/90">{formatEn(b.starts_at)}</td>
                    <td className="px-3 py-3 tabular-nums text-[#8C8074]">{formatEn(b.ends_at)}</td>
                    <td className="px-3 py-3">
                      <span className="rounded border border-[#E5E0D8] bg-[#F9F8F6] px-2 py-0.5 text-xs text-[#1A1A1B]">
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
