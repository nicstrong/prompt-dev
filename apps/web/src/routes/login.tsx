import { SignIn } from '@clerk/clerk-react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

const fallback = '/' as const

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth?.isSignedIn) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
  component: LoginComponent,
})

export function LoginComponent() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <SignIn />
    </div>
  )
}
