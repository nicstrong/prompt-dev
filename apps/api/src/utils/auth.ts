import { AuthObject, SessionAuthObject } from '@clerk/backend'
import { SignedInAuthObject, TokenType } from '@clerk/backend/internal'

export type RolesType = 'admin'

type AuthWithRoles = {
  sessionClaims?: unknown
} | null

export function hasRole(
  user: AuthWithRoles,
  role: RolesType,
): boolean {
  const claims = user?.sessionClaims
  const roles =
    claims && typeof claims === 'object'
      ? (claims as Record<string, unknown>).roles
      : undefined
  if (!Array.isArray(roles)) {
    return false
  }
  return roles.includes(role)
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
