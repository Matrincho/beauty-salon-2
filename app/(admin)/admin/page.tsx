import Link from 'next/link'
import {
  Briefcase,
  CalendarDays,
  Clock,
  DollarSign,
  Home,
  Users,
} from 'lucide-react'
import { BOOKING_STATUS_LABELS } from '@/lib/admin/labels-bg'
import type { MockDashboardKpi } from '@/lib/admin/dashboard-mock'
import {
  MOCK_DASHBOARD_KPIS,
  MOCK_RECENT_ACTIVITY,
  MOCK_UPCOMING_SESSIONS,
} from '@/lib/admin/dashboard-mock'

const kpiIcons = {
  revenue: DollarSign,
  clients: Users,
  upcoming: CalendarDays,
  pending: Clock,
} as const

const kpiIconWrap: Record<MockDashboardKpi['icon'], string> = {
  revenue: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
  clients: 'text-[#9a7b1a] bg-[#D4AF37]/12 border-[#D4AF37]/30',
  upcoming: 'text-sky-800 bg-sky-50 border-sky-200/80',
  pending: 'text-amber-800 bg-amber-50 border-amber-200/80',
}

export default function AdminDashboardPage() {
  const quickLinks = [
    {
      href: '/admin',
      label: 'Dashboard',
      description: 'Overview, KPIs, and activity',
      Icon: Home,
    },
    {
      href: '/admin/sessions',
      label: 'Sessions',
      description: 'Categories and service catalog',
      Icon: CalendarDays,
    },
    {
      href: '/admin/clients',
      label: 'Clients',
      description: 'Directory and roles',
      Icon: Users,
    },
    {
      href: '/admin/bookings',
      label: 'Bookings',
      description: 'Appointments and statuses',
      Icon: Briefcase,
    },
  ] as const

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <p className="text-xs text-[#8C8074]">
        Preview: sample figures and lists below. Replace with live data when APIs are ready.
      </p>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MOCK_DASHBOARD_KPIS.map((card) => {
          const Icon = kpiIcons[card.icon]
          return (
            <article
              key={card.id}
              className="relative rounded-xl border border-[#E5E0D8] bg-white p-5 shadow-sm"
            >
              {card.trend ? (
                <span
                  className={`absolute right-4 top-4 font-sans text-xs font-semibold tabular-nums ${
                    card.trend.positive ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {card.trend.text}
                </span>
              ) : null}
              <div className="flex items-start justify-between gap-3 pr-14">
                <h2 className="text-sm font-medium text-[#8C8074]">{card.title}</h2>
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${kpiIconWrap[card.icon]}`}
                >
                  <Icon className="size-5" strokeWidth={2} aria-hidden />
                </span>
              </div>
              <p className="mt-3 font-sans text-2xl font-semibold tabular-nums text-[#1A1A1B]">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-[#8C8074]">{card.hint}</p>
            </article>
          )
        })}
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <span className="h-5 w-1 rounded-sm bg-[#D4AF37]" aria-hidden />
          <h2 className="font-sans text-lg font-semibold text-[#1A1A1B]">Shortcuts</h2>
        </div>
        <p className="text-sm text-[#8C8074]">Same destinations as the sidebar.</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {quickLinks.map(({ href, label, description, Icon }) => (
            <li key={href + label}>
              <Link
                href={href}
                className="flex h-full flex-col rounded-xl border border-[#E5E0D8] bg-white p-4 shadow-sm transition-colors hover:border-[#D4AF37]/50 hover:bg-[#FFFCF8]"
              >
                <span className="flex items-center gap-2 font-medium text-[#1A1A1B]">
                  <Icon className="size-4 text-[#D4AF37]" strokeWidth={2} aria-hidden />
                  {label}
                </span>
                <span className="mt-1 text-sm text-[#8C8074]">{description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 rounded-sm bg-[#D4AF37]" aria-hidden />
              <h2 className="font-sans text-lg font-semibold text-[#1A1A1B]">
                Upcoming sessions
              </h2>
            </div>
            <Link
              href="/admin/bookings"
              className="text-sm font-medium text-[#D4AF37] hover:text-[#e5c45c]"
            >
              View all
            </Link>
          </div>
          <ul className="space-y-2">
            {MOCK_UPCOMING_SESSIONS.map((row) => {
              const statusLabel =
                BOOKING_STATUS_LABELS[row.status] ?? row.status
              return (
                <li
                  key={row.id}
                  className="flex items-center gap-3 rounded-xl border border-[#E5E0D8] bg-white px-3 py-3 shadow-sm"
                >
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/12 font-sans text-xs font-semibold text-[#9a7b1a]"
                    aria-hidden
                  >
                    {row.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[#1A1A1B]">
                      {row.clientName}
                    </p>
                    <p className="truncate text-sm text-[#8C8074]">
                      {row.detailLine}
                    </p>
                  </div>
                  <span
                    className={
                      row.status === 'confirmed'
                        ? 'shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800'
                        : 'shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900'
                    }
                  >
                    {statusLabel}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-5 w-1 rounded-sm bg-[#D4AF37]" aria-hidden />
            <h2 className="font-sans text-lg font-semibold text-[#1A1A1B]">
              Recent activity
            </h2>
          </div>
          <ul className="relative space-y-0 pl-4 before:absolute before:left-[5px] before:top-2 before:h-[calc(100%-12px)] before:w-px before:bg-[#E5E0D8]">
            {MOCK_RECENT_ACTIVITY.map((item) => (
              <li key={item.id} className="relative pb-5 pl-4 last:pb-0">
                <span
                  className="absolute left-0 top-1.5 size-2.5 -translate-x-[1px] rounded-full bg-[#D4AF37] shadow-[0_0_0_3px_rgba(212,175,55,0.15)]"
                  aria-hidden
                />
                <p className="text-sm text-[#1A1A1B]">{item.headline}</p>
                <p className="mt-0.5 text-xs uppercase tracking-wide text-[#8C8074]">
                  {item.timeLabel}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
