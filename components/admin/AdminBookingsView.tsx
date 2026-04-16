'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from 'date-fns'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  CalendarDays,
  Clock,
  Eye,
  Loader2,
  Search,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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
import {
  BOOKING_STATUS_SORT_ORDER,
  canTransitionBooking,
} from '@/lib/admin/booking-transitions'

const BOOKING_STATUS_KEYS = Object.keys(BOOKING_STATUS_LABELS) as Array<
  keyof typeof BOOKING_STATUS_LABELS
>

type DatePreset = 'all' | 'today' | 'week' | 'month' | 'custom'

const DATE_SEGMENTS: {
  id: DatePreset
  label: string
  icon: LucideIcon | null
}[] = [
  { id: 'all', label: 'All', icon: null },
  { id: 'today', label: 'Today', icon: Calendar },
  { id: 'week', label: 'Week', icon: Clock },
  { id: 'month', label: 'Month', icon: CalendarDays },
  { id: 'custom', label: 'Custom', icon: Search },
]

function parseLocalYmd(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim())
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2])
  const d = Number(m[3])
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return null
  return new Date(y, mo - 1, d)
}

function boundsForPreset(
  preset: DatePreset,
  customFrom: string,
  customTo: string
): { start: Date | null; end: Date | null } {
  const now = new Date()
  switch (preset) {
    case 'all':
      return { start: null, end: null }
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) }
    case 'week':
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      }
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) }
    case 'custom': {
      const a = parseLocalYmd(customFrom)
      const b = parseLocalYmd(customTo)
      if (!a || !b) return { start: null, end: null }
      const lo = a <= b ? a : b
      const hi = a <= b ? b : a
      return { start: startOfDay(lo), end: endOfDay(hi) }
    }
    default:
      return { start: null, end: null }
  }
}

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

function clientSortName(row: AdminBookingRow): string {
  const c = one(row.client)
  if (!c) return ''
  return (profileDisplayName(c) || c.email || '').trim()
}

function formatPrice(amount: number, currency: string | undefined) {
  return `${Number(amount).toFixed(2)} ${currency ?? 'BGN'}`
}

type SortKey = 'client' | 'service' | 'starts' | 'status' | 'price'

