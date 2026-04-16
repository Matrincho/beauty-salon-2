import { fetchAdminBookings } from '@/lib/admin/data'
import { AdminBookingsView } from '@/components/admin/AdminBookingsView'

export default async function AdminBookingsPage() {
  const { data, error } = await fetchAdminBookings()

  return (
    <div className="mx-auto max-w-6xl">
      <AdminBookingsView bookings={data ?? []} error={error} />
    </div>
  )
}
