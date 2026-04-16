import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9F8F6] px-4 text-[#1A1A1B]">
      <section className="w-full max-w-md rounded-xl border border-[#E5E0D8] bg-white p-6 text-center shadow-sm">
        <h1 className="font-sans text-2xl font-semibold text-[#1A1A1B]">Access denied</h1>
        <p className="mt-1 text-sm text-[#8C8074]">You are not authorized to view this page.</p>
        <p className="mt-3 text-sm text-[#8C8074]">
          Only accounts with the{' '}
          <span className="font-medium text-[#1A1A1B]">admin</span> role can open{' '}
          <span className="font-mono text-xs text-[#1A1A1B]">/admin</span>.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg border border-[#E5E0D8] bg-white px-4 py-2 text-sm text-[#1A1A1B] transition-colors hover:border-[#D4AF37]/60 hover:text-[#D4AF37]"
          >
            Go to dashboard
          </Link>
          <form action="/logout" method="post">
            <button
              type="submit"
              className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#1A1A1B] hover:bg-[#c9a227]"
            >
              Sign out
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
