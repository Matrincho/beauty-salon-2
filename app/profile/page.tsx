import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUserProfile, type ProfileResult } from '@/lib/auth/profile'
import { profileDisplayName } from '@/lib/auth/profile-display'
import { getDefaultRedirectPath } from '@/lib/auth/roles'
import { updateProfileAction } from '@/app/profile/actions'
import { getAvatarDisplayUrl } from '@/lib/supabase/avatar-display'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ProfileAvatarHeader } from '@/components/profile/ProfileAvatarHeader'

type ProfilePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function profileInitials(
  profile: Pick<ProfileResult, 'first_name' | 'last_name' | 'full_name'> | null | undefined,
  email: string
): string {
  const name = profileDisplayName(profile)?.trim()
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
    profileDisplayName(profile)?.trim() || user.email?.split('@')[0] || '—'
  const initials = profileInitials(profile, user.email ?? '')

  return (
    <main className="min-h-screen bg-[#F9F8F6] px-6 py-10 pt-24 md:pt-28 text-[#1A1A1B]">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-serif">Профил</h1>
        <p className="mt-2 text-sm text-[#8C8074]">
          Редактирай контактните си данни и адреса. Имейлът се управлява от акаунта в Supabase Auth.
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="font-sans text-xs uppercase tracking-widest text-[#8C8074]"
                >
                  Име
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  defaultValue={profile?.first_name ?? ''}
                  className="mt-1.5 w-full rounded border border-[#E5E0D8] bg-white px-3 py-2 text-sm text-[#1A1A1B] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="font-sans text-xs uppercase tracking-widest text-[#8C8074]"
                >
                  Фамилия
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  defaultValue={profile?.last_name ?? ''}
                  className="mt-1.5 w-full rounded border border-[#E5E0D8] bg-white px-3 py-2 text-sm text-[#1A1A1B] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-[minmax(0,7rem)_1fr]">
              <div>
                <label
                  htmlFor="phonePrefix"
                  className="font-sans text-xs uppercase tracking-widest text-[#8C8074]"
                >
                  Код
                </label>
                <input
                  id="phonePrefix"
                  name="phonePrefix"
                  type="text"
                  inputMode="tel"
                  autoComplete="tel-country-code"
                  defaultValue={profile?.phone_prefix ?? ''}
                  placeholder="+359"
                  className="mt-1.5 w-full rounded border border-[#E5E0D8] bg-white px-3 py-2 text-sm text-[#1A1A1B] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="font-sans text-xs uppercase tracking-widest text-[#8C8074]"
                >
                  Телефон
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel-national"
                  defaultValue={profile?.phone_number ?? ''}
                  className="mt-1.5 w-full rounded border border-[#E5E0D8] bg-white px-3 py-2 text-sm text-[#1A1A1B] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="addressLine1"
                className="font-sans text-xs uppercase tracking-widest text-[#8C8074]"
              >
                Адрес, ред 1
              </label>
              <input
                id="addressLine1"
                name="addressLine1"
                type="text"
                autoComplete="address-line1"
                defaultValue={profile?.address_line_1 ?? ''}
                className="mt-1.5 w-full rounded border border-[#E5E0D8] bg-white px-3 py-2 text-sm text-[#1A1A1B] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="addressLine2"
                className="font-sans text-xs uppercase tracking-widest text-[#8C8074]"
              >
                Адрес, ред 2
              </label>
              <input
                id="addressLine2"
                name="addressLine2"
                type="text"
                autoComplete="address-line2"
                defaultValue={profile?.address_line_2 ?? ''}
                className="mt-1.5 w-full rounded border border-[#E5E0D8] bg-white px-3 py-2 text-sm text-[#1A1A1B] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className="font-sans text-xs uppercase tracking-widest text-[#8C8074]">
                  Град
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  defaultValue={profile?.city ?? ''}
                  className="mt-1.5 w-full rounded border border-[#E5E0D8] bg-white px-3 py-2 text-sm text-[#1A1A1B] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="county" className="font-sans text-xs uppercase tracking-widest text-[#8C8074]">
                  Област
                </label>
                <input
                  id="county"
                  name="county"
                  type="text"
                  autoComplete="address-level1"
                  defaultValue={profile?.county ?? ''}
                  className="mt-1.5 w-full rounded border border-[#E5E0D8] bg-white px-3 py-2 text-sm text-[#1A1A1B] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="postcode"
                  className="font-sans text-xs uppercase tracking-widest text-[#8C8074]"
                >
                  Пощенски код
                </label>
                <input
                  id="postcode"
                  name="postcode"
                  type="text"
                  autoComplete="postal-code"
                  defaultValue={profile?.postcode ?? ''}
                  className="mt-1.5 w-full rounded border border-[#E5E0D8] bg-white px-3 py-2 text-sm text-[#1A1A1B] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="font-sans text-xs uppercase tracking-widest text-[#8C8074]"
                >
                  Държава
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  autoComplete="country-name"
                  defaultValue={profile?.country ?? ''}
                  className="mt-1.5 w-full rounded border border-[#E5E0D8] bg-white px-3 py-2 text-sm text-[#1A1A1B] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
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
