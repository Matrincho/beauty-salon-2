import { getCurrentUserProfile } from '@/lib/auth/profile'
import { fetchAdminProfiles } from '@/lib/admin/data'
import { AdminClientsView } from '@/components/admin/AdminClientsView'

export default async function AdminClientsPage() {
  const { profile } = await getCurrentUserProfile()
  const { data, error } = await fetchAdminProfiles()

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="max-w-2xl space-y-1">
        <h2 className="font-sans text-lg font-semibold text-[#1A1A1B]">Client directory</h2>
        <p className="text-sm leading-relaxed text-[#8C8074]">
          Live data from the <span className="font-medium text-[#1A1A1B]/80">profiles</span> table in
          Supabase. Search and filter everyone with an account; open a row to view details — admins
          can edit or remove access from there.
        </p>
      </div>
      <AdminClientsView
        profiles={data ?? []}
        error={error}
        canManageRoles={profile?.role === 'admin'}
        actorId={profile?.id}
      />
    </div>
  )
}
