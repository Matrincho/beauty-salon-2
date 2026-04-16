/**
 * Pure helpers for profile display strings. Safe to import from Client Components
 * (no `next/headers` or server Supabase client).
 */
export type ProfileNameSlice = {
  first_name?: string | null
  last_name?: string | null
  full_name?: string | null
}

/** Display name from structured name fields, falling back to legacy full_name. */
export function profileDisplayName(
  profile: ProfileNameSlice | null | undefined
): string | null {
  if (!profile) return null
  const parts = [profile.first_name, profile.last_name]
    .map((s) => s?.trim())
    .filter((s): s is string => Boolean(s && s.length > 0))
  if (parts.length > 0) return parts.join(' ')
  const legacy = profile.full_name?.trim()
  return legacy && legacy.length > 0 ? legacy : null
}
