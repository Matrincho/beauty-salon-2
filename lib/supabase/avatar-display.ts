import type { SupabaseClient } from '@supabase/supabase-js'

export const AVATARS_BUCKET = 'avatars'

/** Values in `profiles.avatar_url` that are Storage object paths (not legacy http URLs). */
export function isStoredAvatarPath(value: string | null | undefined): boolean {
  if (!value || typeof value !== 'string') return false
  const v = value.trim()
  if (v.startsWith('http://') || v.startsWith('https://')) return false
  return true
}

export async function getAvatarDisplayUrl(
  client: SupabaseClient,
  stored: string | null | undefined,
  expiresInSec = 3600
): Promise<string | null> {
  if (!stored?.trim()) return null
  const raw = stored.trim()
  if (!isStoredAvatarPath(raw)) return raw
  const { data, error } = await client.storage
    .from(AVATARS_BUCKET)
    .createSignedUrl(raw, expiresInSec)
  if (error || !data?.signedUrl) return null
  return data.signedUrl
}
