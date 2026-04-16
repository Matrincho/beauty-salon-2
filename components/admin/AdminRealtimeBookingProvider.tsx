'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BOOKING_STATUS_LABELS } from '@/lib/admin/labels-bg'
import { formatBookingStartsAt } from '@/lib/admin/format-booking-alert'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export type BookingRealtimeNotification = {
  id: string
  bookingId: string
  at: string
  title: string
  detail: string
}

type Ctx = {
  notifications: BookingRealtimeNotification[]
  unreadCount: number
  markAllRead: () => void
  dismiss: (id: string) => void
  clearAll: () => void
  realtimeConnected: boolean
}

const BookingRealtimeCtx = createContext<Ctx | null>(null)

export function useAdminBookingRealtime(): Ctx | null {
  return useContext(BookingRealtimeCtx)
}

function rowStatusLabel(status: unknown): string {
  const s = typeof status === 'string' ? status : ''
  return (BOOKING_STATUS_LABELS[s] ?? s) || 'Unknown'
}

export function AdminRealtimeBookingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<BookingRealtimeNotification[]>(
    []
  )
  const [unreadCount, setUnreadCount] = useState(0)
  const [realtimeConnected, setRealtimeConnected] = useState(false)

  const pushNotification = useCallback((n: BookingRealtimeNotification) => {
    setNotifications((prev) => [n, ...prev].slice(0, 40))
  }, [])

  const markAllRead = useCallback(() => {
    setUnreadCount(0)
  }, [])

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    if (!supabase) return

    const channel = supabase
      .channel('admin-bookings-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings' },
        (payload) => {
          const row = payload.new as Record<string, unknown> | null
          if (!row?.id) return
          const bookingId = String(row.id)
          const startsAt =
            typeof row.starts_at === 'string' ? row.starts_at : ''
          const statusLabel = rowStatusLabel(row.status)
          const when = startsAt ? formatBookingStartsAt(startsAt) : ''
          const detail = [statusLabel, when].filter(Boolean).join(' · ')
          const item: BookingRealtimeNotification = {
            id: crypto.randomUUID(),
            bookingId,
            at: new Date().toISOString(),
            title: 'New booking',
            detail: detail || 'New reservation in the system',
          }
          pushNotification(item)
          setUnreadCount((c) => Math.min(99, c + 1))
          toast.success(item.title, {
            description: item.detail,
            duration: 8_000,
          })
          router.refresh()
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bookings' },
        () => {
          router.refresh()
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setRealtimeConnected(true)
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setRealtimeConnected(false)
        }
      })

    return () => {
      setRealtimeConnected(false)
      supabase.removeChannel(channel)
    }
  }, [router, pushNotification])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAllRead,
      dismiss,
      clearAll,
      realtimeConnected,
    }),
    [
      notifications,
      unreadCount,
      markAllRead,
      dismiss,
      clearAll,
      realtimeConnected,
    ]
  )

  return (
    <BookingRealtimeCtx.Provider value={value}>
      {children}
    </BookingRealtimeCtx.Provider>
  )
}
