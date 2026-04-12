import Link from 'next/link'
import { redirect } from 'next/navigation'
import { signupAction } from '@/app/(auth)/actions'
import { getCurrentUserProfile } from '@/lib/auth/profile'
import { getDefaultRedirectPath } from '@/lib/auth/roles'

type SignupPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const errorMap: Record<string, string> = {
  missing_fields: 'Please fill in email and password.',
  signup_failed: 'Could not create account. Please try again.',
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { profile } = await getCurrentUserProfile()

  if (profile) {
    redirect(getDefaultRedirectPath(profile.role))
  }

  const params = await searchParams
  const errorKey = typeof params.error === 'string' ? params.error : ''

  return (
    <main className="min-h-screen bg-[#F9F8F6] text-[#1A1A1B] flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded border border-[#E5E0D8] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-serif">Регистрация</h1>
        <p className="mt-2 text-sm text-[#8C8074]">
          Създай акаунт, за да тестваш потребителския поток.
        </p>

        {errorMap[errorKey] ? (
          <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMap[errorKey]}
          </p>
        ) : null}

        <form action={signupAction} className="mt-5 space-y-4">
          <div className="space-y-1">
            <label htmlFor="fullName" className="text-sm font-medium">
              Име (по избор)
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="w-full rounded border border-[#E5E0D8] px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded border border-[#E5E0D8] px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              Парола
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded border border-[#E5E0D8] px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-[#1A1A1B] px-4 py-2 text-sm font-medium text-white hover:opacity-95"
          >
            Създай акаунт
          </button>
        </form>

        <p className="mt-4 text-sm text-[#8C8074]">
          Имаш акаунт?{' '}
          <Link href="/login" className="text-[#1A1A1B] underline">
            Вход
          </Link>
        </p>
      </section>
    </main>
  )
}

