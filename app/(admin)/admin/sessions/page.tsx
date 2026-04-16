import { Suspense } from 'react'
import { fetchAdminActiveSessionsBookings } from '@/lib/admin/data'
import { SessionsManagementClient } from '@/components/admin/sessions/SessionsManagementClient'

export default async function AdminSessionsHubPage() {
  const { data: activeBookings, error: activeBookingsError } =
    await fetchAdminActiveSessionsBookings()

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl rounded-xl border border-[#E5E0D8] bg-white p-8 text-center text-sm text-[#8C8074]">
          Loading sessions…
        </div>
      }
    >
      <SessionsManagementClient
        activeBookings={activeBookings ?? []}
        activeBookingsError={activeBookingsError}
      />
    </Suspense>
  )
}
