import { getCurrentUserProfile } from '@/lib/auth/profile'

export default async function DashboardPage() {
  const { user, profile } = await getCurrentUserProfile()

  return (
    <main className="min-h-screen bg-[#F9F8F6] px-6 py-10 text-[#1A1A1B]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-[#8C8074]">Maison Elite</p>
            <h1 className="text-3xl font-serif">Табло (Mockup)</h1>
            <p className="mt-2 text-sm text-[#8C8074]">
              Текуща роля:{' '}
              <span className="font-medium text-[#1A1A1B]">{profile?.role}</span>
            </p>
          </div>
          <form action="/logout" method="post">
            <button className="rounded border border-[#E5E0D8] bg-white px-4 py-2 text-sm hover:border-[#D4AF37]">
              Изход
            </button>
          </form>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded border border-[#E5E0D8] bg-white p-4">
            <h2 className="font-medium">Профил</h2>
            <p className="mt-2 text-sm text-[#8C8074]">{profile?.full_name || 'Без име'}</p>
            <p className="text-sm text-[#8C8074]">{user?.email}</p>
          </article>
          <article className="rounded border border-[#E5E0D8] bg-white p-4">
            <h2 className="font-medium">Моите резервации</h2>
            <p className="mt-2 text-sm text-[#8C8074]">Mock cards за следваща стъпка.</p>
          </article>
          <article className="rounded border border-[#E5E0D8] bg-white p-4">
            <h2 className="font-medium">Статус</h2>
            <p className="mt-2 text-sm text-[#8C8074]">
              Account: {profile?.account_status ?? 'unknown'}
            </p>
          </article>
        </section>
      </div>
    </main>
  )
}
