'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, LogOut, UserRound } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { getAvatarDisplayUrl } from '@/lib/supabase/avatar-display'
import type { Locale } from '@/lib/i18n/translations'
import { translations as tr, t } from '@/lib/i18n/translations'
import type { UserRole } from '@/lib/auth/roles'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type MenuState = {
  loading: boolean
  signedIn: boolean
  email: string | null
  avatarUrl: string | null
  fullName: string | null
  role: UserRole | null
}

/** Dashboard href for account menu; staff uses admin dashboard like routing elsewhere. */
function dashboardHrefForRole(role: UserRole | null): string | null {
  if (role === 'admin' || role === 'staff') {
    return '/admin'
  }
  if (role === 'user' || role === 'client') {
    return '/dashboard'
  }
  return null
}

function getInitials(fullName: string | null, email: string | null): string {
  const name = fullName?.trim()
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2)
    }
    return name.slice(0, 2).toUpperCase()
  }
  const local = email?.split('@')[0]
  if (local && local.length > 0) {
    return local.slice(0, 2).toUpperCase()
  }
  return '?'
}

function useNavbarAuth(): MenuState {
  const [state, setState] = useState<MenuState>({
    loading: true,
    signedIn: false,
    email: null,
    avatarUrl: null,
    fullName: null,
    role: null,
  })

  const load = useCallback(async () => {
    const supabase = createSupabaseBrowserClient()
    if (!supabase) {
      setState({
        loading: false,
        signedIn: false,
        email: null,
        avatarUrl: null,
        fullName: null,
        role: null,
      })
      return
    }
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setState({
        loading: false,
        signedIn: false,
        email: null,
        avatarUrl: null,
        fullName: null,
        role: null,
      })
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url, full_name, role')
      .eq('id', user.id)
      .single()

    const avatarDisplay = await getAvatarDisplayUrl(supabase, profile?.avatar_url, 3600)

    setState({
      loading: false,
      signedIn: true,
      email: user.email ?? null,
      avatarUrl: avatarDisplay,
      fullName: profile?.full_name ?? null,
      role: (profile?.role as UserRole | null) ?? null,
    })
  }, [])

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    if (!supabase) {
      const id = requestAnimationFrame(() => {
        setState({
          loading: false,
          signedIn: false,
          email: null,
          avatarUrl: null,
          fullName: null,
          role: null,
        })
      })
      return () => cancelAnimationFrame(id)
    }
    const run = () => {
      void load()
    }
    const id = requestAnimationFrame(run)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      requestAnimationFrame(run)
    })
    return () => {
      cancelAnimationFrame(id)
      subscription.unsubscribe()
    }
  }, [load])

  return state
}

function AvatarCircle({
  avatarUrl,
  initials,
  className,
  initialsTextClassName = 'text-sm',
}: {
  avatarUrl: string | null
  initials: string
  className?: string
  initialsTextClassName?: string
}) {
  if (avatarUrl) {
    return (
      <span
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E5E0D8] bg-[#F9F8F6] ${className ?? ''}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase/storage URLs */}
        <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
      </span>
    )
  }
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#C4A35A] font-sans font-semibold uppercase tracking-tight text-white shadow-inner ${initialsTextClassName} ${className ?? ''}`}
      aria-hidden
    >
      {initials.slice(0, 2)}
    </span>
  )
}

