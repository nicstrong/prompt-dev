import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
  component: AuthedLayout,
})

function AuthedLayout() {
  return (
    <>
      {/* Render Outlet if user is signed in */}
      <SignedIn>
        <Outlet />
      </SignedIn>
      {/* Redirect to sign-in if user is signed out */}
      <SignedOut>
        <Navigate to='/login' />
      </SignedOut>
    </>
  )
}
