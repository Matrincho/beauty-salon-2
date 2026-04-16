'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import {
  Briefcase,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
} from 'lucide-react'
import type { UserRole } from '@/lib/auth/roles'
import {
  ADMIN_NAV_ITEMS,
  filterAdminNavForRole,
  getAdminHeaderCopy,
  isAdminNavItemActive,
  type AdminNavItem,
} from '@/lib/admin/nav-config'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { cn } from '@/lib/utils'
import { NavbarUserMenuDesktop } from '@/components/navigation/NavbarUserMenu'
import { AdminNotificationsButton } from '@/components/admin/AdminNotificationsButton'
import { AdminRealtimeBookingProvider } from '@/components/admin/AdminRealtimeBookingProvider'
import { AdminQuickActionDropdown } from '@/components/admin/AdminQuickActionDropdown'
import { AdminToaster } from '@/components/admin/AdminToaster'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const SIDEBAR_STORAGE_KEY = 'maison-admin-sidebar-collapsed'

function NavIcon({ id, className }: { id: string; className?: string }) {
  const c = cn('size-[18px] shrink-0', className)
  switch (id) {
    case 'dashboard':
      return <Home className={c} strokeWidth={2} aria-hidden />
    case 'bookings':
      return <Briefcase className={c} strokeWidth={2} aria-hidden />
    case 'clients':
      return <Users className={c} strokeWidth={2} aria-hidden />
    case 'sessions':
      return <CalendarDays className={c} strokeWidth={2} aria-hidden />
    default:
      return <span className="size-[18px] shrink-0 rounded bg-[#E5E0D8]" aria-hidden />
  }
}

