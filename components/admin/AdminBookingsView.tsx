'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import type { AdminBookingRow } from '@/lib/admin/data'
import { ACCOUNT_STATUS_LABELS, BOOKING_STATUS_LABELS, ROLE_LABELS } from '@/lib/admin/labels-bg'
import { profileDisplayName } from '@/lib/auth/profile-display'
import { updateBookingStatusAction } from '@/app/(admin)/admin/bookings/actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const BOOKING_STATUS_KEYS = Object.keys(BOOKING_STATUS_LABELS) as Array<
  keyof typeof BOOKING_STATUS_LABELS
>

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

function clientPhone(c: NonNullable<AdminBookingRow['client']>): string {
  const bits = [c.phone_prefix, c.phone_number].filter(
    (s): s is string => Boolean(s && String(s).trim())
  )
  return bits.join(' ') || '—'
}

export function AdminBookingsView({
  bookings,
  error,
}: {
  bookings: AdminBookingRow[]
  error: string | null
}) {
  const router = useRouter()
  const [detail, setDetail] = useState<AdminBookingRow | null>(null)
  const [cancelMode, setCancelMode] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [clientSearch, setClientSearch] = useState('')

  const filteredBookings = useMemo(() => {
    let list = bookings
    if (statusFilter !== 'all') {
      list = list.filter((b) => b.status === statusFilter)
    }
    const q = clientSearch.trim().toLowerCase()
    if (q) {
      list = list.filter((b) => {
        const client = one(b.client)
        const name = (client ? profileDisplayName(client) : '')?.toLowerCase() ?? ''
        const email = client?.email?.toLowerCase() ?? ''
        const phone = client
          ? [client.phone_prefix, client.phone_number]
              .filter((x): x is string => Boolean(x && String(x).trim()))
              .join(' ')
              .toLowerCase()
          : ''
        return name.includes(q) || email.includes(q) || phone.includes(q)
      })
    }
    return list
  }, [bookings, statusFilter, clientSearch])

  function closeDetail() {
    setDetail(null)
    setCancelMode(false)
    setCancelReason('')
  }

  function runUpdate(bookingId: string, status: string, reason?: string | null) {
    setPendingId(bookingId)
    startTransition(async () => {
      const res = await updateBookingStatusAction(bookingId, status, reason)
      setPendingId(null)
      if (res.ok) {
        toast.success('Status updated.')
        closeDetail()
        router.refresh()
      } else {
        toast.error(res.message)
      }
    })
  }

  function onConfirmCancel() {
    if (!detail) return
    const r = cancelReason.trim()
    if (!r) {
      toast.error('Please enter a cancellation reason.')
      return
    }
    runUpdate(detail.id, 'cancelled', r)
  }

  if (error) {
    return (
      <div
        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"
        role="alert"
      >
        {error}
      </div>
    )
  }

  return (
    <div className="admin-fade-in space-y-4">
      <p className="text-sm text-[#8C8074]">
        Client, service, staff, and price in one place. Open a row for details and status
        changes.
      </p>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="relative max-w-md flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8C8074]"
            aria-hidden
          />
          <Input
            type="search"
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            placeholder="Filter by client name, email, or phone…"
            className="border-[#E5E0D8] bg-white pl-10 shadow-sm placeholder:text-[#8C8074]/70"
            aria-label="Filter bookings by client"
          />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#8C8074]">
            Status
          </p>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[12rem] border-[#E5E0D8] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {BOOKING_STATUS_KEYS.map((k) => (
                <SelectItem key={k} value={k}>
                  {BOOKING_STATUS_LABELS[k] ?? k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="text-xs text-[#8C8074]">
        Master list · {bookings.length} booking{bookings.length === 1 ? '' : 's'} ·{' '}
        {filteredBookings.length} shown
      </p>

      <div className="overflow-x-auto rounded-xl border border-[#E5E0D8] bg-white shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E0D8] bg-[#F9F8F6] text-xs uppercase tracking-wide text-[#8C8074]">
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Starts</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="w-28 px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[#8C8074]">
                  No bookings yet.
                </td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[#8C8074]">
                  No rows match your filters.
                </td>
              </tr>
            ) : (
              filteredBookings.map((row, i) => {
                const client = one(row.client)
                const st = one(row.session_type)
                const cname = client
                  ? profileDisplayName(client) || client.email || '—'
                  : '—'

                return (
                  <tr
                    key={row.id}
                    className={cn(
                      'border-b border-[#E5E0D8]/70 last:border-0',
                      'animate-in fade-in slide-in-from-bottom-1 duration-300'
                    )}
                    style={{ animationDelay: `${Math.min(i, 14) * 30}ms` }}
                  >
                    <td className="px-4 py-3 font-medium text-[#1A1A1B]">{cname}</td>
                    <td className="px-4 py-3 text-[#1A1A1B]/90">{st?.title ?? '—'}</td>
                    <td className="px-4 py-3 text-[#8C8074]">{formatEn(row.starts_at)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md border border-[#E5E0D8] bg-[#F9F8F6] px-2 py-0.5 text-xs text-[#1A1A1B]/80">
                        {BOOKING_STATUS_LABELS[row.status] ?? row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-[#E5E0D8] bg-white hover:bg-[#F9F8F6]"
                        onClick={() => {
                          setDetail(row)
                          setCancelMode(false)
                          setCancelReason('')
                        }}
                      >
                        <Eye className="mr-1 size-3.5" aria-hidden />
                        View
                      </Button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={detail !== null}
        onOpenChange={(o) => {
          if (!o) closeDetail()
        }}
      >
        <DialogContent className="max-h-[min(90vh,640px)] overflow-y-auto border-[#E5E0D8] bg-white text-[#1A1A1B] sm:max-w-lg">
          {detail ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-sans text-xl text-[#1A1A1B]">
                  Booking details
                </DialogTitle>
              </DialogHeader>

              {!cancelMode ? (
                <div className="space-y-4 text-sm">
                  <section className="rounded-lg border border-[#E5E0D8] bg-[#F9F8F6]/80 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8C8074]">
                      Client
                    </p>
                    {(() => {
                      const c = one(detail.client)
                      if (!c) return <p className="mt-1">—</p>
                      return (
                        <ul className="mt-2 space-y-1 text-[#1A1A1B]">
                          <li>
                            <span className="text-[#8C8074]">Name: </span>
                            {profileDisplayName(c) || '—'}
                          </li>
                          <li>
                            <span className="text-[#8C8074]">Email: </span>
                            {c.email ?? '—'}
                          </li>
                          <li>
                            <span className="text-[#8C8074]">Phone: </span>
                            {clientPhone(c)}
                          </li>
                          <li>
                            <span className="text-[#8C8074]">Role: </span>
                            {ROLE_LABELS[c.role] ?? c.role}
                          </li>
                          <li>
                            <span className="text-[#8C8074]">Account: </span>
                            {ACCOUNT_STATUS_LABELS[c.account_status] ?? c.account_status}
                          </li>
                        </ul>
                      )
                    })()}
                  </section>

                  <section className="rounded-lg border border-[#E5E0D8] bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8C8074]">
                      Session
                    </p>
                    {(() => {
                      const st = one(detail.session_type)
                      const staff = one(detail.staff)
                      return (
                        <ul className="mt-2 space-y-1 text-[#1A1A1B]">
                          <li>
                            <span className="text-[#8C8074]">Service: </span>
                            {st?.title ?? '—'}
                          </li>
                          <li>
                            <span className="text-[#8C8074]">Staff: </span>
                            {staff?.display_name ?? '—'}
                          </li>
                          <li>
                            <span className="text-[#8C8074]">Start / end: </span>
                            {formatEn(detail.starts_at)} — {formatEn(detail.ends_at)}
                          </li>
                          <li>
                            <span className="text-[#8C8074]">Status: </span>
                            {BOOKING_STATUS_LABELS[detail.status] ?? detail.status}
                          </li>
                        </ul>
                      )
                    })()}
                  </section>

                  <section className="rounded-lg border border-[#D4AF37]/30 bg-[#FFFCF8] p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8C8074]">
                      Payment
                    </p>
                    <p className="mt-2 font-medium text-[#1A1A1B]">
                      {Number(detail.price_final).toFixed(2)}{' '}
                      {one(detail.session_type)?.currency ?? 'BGN'}
                    </p>
                    <p className="mt-1 text-xs text-[#8C8074]">
                      Pay in person
                      {detail.price_override ? ' · Adjusted price' : ''}
                    </p>
                    {detail.admin_note ? (
                      <p className="mt-2 text-xs text-[#8C8074]">
                        Admin note: {detail.admin_note}
                      </p>
                    ) : null}
                    {detail.internal_note ? (
                      <p className="mt-1 text-xs text-[#8C8074]">
                        Internal note: {detail.internal_note}
                      </p>
                    ) : null}
                    {detail.cancelled_at ? (
                      <p className="mt-2 text-xs text-red-700">
                        Cancelled on {formatEn(detail.cancelled_at)}
                        {detail.cancel_reason ? ` · ${detail.cancel_reason}` : ''}
                      </p>
                    ) : null}
                  </section>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-[#8C8074]">Cancellation reason (required):</p>
                  <Textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={4}
                    className="border-[#E5E0D8] bg-white"
                    placeholder="Brief reason…"
                  />
                </div>
              )}

              <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
                {pendingId === detail.id ? (
                  <Loader2 className="size-6 animate-spin text-[#D4AF37]" />
                ) : !cancelMode ? (
                  <>
                    <Button type="button" variant="outline" onClick={closeDetail}>
                      Close
                    </Button>
                    {detail.status === 'pending' ? (
                      <>
                        <Button
                          type="button"
                          className="bg-[#1A1A1B] text-[#F9F8F6] hover:bg-[#1A1A1B]/90"
                          onClick={() => runUpdate(detail.id, 'confirmed')}
                        >
                          Confirm
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => setCancelMode(true)}
                        >
                          Cancel booking
                        </Button>
                      </>
                    ) : null}
                    {detail.status === 'confirmed' ? (
                      <>
                        <Button
                          type="button"
                          className="bg-[#D4AF37] text-[#1A1A1B] hover:bg-[#c9a227]"
                          onClick={() => runUpdate(detail.id, 'completed')}
                        >
                          Complete
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => runUpdate(detail.id, 'no_show')}
                        >
                          No-show
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => setCancelMode(true)}
                        >
                          Cancel booking
                        </Button>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCancelMode(false)
                        setCancelReason('')
                      }}
                    >
                      Back
                    </Button>
                    <Button type="button" variant="destructive" onClick={onConfirmCancel}>
                      Confirm cancellation
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
