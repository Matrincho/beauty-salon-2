import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabasePublicEnvOrNull } from './env'

const authRoutes = ['/login', '/signup']

type ProfileRow = {
  role: 'admin' | 'staff' | 'user' | 'client'
  account_status: 'active' | 'pending_review' | 'rejected' | 'banned'
}

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url))
}

function isAuthRoute(pathname: string) {
  return authRoutes.some((route) => pathname.startsWith(route))
}

function isProtectedRoute(pathname: string) {
  return (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/app') ||
    pathname.startsWith('/profile')
  )
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const publicEnv = getSupabasePublicEnvOrNull()
  if (!publicEnv) {
    return response
  }
  const { url, anonKey } = publicEnv

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        )
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const pathname = request.nextUrl.pathname
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    if (isProtectedRoute(pathname)) {
      return redirectTo(request, '/login')
    }
    return response
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, account_status')
    .eq('id', user.id)
    .single<ProfileRow>()

  if (profile?.account_status === 'banned' || profile?.account_status === 'rejected') {
    await supabase.auth.signOut()
    return redirectTo(request, '/login?status=suspended')
  }

  if (pathname.startsWith('/admin') && profile?.role !== 'admin' && profile?.role !== 'staff') {
    return redirectTo(request, '/unauthorized')
  }

  if (pathname.startsWith('/dashboard')) {
    if (profile?.role === 'admin' || profile?.role === 'staff') {
      return redirectTo(request, '/admin')
    }
    if (profile?.role !== 'user' && profile?.role !== 'client') {
      return redirectTo(request, '/unauthorized')
    }
  }

  if (pathname.startsWith('/app')) {
    if (profile?.role === 'admin' || profile?.role === 'staff') {
      return redirectTo(request, '/admin')
    }
    return redirectTo(request, '/dashboard')
  }

  if (isAuthRoute(pathname)) {
    if (profile?.role === 'admin' || profile?.role === 'staff') {
      return redirectTo(request, '/admin')
    }
    return redirectTo(request, '/dashboard')
  }

  return response
}

