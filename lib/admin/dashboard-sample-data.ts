/** Sample table rows for session admin pages until full CRUD is wired. */

export type AdminSummaryCard = {
  title: string
  value: string
  hint: string
}

export const adminDashboardSummaryCards: AdminSummaryCard[] = [
  { title: 'Bookings today', value: '12', hint: '3 awaiting confirmation' },
  { title: 'Clients (total)', value: '248', hint: '+6 this month' },
  { title: 'Active services', value: '18', hint: '4 categories' },
  { title: 'Revenue (estimate)', value: 'BGN 2,240', hint: 'Paid in person' },
]

export type AdminQuickAction = {
  label: string
  href: string
  description: string
}

export const adminQuickActions: AdminQuickAction[] = [
  {
    label: 'New booking',
    href: '/admin/bookings',
    description: 'Schedule and statuses.',
  },
  {
    label: 'New client',
    href: '/admin/clients',
    description: 'Directory and profiles.',
  },
  {
    label: 'New category',
    href: '/admin/sessions?tab=categories',
    description: 'Group services in the catalog.',
  },
  {
    label: 'New service',
    href: '/admin/sessions?tab=catalog',
    description: 'Pricing, duration, visibility.',
  },
]

export type SampleCategoryRow = {
  id: string
  name: string
  servicesCount: number
}

export const sampleSessionCategoryRows: SampleCategoryRow[] = [
  { id: 'cat1', name: 'Hair', servicesCount: 6 },
  { id: 'cat2', name: 'Nails', servicesCount: 4 },
  { id: 'cat3', name: 'Body', servicesCount: 3 },
]

export type SampleSessionTypeRow = {
  id: string
  title: string
  slug: string
  durationMin: number
  price: string
  active: boolean
}

export const sampleSessionTypeRows: SampleSessionTypeRow[] = [
  {
    id: 'st1',
    title: 'Full manicure',
    slug: 'full-manicure',
    durationMin: 60,
    price: 'BGN 85',
    active: true,
  },
  {
    id: 'st2',
    title: 'Haircut',
    slug: 'haircut',
    durationMin: 45,
    price: 'BGN 65',
    active: true,
  },
  {
    id: 'st3',
    title: 'Classic massage',
    slug: 'classic-massage',
    durationMin: 50,
    price: 'BGN 95',
    active: false,
  },
]
