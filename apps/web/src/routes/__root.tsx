import type { TRPC } from '@/trpc/trpc'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { LoadedClerk } from '@clerk/types'

interface MyRouterContext {
  queryClient: QueryClient
  trpc: TRPC
  auth?: LoadedClerk
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position='bottom-right' />
    </>
  ),
})
