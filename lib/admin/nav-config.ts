import type { UserRole } from '@/lib/auth/roles'

export type AdminNavItem = {
  id: string
  label: string
  href: string
  /** If set, user must have one of these roles. If omitted, visible to all admins. */
  roles?: UserRole[]
  /** Extra path prefixes that should highlight this item (e.g. legacy session sub-routes). */
  activePathPrefixes?: string[]
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/admin' },
  {
    id: 'sessions',
    label: 'Sessions',
    href: '/admin/sessions',
    activePathPrefixes: [
      '/admin/sessions',
      '/admin/session-categories',
      '/admin/session-types',
    ],
  },
  { id: 'clients', label: 'Clients', href: '/admin/clients' },
  { id: 'bookings', label: 'Bookings', href: '/admin/bookings' },
]

export function filterAdminNavForRole(
  items: AdminNavItem[],
  role: UserRole | null
): AdminNavItem[] {
  return items.filter((item) => {
    if (!item.roles?.length) return true
    if (!role) return false
    return item.roles.includes(role)
  })
}

export function isAdminNavItemActive(pathname: string, item: AdminNavItem): boolean {
  if (item.href === '/admin') {
    return pathname === '/admin'
  }
  if (item.activePathPrefixes?.length) {
    for (const prefix of item.activePathPrefixes) {
      if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
        return true
      }
    }
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

export function getAdminHeaderCopy(pathname: string): {
  title: string
  subtitle: string
} {
  if (pathname === '/admin') {
    return {
      title: 'Dashboard overview',
      subtitle: 'Monitor performance and manage key activities.',
    }
  }
  if (
    pathname.startsWith('/admin/sessions') ||
    pathname.startsWith('/admin/session-categories') ||
    pathname.startsWith('/admin/session-types')
  ) {
    return {
      title: 'Sessions',
      subtitle: 'Categories, catalog, and active sessions',
    }
  }
  if (pathname.startsWith('/admin/bookings')) {
    return {
      title: 'Bookings',
      subtitle: 'Appointments and statuses',
    }
  }
  if (pathname.startsWith('/admin/clients')) {
    return {
      title: 'Clients',
      subtitle: 'Supabase profiles · search and roles',
    }
  }
  return {
    title: 'Admin',
    subtitle: 'Maison Elite',
  }
}