function canSetStatus(current: string, next: string) {
  if (current === next) return false
  return canTransitionBooking(current, next)
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
  const [sessionTypeFilter, setSessionTypeFilter] = useState<string>('all')
  const [datePreset, setDatePreset] = useState<DatePreset>('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({
    key: 'starts',
    dir: 'desc',
  })

  const sessionTypeOptions = useMemo(() => {
    const map = new Map<string, string>()
    for (const b of bookings) {
      const st = one(b.session_type)
      if (st?.id) map.set(st.id, st.title)
    }
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]))
  }, [bookings])

  const dateBounds = useMemo(
    () => boundsForPreset(datePreset, customFrom, customTo),
    [datePreset, customFrom, customTo]
  )

  const filteredBookings = useMemo(() => {
    let list = bookings
    if (statusFilter !== 'all') {
      list = list.filter((b) => b.status === statusFilter)
    }
    if (sessionTypeFilter !== 'all') {
      list = list.filter((b) => one(b.session_type)?.id === sessionTypeFilter)
    }
    if (dateBounds.start && dateBounds.end) {
      const t0 = dateBounds.start.getTime()
      const t1 = dateBounds.end.getTime()
      list = list.filter((b) => {
        const t = new Date(b.starts_at).getTime()
        return t >= t0 && t <= t1
      })
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
  }, [bookings, statusFilter, sessionTypeFilter, dateBounds, clientSearch])

  const sortedBookings = useMemo(() => {
    const list = [...filteredBookings]
    const dir = sort.dir === 'asc' ? 1 : -1
    const { key } = sort
    list.sort((a, b) => {
      let cmp = 0
      switch (key) {
        case 'client':
          cmp = clientSortName(a).localeCompare(clientSortName(b), undefined, { sensitivity: 'base' })
          break
        case 'service': {
          const na = one(a.session_type)?.title ?? ''
          const nb = one(b.session_type)?.title ?? ''
          cmp = na.localeCompare(nb, undefined, { sensitivity: 'base' })
          break
        }
        case 'starts':
          cmp = new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
          break
        case 'status': {
          const oa = BOOKING_STATUS_SORT_ORDER[a.status] ?? 99
          const ob = BOOKING_STATUS_SORT_ORDER[b.status] ?? 99
          cmp = oa - ob
          if (cmp === 0) cmp = a.status.localeCompare(b.status)
          break
        }
        case 'price':
          cmp = Number(a.price_final) - Number(b.price_final)
          break
      }
      return cmp * dir
    })
    return list
  }, [filteredBookings, sort])

  function toggleSort(nextKey: SortKey) {
    setSort((s) =>
      s.key === nextKey
        ? { ...s, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { key: nextKey, dir: nextKey === 'starts' || nextKey === 'price' ? 'desc' : 'asc' }
    )
  }

  function openDetail(row: AdminBookingRow) {
    setDetail(row)
    setCancelMode(false)
    setCancelReason('')
  }

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
        Client, service, staff, and price in one place. Click a row or use View for details and
        status changes.
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
        <div className="space-y-1">
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#8C8074]">
            Service
          </p>
          <Select value={sessionTypeFilter} onValueChange={setSessionTypeFilter}>
            <SelectTrigger className="h-9 min-w-[12rem] border-[#E5E0D8] bg-white">
              <SelectValue placeholder="All services" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All services</SelectItem>
              {sessionTypeOptions.map(([id, title]) => (
                <SelectItem key={id} value={id}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-medium uppercase tracking-wide text-[#8C8074]">
          Starts (date range)
        </p>
        <div
          className="inline-flex max-w-full flex-wrap items-stretch gap-1 rounded-xl border border-[#E5E0D8] bg-[#F9F8F6] p-1 shadow-sm"
          role="group"
          aria-label="Filter by start date"
        >
          {DATE_SEGMENTS.map(({ id, label, icon: Icon }) => {
            const active = datePreset === id
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                aria-label={label}
                onClick={() => setDatePreset(id)}
                className={cn(
                  'inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-[#D4AF37] text-white shadow-sm'
                    : 'text-[#8C8074] hover:bg-white hover:text-[#1A1A1B]'
                )}
              >
                {Icon ? <Icon className="size-4 shrink-0 opacity-95" aria-hidden /> : null}
                {label}
              </button>
            )
          })}
        </div>
        {datePreset === 'custom' ? (
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <label
                htmlFor="booking-filter-from"
                className="text-xs font-medium text-[#8C8074]"
              >
                From
              </label>
              <Input
                id="booking-filter-from"
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="h-9 w-[11rem] border-[#E5E0D8] bg-white"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="booking-filter-to" className="text-xs font-medium text-[#8C8074]">
                To
              </label>
              <Input
                id="booking-filter-to"
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="h-9 w-[11rem] border-[#E5E0D8] bg-white"
              />
            </div>
            {(!customFrom || !customTo) && (
              <p className="text-xs text-[#8C8074]">Choose both dates to filter.</p>
            )}
          </div>
        ) : null}
      </div>
      <p className="text-xs text-[#8C8074]">
        Master list · {bookings.length} booking{bookings.length === 1 ? '' : 's'} ·{' '}
        {filteredBookings.length} shown
      </p>

      <div className="overflow-x-auto rounded-xl border border-[#E5E0D8] bg-white shadow-sm">
        <table className="w-full min-w-[880px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E0D8] bg-[#F9F8F6] text-xs uppercase tracking-wide text-[#8C8074]">
              {(
                [
                  { key: 'client' as const, label: 'Client' },
                  { key: 'service' as const, label: 'Service' },
                  { key: 'starts' as const, label: 'Starts' },
                  { key: 'status' as const, label: 'Status' },
                  { key: 'price' as const, label: 'Price' },
                ] as const
              ).map(({ key, label }) => {
                const active = sort.key === key
                const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown
                return (
                  <th key={key} scope="col" className="px-4 py-3 font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort(key)}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-md text-left uppercase tracking-wide transition-colors hover:text-[#1A1A1B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50"
                      aria-label={`Sort by ${label}${active ? `, ${sort.dir === 'asc' ? 'ascending' : 'descending'}` : ''}`}
                    >
                      {label}
                      <Icon className="size-3.5 shrink-0 opacity-70" aria-hidden />
                    </button>
                  </th>
                )
              })}
              <th scope="col" className="w-28 px-4 py-3 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[#8C8074]">
                  No bookings yet.
                </td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[#8C8074]">
                  No rows match your filters.
                </td>
              </tr>
            ) : (
              sortedBookings.map((row, i) => {
                const client = one(row.client)
                const st = one(row.session_type)
                const cname = client
                  ? profileDisplayName(client) || client.email || '—'
                  : '—'

                return (
                  <tr
                    key={row.id}
                    tabIndex={0}
                    className={cn(
                      'border-b border-[#E5E0D8]/70 last:border-0',
                      'animate-in fade-in slide-in-from-bottom-1 duration-300',
                      'cursor-pointer transition-colors hover:bg-[#F9F8F6]/90 focus-visible:bg-[#F9F8F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50'
                    )}
                    style={{ animationDelay: `${Math.min(i, 14) * 30}ms` }}
                    aria-label={`View booking for ${cname}`}
                    onClick={() => openDetail(row)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openDetail(row)
                      }
                    }}
                  >
                    <td className="px-4 py-3 font-medium text-[#1A1A1B]">{cname}</td>
                    <td className="px-4 py-3 text-[#1A1A1B]/90">{st?.title ?? '—'}</td>
                    <td className="px-4 py-3 text-[#8C8074]">{formatEn(row.starts_at)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md border border-[#E5E0D8] bg-[#F9F8F6] px-2 py-0.5 text-xs text-[#1A1A1B]/80">
                        {BOOKING_STATUS_LABELS[row.status] ?? row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium tabular-nums text-[#1A1A1B]">
                      {formatPrice(row.price_final, one(row.session_type)?.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-[#E5E0D8] bg-white hover:bg-[#F9F8F6]"
                        onClick={(e) => {
                          e.stopPropagation()
                          openDetail(row)
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
                    <Button
                      type="button"
                      className={cn(
                        'border border-[#1A1A1B] bg-[#1A1A1B] text-[#F9F8F6] shadow-sm transition-colors',
                        'hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A1A1B]',
                        'disabled:opacity-50 disabled:hover:border-[#1A1A1B] disabled:hover:bg-[#1A1A1B] disabled:hover:text-[#F9F8F6]'
                      )}
                      disabled={!canSetStatus(detail.status, 'confirmed')}
                      onClick={() => runUpdate(detail.id, 'confirmed')}
                    >
                      Confirm
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'border-[#E5E0D8] bg-white text-[#1A1A1B] shadow-sm transition-colors',
                        'hover:border-[#D4AF37] hover:bg-[#FFFCF8] hover:text-[#1A1A1B]',
                        'disabled:opacity-50 disabled:hover:border-[#E5E0D8] disabled:hover:bg-white'
                      )}
                      disabled={!canSetStatus(detail.status, 'pending')}
                      onClick={() => runUpdate(detail.id, 'pending')}
                    >
                      Pending
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className={cn(
                        'shadow-sm transition-colors',
                        'hover:bg-red-700 hover:shadow-md',
                        'disabled:opacity-50 disabled:hover:shadow-none'
                      )}
                      disabled={!canSetStatus(detail.status, 'cancelled')}
                      onClick={() => setCancelMode(true)}
                    >
                      Cancel
                    </Button>
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
