/**
 * Demo dashboard content so every block shows real UI before Supabase is fully wired.
 * Swap for live queries when ready.
 */

export type MockDashboardKpi = {
  id: string
  title: string
  value: string
  hint: string
  icon: 'revenue' | 'clients' | 'upcoming' | 'pending'
  trend?: { text: string; positive: boolean }
}

export const MOCK_DASHBOARD_KPIS: MockDashboardKpi[] = [
  {
    id: 'rev',
    title: 'Total revenue',
    value: 'BGN 4,850.00',
    hint: 'Completed appointments · vs. previous period',
    icon: 'revenue',
    trend: { text: '+12.5%', positive: true },
  },
  {
    id: 'clients',
    title: 'Clients',
    value: '156',
    hint: 'Profiles with client role',
    icon: 'clients',
    trend: { text: '+4.2%', positive: true },
  },
  {
    id: 'upcoming',
    title: 'Upcoming sessions',
    value: '14',
    hint: 'Confirmed or pending · from today',
    icon: 'upcoming',
    trend: { text: '−2.1%', positive: false },
  },
  {
    id: 'pending',
    title: 'Pending bookings',
    value: '6',
    hint: 'Awaiting your confirmation',
    icon: 'pending',
  },
]

export type MockUpcomingSession = {
  id: string
  initials: string
  clientName: string
  detailLine: string
  status: 'pending' | 'confirmed'
}

export const MOCK_UPCOMING_SESSIONS: MockUpcomingSession[] = [
  {
    id: '1',
    initials: 'EK',
    clientName: 'Elena Kostova',
    detailLine: 'Balayage & tone · Tue 15 Apr, 09:00',
    status: 'confirmed',
  },
  {
    id: '2',
    initials: 'NM',
    clientName: 'Nina Mihaylova',
    detailLine: 'Gel manicure · Tue 15 Apr, 10:30',
    status: 'confirmed',
  },
  {
    id: '3',
    initials: 'SD',
    clientName: 'Sofia Dimitrova',
    detailLine: 'Cut & blow-dry · Tue 15 Apr, 14:00',
    status: 'pending',
  },
  {
    id: '4',
    initials: 'AP',
    clientName: 'Anna Petrova',
    detailLine: 'Classic facial · Wed 16 Apr, 11:15',
    status: 'confirmed',
  },
  {
    id: '5',
    initials: 'VG',
    clientName: 'Viktoria Georgieva',
    detailLine: 'Bridal trial · Wed 16 Apr, 15:45',
    status: 'pending',
  },
  {
    id: '6',
    initials: 'IR',
    clientName: 'Iva Radeva',
    detailLine: 'Lash lift · Thu 17 Apr, 09:30',
    status: 'confirmed',
  },
]

export type MockActivityItem = {
  id: string
  headline: string
  timeLabel: string
}

export const MOCK_RECENT_ACTIVITY: MockActivityItem[] = [
  {
    id: 'a1',
    headline: 'New booking — Maria T., Hydrating facial',
    timeLabel: '2 mins ago',
  },
  {
    id: 'a2',
    headline: 'Session confirmed — Balayage & tone',
    timeLabel: '18 mins ago',
  },
  {
    id: 'a3',
    headline: 'Client note updated — Elena K.',
    timeLabel: '1 hour ago',
  },
  {
    id: 'a4',
    headline: 'Service catalog — “Silk blowout” set active',
    timeLabel: '3 hours ago',
  },
  {
    id: 'a5',
    headline: 'Booking completed — Gel manicure (BGN 65)',
    timeLabel: 'Yesterday',
  },
]
