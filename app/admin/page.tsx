import { getCurrentUserProfile } from '@/lib/auth/profile'

export default async function AdminDashboardPage() {
  const { user, profile } = await getCurrentUserProfile()

  return (
    <main className="min-h-screen bg-[#F9F8F6] px-6 py-10 text-[#1A1A1B]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-[#8C8074]">Maison Elite</p>
            <h1 className="text-3xl font-serif">Админ табло (Mockup)</h1>
            <p className="mt-2 text-sm text-[#8C8074]">
              Вписан като: <span className="font-medium text-[#1A1A1B]">{user?.email}</span> ({' '}
              {profile?.role} )
            </p>
          </div>
          <form action="/logout" method="post">
            <button className="rounded border border-[#E5E0D8] bg-white px-4 py-2 text-sm hover:border-[#D4AF37]">
              Изход
            </button>
          </form>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {['Потребители', 'Резервации', 'Услуги', 'Екип'].map((item) => (
            <article
              key={item}
              className="rounded border border-[#E5E0D8] bg-white p-4 shadow-sm"
            >
              <h2 className="font-medium">{item}</h2>
              <p className="mt-2 text-sm text-[#8C8074]">Mock KPI / list placeholder.</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}

