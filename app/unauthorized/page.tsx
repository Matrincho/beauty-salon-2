import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-[#F9F8F6] px-4 text-[#1A1A1B] flex items-center justify-center">
      <section className="w-full max-w-md rounded border border-[#E5E0D8] bg-white p-6 text-center">
        <h1 className="text-2xl font-serif">Нямаш достъп</h1>
        <p className="mt-1 text-sm text-[#8C8074]">Not authorized</p>
        <p className="mt-3 text-sm text-[#8C8074]">
          Профилът ти няма права за администраторската част. Само роли{' '}
          <span className="font-medium text-[#1A1A1B]">admin</span> и{' '}
          <span className="font-medium text-[#1A1A1B]">staff</span> могат да отварят{' '}
          <span className="font-mono text-xs">/admin</span>.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard" className="rounded border border-[#E5E0D8] px-4 py-2 text-sm">
            Към таблото
          </Link>
          <form action="/logout" method="post">
            <button className="rounded bg-[#1A1A1B] px-4 py-2 text-sm text-white">
              Изход
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