function AdminNavList({
  pathname,
  items,
  collapsed,
  onNavigate,
}: {
  pathname: string
  items: AdminNavItem[]
  collapsed: boolean
  onNavigate?: () => void
}) {
  const linkBase = (active: boolean) =>
    cn(
      'flex items-center gap-3 rounded-lg text-sm transition-colors',
      collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2',
      active
        ? 'bg-[#F9F8F6] font-medium text-[#1A1A1B] shadow-[inset_3px_0_0_0_#D4AF37]'
        : 'text-[#8C8074] hover:bg-[#F9F8F6]/80 hover:text-[#1A1A1B]'
    )

  return (
    <ul className={cn('space-y-1', collapsed && 'space-y-2')}>
      {items.map((item) => {
        if (!item.href) return null
        const active = isAdminNavItemActive(pathname, item)
        return (
          <li key={item.id}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={linkBase(active)}
              title={collapsed ? item.label : undefined}
              aria-current={active ? 'page' : undefined}
            >
              <NavIcon id={item.id} className={active ? 'text-[#D4AF37]' : undefined} />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function AdminLayoutClient({
  children,
  userRole,
}: {
  children: React.ReactNode
  userRole: UserRole | null
}) {
  const pathname = usePathname()
  const { locale } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarReady, setSidebarReady] = useState(false)

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const v = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
        if (v === '1') {
          setSidebarCollapsed(true)
        }
      }
    } finally {
      setSidebarReady(true)
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? '1' : '0')
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const navItems = filterAdminNavForRole(ADMIN_NAV_ITEMS, userRole)
  const header = getAdminHeaderCopy(pathname)
  const collapsed = sidebarReady && sidebarCollapsed

  return (
    <AdminRealtimeBookingProvider>
    <div className="relative flex min-h-screen overflow-hidden bg-[#F9F8F6] text-[#1A1A1B]">
      <AdminToaster />
      <aside
        className={cn(
          'relative hidden shrink-0 flex-col border-r border-[#E5E0D8] bg-white shadow-[4px_0_24px_rgba(26,26,27,0.04)] transition-[width] duration-300 ease-out lg:flex',
          collapsed ? 'w-[4.75rem]' : 'w-64'
        )}
      >
        <div
          className={cn(
            'border-b border-[#E5E0D8]/80 bg-gradient-to-b from-white to-[#FAFAF8] p-4',
            collapsed && 'px-2 py-4'
          )}
        >
          <Link
            href="/admin"
            className="block rounded-lg outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            {collapsed ? (
              <div
                className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E0D8] bg-[#F9F8F6] font-sans text-sm font-semibold text-[#D4AF37]"
                title="Maison Elite — Admin"
              >
                ME
              </div>
            ) : (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8C8074]">
                  Maison Elite
                </p>
                <p className="mt-1 font-sans text-lg font-semibold leading-tight text-[#1A1A1B]">
                  Admin
                </p>
              </>
            )}
          </Link>
        </div>

        <nav
          className={cn('flex-1 overflow-y-auto py-4', collapsed ? 'px-2' : 'px-3')}
          aria-label="Admin navigation"
        >
          <AdminNavList
            pathname={pathname}
            items={navItems}
            collapsed={collapsed}
          />
        </nav>

        <div className="mt-auto space-y-1 border-t border-[#E5E0D8] p-2">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-2 rounded-lg py-2 text-sm text-[#8C8074] transition-colors hover:bg-[#F9F8F6] hover:text-[#D4AF37]',
              collapsed ? 'justify-center px-0' : 'px-3'
            )}
            title={collapsed ? 'Back to site' : undefined}
          >
            <span aria-hidden>←</span>
            {!collapsed ? <span>Back to site</span> : null}
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b border-[#E5E0D8] bg-white/90 px-3 py-3 shadow-sm backdrop-blur-md sm:gap-3 sm:px-4">
          {/* Mobile: open nav drawer (same chevron affordance as desktop expand) */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0 border-[#E5E0D8] bg-white lg:hidden"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <ChevronRight className="size-5" strokeWidth={2} aria-hidden />
          </Button>
          {/* Desktop: collapse / expand sidebar — outside the aside so it stays visible */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="hidden shrink-0 border-[#E5E0D8] bg-white lg:inline-flex"
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={toggleSidebar}
          >
            {collapsed ? (
              <ChevronRight className="size-5" strokeWidth={2} aria-hidden />
            ) : (
              <ChevronLeft className="size-5" strokeWidth={2} aria-hidden />
            )}
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent
              side="left"
              className="w-[min(100%,280px)] border-[#E5E0D8] bg-white p-0 text-[#1A1A1B]"
            >
              <SheetHeader className="border-b border-[#E5E0D8] p-4 text-left">
                <SheetTitle className="font-sans text-lg text-[#1A1A1B]">
                  Navigation
                </SheetTitle>
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="text-left text-xs uppercase tracking-wide text-[#8C8074]"
                >
                  Maison Elite — Admin
                </Link>
              </SheetHeader>
              <nav className="p-3" aria-label="Admin navigation">
                <AdminNavList
                  pathname={pathname}
                  items={navItems}
                  collapsed={false}
                  onNavigate={() => setMobileOpen(false)}
                />
              </nav>
              <div className="flex flex-col gap-2 border-t border-[#E5E0D8] p-3">
                <AdminQuickActionDropdown
                  onNavigate={() => setMobileOpen(false)}
                  className="w-full justify-center"
                />
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-center text-sm text-[#8C8074] hover:bg-[#F9F8F6] hover:text-[#D4AF37]"
                >
                  ← Back to site
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C8074] lg:hidden">
              Admin
            </p>
            <p className="truncate font-sans text-lg font-semibold leading-tight text-[#1A1A1B] lg:text-xl">
              {header.title}
            </p>
            <p className="truncate text-xs text-[#8C8074] lg:text-sm">{header.subtitle}</p>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <AdminQuickActionDropdown />
            </div>
            <AdminNotificationsButton />
            <NavbarUserMenuDesktop
              locale={locale}
              triggerVariant="avatar-with-label"
              appearance="marketing"
            />
          </div>
        </header>

        <div className="border-b border-[#E5E0D8] bg-white/80 px-3 py-2 backdrop-blur-md sm:hidden">
          <AdminQuickActionDropdown className="w-full justify-center" />
        </div>

        <main className="flex-1 bg-[#F9F8F6] p-4 sm:p-6">{children}</main>
      </div>
    </div>
    </AdminRealtimeBookingProvider>
  )
}
