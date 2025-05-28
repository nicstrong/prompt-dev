/// <reference types="@clerk/express/env" />

declare global {
  interface CustomJwtSessionClaims {
    full_name?: string
    roles?: string[]
  }
}
