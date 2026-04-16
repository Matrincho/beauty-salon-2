/**
 * Client-side mock state for admin Sessions (categories + service catalog only).
 * Persisted in localStorage — replace with Supabase when wiring real CRUD.
 */

export const SESSIONS_MOCK_STORAGE_KEY = 'maison-admin-sessions-mock-v4'

export type MockCategory = {
  id: string
  name: string
}

export type MockSessionType = {
  id: string
  categoryId: string
  slug: string
  title: string
  description: string
  durationMinutes: number
  basePrice: number
  currency: string
  isActive: boolean
  imageUrl: string | null
  sortOrder: number
}

export type SessionsMockState = {
  categories: MockCategory[]
  sessionTypes: MockSessionType[]
}

export function seedSessionsMockState(): SessionsMockState {
  return {
    categories: [
      { id: 'cat_hair', name: 'Hair' },
      { id: 'cat_nails', name: 'Nails' },
      { id: 'cat_body', name: 'Body' },
    ],
    sessionTypes: [
      {
        id: 'st_manicure',
        categoryId: 'cat_nails',
        slug: 'full-manicure',
        title: 'Full manicure',
        description: 'Shape, cuticle care, gel polish.',
        durationMinutes: 60,
        basePrice: 85,
        currency: 'BGN',
        isActive: true,
        imageUrl: 'https://picsum.photos/seed/manicure/320/200',
        sortOrder: 1,
      },
      {
        id: 'st_haircut',
        categoryId: 'cat_hair',
        slug: 'haircut-blowdry',
        title: 'Cut & blow-dry',
        description: 'Wash, cut, and style.',
        durationMinutes: 45,
        basePrice: 65,
        currency: 'BGN',
        isActive: true,
        imageUrl: 'https://picsum.photos/seed/haircut/320/200',
        sortOrder: 1,
      },
      {
        id: 'st_balayage',
        categoryId: 'cat_hair',
        slug: 'balayage',
        title: 'Balayage',
        description: 'Hand-painted colour and tone.',
        durationMinutes: 120,
        basePrice: 180,
        currency: 'BGN',
        isActive: true,
        imageUrl: 'https://picsum.photos/seed/balayage/320/200',
        sortOrder: 2,
      },
      {
        id: 'st_massage',
        categoryId: 'cat_body',
        slug: 'classic-massage',
        title: 'Classic massage',
        description: 'Full body relaxation.',
        durationMinutes: 50,
        basePrice: 95,
        currency: 'BGN',
        isActive: false,
        imageUrl: null,
        sortOrder: 1,
      },
    ],
  }
}

function normalizeCategory(raw: unknown): MockCategory | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (typeof o.id !== 'string' || typeof o.name !== 'string') return null
  return { id: o.id, name: o.name }
}

export function loadSessionsMockState(): SessionsMockState {
  if (typeof window === 'undefined') {
    return seedSessionsMockState()
  }
  try {
    let raw = window.localStorage.getItem(SESSIONS_MOCK_STORAGE_KEY)
    if (!raw) {
      raw =
        window.localStorage.getItem('maison-admin-sessions-mock-v3') ??
        window.localStorage.getItem('maison-admin-sessions-mock-v2') ??
        window.localStorage.getItem('maison-admin-sessions-mock-v1')
    }
    if (!raw) return seedSessionsMockState()
    const parsed = JSON.parse(raw) as Partial<SessionsMockState> & {
      scheduledSessions?: unknown
    }
    if (!parsed?.categories?.length || !Array.isArray(parsed.sessionTypes)) {
      return seedSessionsMockState()
    }
    const categories = parsed.categories
      .map(normalizeCategory)
      .filter((c): c is MockCategory => c !== null)
    if (!categories.length) return seedSessionsMockState()
    return {
      categories,
      sessionTypes: parsed.sessionTypes as MockSessionType[],
    }
  } catch {
    return seedSessionsMockState()
  }
}

export function saveSessionsMockState(state: SessionsMockState): void {
  if (typeof window === 'undefined') return
  try {
    const { categories, sessionTypes } = state
    window.localStorage.setItem(
      SESSIONS_MOCK_STORAGE_KEY,
      JSON.stringify({ categories, sessionTypes })
    )
  } catch {
    // ignore quota / private mode
  }
}

export function countTypesInCategory(
  state: SessionsMockState,
  categoryId: string
): number {
  return state.sessionTypes.filter((t) => t.categoryId === categoryId).length
}
