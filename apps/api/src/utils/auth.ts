import { AuthObject, SessionAuthObject } from '@clerk/backend'
import { SignedInAuthObject, TokenType } from '@clerk/backend/internal'

export type RolesType = 'admin'

export function hasRole(
  user: SignedInAuthObject | null,
  role: RolesType,
): boolean {
  if (!user || !user.sessionClaims.roles) {
    return false
  }
  return (user.sessionClaims.roles as string[]).includes(role)
}

export function isSessionObject(
  auth: AuthObject | null | undefined,
): auth is SessionAuthObject {
  return (
    auth !== null &&
    auth !== undefined &&
    auth.tokenType === TokenType.SessionToken
  )
}
