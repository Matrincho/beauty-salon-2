import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUserProfile } from '@/lib/auth/profile'
import { getDefaultRedirectPath } from '@/lib/auth/roles'
import { updateProfileAction } from '@/app/profile/actions'
import { getAvatarDisplayUrl } from '@/lib/supabase/avatar-display'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ProfileAvatarHeader } from '@/components/profile/ProfileAvatarHeader'

type ProfilePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function profileInitials(fullName: string | null | undefined, email: string): string {
  const name = fullName?.trim()
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2)
    }
    return name.slice(0, 2).toUpperCase()
  }
  const local = email.split('@')[0]
  if (local && local.length > 0) {
    return local.slice(0, 2).toUpperCase()
  }
  return '?'
}

const avatarErrorMessages: Record<string, string> = {
  no_file: 'Избери файл (JPEG, PNG или WebP).',
  too_large: 'Файлът е над 5 MB.',
  invalid_type: 'Позволени са само JPEG, PNG и WebP.',
  upload_failed: 'Качването в хранилището не бе успешно.',
  profile_failed: 'Снимката е качена, но профилът не бе обновен.',
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const { user, profile } = await getCurrentUserProfile()

  if (!user) {
    redirect('/login')
  }

  const supabase = await createSupabaseServerClient()
  const avatarPreviewUrl = await getAvatarDisplayUrl(
    supabase,
    profile?.avatar_url,
    60 * 60 * 24
  )

  const params = await searchParams
  const saved = params.saved === '1'
  const saveFailed = params.error === 'save_failed'
  const avatarSaved = params.avatar_saved === '1'
  const avatarRemoved = params.avatar_removed === '1'
  const avatarErrorKey =
    typeof params.avatar_error === 'string' ? params.avatar_error : ''
  const avatarErrorMessage = avatarErrorMessages[avatarErrorKey]

  const hubHref = profile ? getDefaultRedirectPath(profile.role) : '/dashboard'
  const displayName =
    profile?.full_name?.trim() || user.email?.split('@')[0] || '—'
  const initials = profileInitials(profile?.full_name, user.email ?? '')

  return (
    <main className="min-h-screen bg-[#F9F8F6] px-6 py-10 pt-24 md:pt-28 text-[#1A1A1B]">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-serif">Профил</h1>
        <p className="mt-2 text-sm text-[#8C8074]">
          Редактирай снимката, името и телефона си. Имейлът се управлява от акаунта в Supabase Auth.
        </p>

        {saved ? (
          <p className="mt-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
            Промените са запазени.
          </p>
        ) : null}
        {saveFailed ? (
          <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            Неуспешно запазване. Опитай отново.
          </p>
        ) : null}
        {avatarSaved ? (
          <p className="mt-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
            Снимката е обновена.
          </p>
        ) : null}
        {avatarRemoved ? (
          <p className="mt-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
            Снимката е премахната.
          </p>
        ) : null}
        {avatarErrorMessage ? (
          <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {avatarErrorMessage}
          </p>
        ) : null}

        <section className="mt-8 rounded border border-[#E5E0D8] bg-white p-6 shadow-sm md:p-8">
          <ProfileAvatarHeader
            avatarPreviewUrl={avatarPreviewUrl}
            initials={initials}
            displayName={displayName}
            email={user.email ?? ''}
            hasStoredAvatar={Boolean(profile?.avatar_url)}
          />

          <form action={updateProfileAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="fullName" className="font-sans text-xs uppercase tracking-widest text-[#8C8074]">
                Име
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                defaultValue={profile?.full_name ?? ''}
                className="mt-1.5 w-full rounded border border-[#E5E0D8] bg-white px-3 py-2 text-sm text-[#1A1A1B] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="phone" className="font-sans text-xs uppercase tracking-widest text-[#8C8074]">
                Телефон
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                defaultValue={profile?.phone ?? ''}
                placeholder="+359 ..."
                className="mt-1.5 w-full rounded border border-[#E5E0D8] bg-white px-3 py-2 text-sm text-[#1A1A1B] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded bg-[#1A1A1B] px-4 py-2.5 text-sm font-medium text-white hover:opacity-95"
            >
              Запази промените
            </button>
          </form>

          <dl className="mt-8 space-y-4 border-t border-[#E5E0D8] pt-6 text-sm">
            <div>
              <dt className="font-sans text-xs uppercase tracking-widest text-[#8C8074]">Роля</dt>
              <dd className="mt-1 font-medium">{profile?.role ?? '—'}</dd>
            </div>
            <div>
              <dt className="font-sans text-xs uppercase tracking-widest text-[#8C8074]">
                Статус на акаунта
              </dt>
              <dd className="mt-1 font-medium">{profile?.account_status ?? '—'}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded border border-[#E5E0D8] bg-white px-4 py-2 text-sm hover:border-[#D4AF37]"
            >
              Начало
            </Link>
            <Link
              href={hubHref}
              className="rounded bg-[#1A1A1B] px-4 py-2 text-sm text-white hover:opacity-95"
            >
              Табло
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
