import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary'
import { NotFound } from './components/NotFound'
import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient, trpc, trpcClient, TRPCProvider } from './trpc/trpc'

const queryClient = getQueryClient()

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: {
      auth: undefined,
      trpc,
      queryClient,
    },
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
    Wrap: function WrapComponent({ children }) {
      return (
        <QueryClientProvider client={getQueryClient()}>
          <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
            {children}
          </TRPCProvider>
        </QueryClientProvider>
      )
    },
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
