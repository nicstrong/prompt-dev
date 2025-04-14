import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { type AppRouter } from '@prompt-dev/api/dist/index.cjs'

// Export the router type
export type { AppRouter }

// Export inferred input and output types
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
