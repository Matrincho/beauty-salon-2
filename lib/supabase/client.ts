'use client'

import { createBrowserClient } from '@supabase/ssr'
import { getSupabasePublicEnvOrNull } from './env'

/** Returns `null` when public env is missing so the marketing UI still renders (navbar account menu shows guest). */
export function createSupabaseBrowserClient() {
  const env = getSupabasePublicEnvOrNull()
  if (!env) return null
  return createBrowserClient(env.url, env.anonKey)
}