export function NavbarUserMenuDesktop({ locale }: { locale: Locale }) {
  const auth = useNavbarAuth()
  const logoutFormRef = useRef<HTMLFormElement>(null)
  const initials = getInitials(auth.fullName, auth.email)

  if (auth.loading) {
    return <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-[#E5E0D8]" aria-hidden />
  }

  if (!auth.signedIn) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="font-sans text-xs uppercase tracking-widest text-[#1A1A1B]/60 hover:text-[#D4AF37] transition-colors duration-200"
        >
          {t(tr.nav.login, locale)}
        </Link>
        <Link
          href="/signup"
          className="font-sans text-xs uppercase tracking-widest text-[#1A1A1B] border border-[#E5E0D8] rounded-md px-3 py-2 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-200"
        >
          {t(tr.nav.signup, locale)}
        </Link>
      </div>
    )
  }

  const displayName =
    auth.fullName?.trim() || auth.email?.split('@')[0] || '—'
  const dashboardHref = dashboardHrefForRole(auth.role)

  return (
    <>
      <form ref={logoutFormRef} action="/logout" method="post" className="hidden" aria-hidden />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F8F6]"
            aria-label={t(tr.nav.accountMenu, locale)}
          >
            <AvatarCircle avatarUrl={auth.avatarUrl} initials={initials} className="h-9 w-9" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="z-[200] w-64 border-[#E5E0D8] bg-white p-0 shadow-lg"
        >
          <DropdownMenuLabel className="cursor-default border-b border-[#E5E0D8] px-3 py-3 font-normal">
            <p
              className="truncate font-sans text-sm font-semibold text-[#1A1A1B]"
              title={displayName}
            >
              {displayName}
            </p>
            <p
              className="mt-0.5 truncate font-sans text-xs text-[#8C8074]"
              title={auth.email ?? undefined}
            >
              {auth.email}
            </p>
          </DropdownMenuLabel>
          <div className="py-1">
            <DropdownMenuItem asChild className="cursor-pointer px-3 py-2.5 focus:bg-[#F9F8F6]">
              <Link href="/profile" className="flex items-center gap-2 font-sans text-sm text-[#1A1A1B]">
                <UserRound className="h-4 w-4 text-[#8C8074]" aria-hidden />
                {t(tr.nav.profile, locale)}
              </Link>
            </DropdownMenuItem>
            {dashboardHref ? (
              <DropdownMenuItem asChild className="cursor-pointer px-3 py-2.5 focus:bg-[#F9F8F6]">
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-2 font-sans text-sm text-[#1A1A1B]"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#8C8074]" aria-hidden />
                  {t(tr.nav.dashboard, locale)}
                </Link>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator className="bg-[#E5E0D8]" />
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer px-3 py-2.5 focus:bg-red-50"
              onSelect={(event) => {
                event.preventDefault()
                logoutFormRef.current?.requestSubmit()
              }}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              {t(tr.nav.logOut, locale)}
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export function NavbarUserMenuMobile({
  locale,
  onNavigate,
}: {
  locale: Locale
  onNavigate: () => void
}) {
  const auth = useNavbarAuth()
  const initials = getInitials(auth.fullName, auth.email)

  if (auth.loading) {
    return <div className="mt-6 h-10 w-full animate-pulse rounded bg-[#E5E0D8]" aria-hidden />
  }

  if (!auth.signedIn) {
    return (
      <div className="w-full mt-6 flex flex-col gap-2">
        <Link
          href="/login"
          onClick={onNavigate}
          className="font-serif text-2xl text-[#1A1A1B] py-3 border-b border-[#E5E0D8] w-full hover:text-[#D4AF37] transition-colors duration-200"
        >
          {t(tr.nav.login, locale)}
        </Link>
        <Link
          href="/signup"
          onClick={onNavigate}
          className="font-serif text-2xl text-[#1A1A1B] py-3 border-b border-[#E5E0D8] w-full hover:text-[#D4AF37] transition-colors duration-200"
        >
          {t(tr.nav.signup, locale)}
        </Link>
      </div>
    )
  }

  const dashboardHref = dashboardHrefForRole(auth.role)

  return (
    <div className="w-full mt-6 border-t border-[#E5E0D8] pt-6">
      <div className="flex items-center gap-3 mb-4">
        <AvatarCircle
          avatarUrl={auth.avatarUrl}
          initials={initials}
          className="h-12 w-12"
          initialsTextClassName="text-lg"
        />
        <div className="min-w-0">
          <p className="truncate font-sans text-base font-semibold text-[#1A1A1B]">
            {auth.fullName?.trim() || auth.email?.split('@')[0] || t(tr.nav.accountMenu, locale)}
          </p>
          <p className="truncate font-sans text-sm text-[#8C8074]">{auth.email}</p>
        </div>
      </div>
      <Link
        href="/profile"
        onClick={onNavigate}
        className="flex items-center gap-2 font-serif text-2xl text-[#1A1A1B] py-3 border-b border-[#E5E0D8] w-full hover:text-[#D4AF37] transition-colors duration-200"
      >
        <UserRound className="h-6 w-6 shrink-0 text-[#8C8074]" aria-hidden />
        {t(tr.nav.profile, locale)}
      </Link>
      {dashboardHref ? (
        <Link
          href={dashboardHref}
          onClick={onNavigate}
          className="flex items-center gap-2 font-serif text-2xl text-[#1A1A1B] py-3 border-b border-[#E5E0D8] w-full hover:text-[#D4AF37] transition-colors duration-200"
        >
          <LayoutDashboard className="h-6 w-6 shrink-0 text-[#8C8074]" aria-hidden />
          {t(tr.nav.dashboard, locale)}
        </Link>
      ) : null}
      <form action="/logout" method="post" className="mt-2">
        <button
          type="submit"
          className="flex w-full items-center gap-2 font-serif text-2xl text-red-700 py-3 border-b border-[#E5E0D8] text-left hover:text-red-800 transition-colors duration-200"
        >
          <LogOut className="h-6 w-6 shrink-0" aria-hidden />
          {t(tr.nav.logOut, locale)}
        </button>
      </form>
    </div>
  )
}
