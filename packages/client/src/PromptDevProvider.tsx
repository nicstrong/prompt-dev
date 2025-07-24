import { useMemo } from 'react'
import { PromptDevContext } from './PromptDevProvider.context'
import { ApiOptions } from './types'
import { Provider as JotaiProvider, createStore } from 'jotai'
import { initializeConfig } from './config'
import { initializeQueryClient } from './queryClient'
import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from '@tanstack/react-query'

type Store = ReturnType<typeof createStore>

export type Props = {
  options: ApiOptions
  jotaiStore?: Store
  queryClient?: QueryClient
  queryClientOptions?: QueryClientConfig
  children: React.ReactNode
}

export function PromptDevProvider({
  options,
  jotaiStore,
  children,
  queryClient,
  queryClientOptions,
}: Props) {
  const store = useMemo(
    () => initializeConfig(jotaiStore, options),
    [jotaiStore, options],
  )

  const rqClient = useMemo(
    () => initializeQueryClient(queryClient, queryClientOptions),
    [queryClient],
  )

  return (
    <JotaiProvider store={store}>
      <QueryClientProvider client={rqClient}>
        <PromptDevContext.Provider value={{}}>
          {children}
        </PromptDevContext.Provider>
      </QueryClientProvider>
    </JotaiProvider>
  )
}
