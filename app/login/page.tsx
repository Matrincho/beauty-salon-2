import Link from 'next/link'
import { redirect } from 'next/navigation'
import { loginAction } from '@/app/(auth)/actions'
import { getCurrentUserProfile } from '@/lib/auth/profile'
import { getDefaultRedirectPath } from '@/lib/auth/roles'

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const errorMap: Record<string, string> = {
  missing_fields: 'Please fill in both email and password.',
  invalid_credentials: 'Invalid credentials. Please try again.',
}

const messageMap: Record<string, string> = {
  account_created: 'Account created. You can now log in.',
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { profile } = await getCurrentUserProfile()

  if (profile) {
    redirect(getDefaultRedirectPath(profile.role))
  }

  const params = await searchParams
  const errorKey = typeof params.error === 'string' ? params.error : ''
  const messageKey = typeof params.message === 'string' ? params.message : ''

  return (
    <main className="min-h-screen bg-[#F9F8F6] text-[#1A1A1B] flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded border border-[#E5E0D8] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-serif">Вход</h1>
        <p className="mt-2 text-sm text-[#8C8074]">
          Влез в акаунта си, за да тестваш роли и табла.
        </p>

        {errorMap[errorKey] ? (
          <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMap[errorKey]}
          </p>
        ) : null}

        {messageMap[messageKey] ? (
          <p className="mt-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {messageMap[messageKey]}
          </p>
        ) : null}

        <form action={loginAction} className="mt-5 space-y-4">
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
            Вход
          </button>
        </form>

        <p className="mt-4 text-sm text-[#8C8074]">
          Нямаш акаунт?{' '}
          <Link href="/signup" className="text-[#1A1A1B] underline">
            Регистрация
          </Link>
        </p>
      </section>
    </main>
  )
}

