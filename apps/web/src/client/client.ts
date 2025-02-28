import type { AppRouter } from '@prompt-dev/api/trpc'
import { createTRPCReact } from '@trpc/react-query'

export const trpc = createTRPCReact<AppRouter>({})
