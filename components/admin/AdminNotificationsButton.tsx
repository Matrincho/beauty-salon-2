'use client'

import Link from 'next/link'
import { Bell, Radio } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAdminBookingRealtime } from '@/components/admin/AdminRealtimeBookingProvider'

function formatNotifTime(iso: string): string {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch {
    return ''
  }
}

/** Booking alerts from Supabase Realtime + local session list. */
export function AdminNotificationsButton({ className }: { className?: string }) {
  const rt = useAdminBookingRealtime()

  if (!rt) {
    return (
      <button
        type="button"
        className={cn(
          'relative shrink-0 rounded-lg border border-[#E5E0D8] bg-white p-2 text-[#8C8074] shadow-sm transition-colors hover:border-[#D4AF37]/50 hover:text-[#1A1A1B]',
          className
        )}
        aria-label="Notifications"
        disabled
      >
        <Bell className="size-5" strokeWidth={2} aria-hidden />
      </button>
    )
  }

  const {
    notifications,
    unreadCount,
    markAllRead,
    dismiss,
    clearAll,
    realtimeConnected,
  } = rt

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) markAllRead()
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'relative shrink-0 rounded-lg border border-[#E5E0D8] bg-white p-2 text-[#8C8074] shadow-sm transition-colors hover:border-[#D4AF37]/50 hover:text-[#1A1A1B]',
            className
          )}
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} new` : ''}`}
        >
          <Bell className="size-5" strokeWidth={2} aria-hidden />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#D4AF37] px-1 font-sans text-[10px] font-bold leading-none text-[#1A1A1B] shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : null}
          {realtimeConnected ? (
            <span
              className="absolute bottom-1 right-1 size-2 rounded-full bg-emerald-500 ring-2 ring-white"
              title="Live updates on"
              aria-hidden
            />
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(100vw-1rem,22rem)] border-[#E5E0D8] p-0"
      >
        <div className="border-b border-[#E5E0D8] px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <p className="font-sans text-sm font-semibold text-[#1A1A1B]">
              Booking alerts
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-[#8C8074]">
              <Radio
                className={cn(
                  'size-3.5',
                  realtimeConnected ? 'text-emerald-600' : 'text-[#C4B8A8]'
                )}
                aria-hidden
              />
              <span>{realtimeConnected ? 'Live' : 'Connecting…'}</span>
            </div>
          </div>
          <p className="mt-0.5 text-[11px] leading-snug text-[#8C8074]">
            New rows in <span className="font-medium text-[#1A1A1B]/80">bookings</span>{' '}
            appear here and as toasts while this tab is open.
          </p>
        </div>

        <ul
          className="max-h-[min(50vh,18rem)] overflow-y-auto p-1"
          aria-live="polite"
        >
          {notifications.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-[#8C8074]">
              No alerts yet this session.
            </li>
          ) : (
            notifications.map((n) => (
              <li
                key={n.id}
                className="rounded-lg border border-transparent hover:border-[#E5E0D8] hover:bg-[#F9F8F6]"
              >
                <div className="flex gap-2 px-2 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm font-medium text-[#1A1A1B]">
                      {n.title}
                    </p>
                    <p className="truncate text-xs text-[#8C8074]">{n.detail}</p>
                    <p className="mt-1 text-[10px] text-[#C4B8A8]">
                      {formatNotifTime(n.at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Link
                      href="/admin/bookings"
                      className="text-xs font-medium text-[#D4AF37] hover:underline"
                      onClick={() => dismiss(n.id)}
                    >
                      Open
                    </Link>
                    <button
                      type="button"
                      className="text-[10px] text-[#8C8074] hover:text-[#1A1A1B]"
                      onClick={() => dismiss(n.id)}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        {notifications.length > 0 ? (
          <div className="flex items-center justify-between border-t border-[#E5E0D8] px-2 py-2">
            <button
              type="button"
              className="text-xs text-[#8C8074] hover:text-[#1A1A1B]"
              onClick={clearAll}
            >
              Clear list
            </button>
            <Link
              href="/admin/bookings"
              className="text-xs font-medium text-[#D4AF37] hover:underline"
            >
              All bookings
            </Link>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
