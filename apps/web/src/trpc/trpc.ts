import { AppRouter } from '@prompt-dev/trpc-api'

import { createTRPCContext } from '@trpc/tanstack-react-query'
import superjson from 'superjson';

import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { createQueryClient } from './query-client'
import { QueryClient } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'

export const { TRPCProvider, useTRPC, useTRPCClient } =
    createTRPCContext<AppRouter>()

let clientQueryClientSingleton: QueryClient | undefined = undefined

export const getQueryClient = () => {
    return (clientQueryClientSingleton ??= createQueryClient())
}

export const trpcClient = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({ url: 'http://localhost:3000/trpc', transformer: superjson }),
    ],
})
export const trpc = createTRPCOptionsProxy<AppRouter>({
    client: trpcClient,
    queryClient: getQueryClient(),
})
