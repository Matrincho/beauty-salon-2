import { getCurrentUserProfile } from '@/lib/auth/profile'

export async function requireAdmin() {
  const { user, profile } = await getCurrentUserProfile()
  if (!user?.id || profile?.role !== 'admin') {
    throw new Error('You do not have permission for this action.')
  }
  return { user, profile }
}
