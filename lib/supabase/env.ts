export type SupabasePublicEnv = { url: string; anonKey: string }

/**
 * Read public Supabase env with **literal** `process.env.NEXT_PUBLIC_*` access only.
 * Next.js replaces those at build time; dynamic keys like `process.env[name]` stay empty in the browser.
 */
function readPublicEnv(): { url: string | undefined; anonKey: string | undefined } {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
}

/** Use in the browser or anywhere Supabase should be optional (e.g. marketing shell without env). */
export function getSupabasePublicEnvOrNull(): SupabasePublicEnv | null {
  const { url, anonKey } = readPublicEnv()
  if (!url || !anonKey) return null
  return { url, anonKey }
}

/** Server-only paths that require Supabase (auth actions, protected RSC). */
export function getSupabasePublicEnv(): SupabasePublicEnv {
  const env = getSupabasePublicEnvOrNull()
  if (!env) {
    throw new Error(
      'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the project root `.env.local`, then restart `npm run dev`.'
    )
  }
  return env
}

