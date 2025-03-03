import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from './query-client'
import { createTRPCClient, httpBatchLink } from '@trpc/client';



import { useState } from 'react'

let clientQueryClientSingleton: QueryClient | undefined = undefined

const getQueryClient = () => {
  return (clientQueryClientSingleton ??= createQueryClient())
}

import type { AppRouter } from '@prompt-dev/api/api'
import { TRPCProvider } from './trpc';


export function TRPCReactProvider(props: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    const [trpcClient] = useState(() =>
      createTRPCClient<AppRouter>({
        links: [
          httpBatchLink({
            url: 'http://localhost:2022',
          }),
        ],
      }),
    );
  

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}