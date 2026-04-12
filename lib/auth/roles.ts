export const USER_ROLES = ['admin', 'staff', 'user', 'client'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const ACCOUNT_STATUSES = [
  'active',
  'pending_review',
  'rejected',
  'banned',
] as const
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number]

export function getDefaultRedirectPath(role: UserRole | null | undefined) {
  if (role === 'admin' || role === 'staff') {
    return '/admin'
  }

  return '/dashboard'
}

