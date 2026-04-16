import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'
import { getCurrentUserProfile } from '@/lib/auth/profile'
export default async function AdminRouteGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await getCurrentUserProfile()

  return (
    <AdminLayoutClient userRole={profile?.role ?? null}>
      {children}
    </AdminLayoutClient>
  )
}
