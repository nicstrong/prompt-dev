import { SignedInAuthObject } from '@clerk/backend/internal'

export type RolesType = 'admin'

export function hasRole(
  user: SignedInAuthObject | null,
  role: RolesType,
): boolean {
  if (!user || !user.sessionClaims.roless) {
    return false
  }
  return user.sessionClaims.roles.includes(role)
}
