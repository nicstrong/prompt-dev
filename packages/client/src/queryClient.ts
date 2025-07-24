import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { QueryClientConfig } from '@tanstack/react-query'

let internalClient: QueryClient | null = null
function getOrCreateInternalClient(options?: QueryClientConfig) {
  if (!internalClient) {
    internalClient = new QueryClient(
      options || {
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // Example: 5 minutes
            retry: 1, // Customize as needed
          },
          mutations: {
            retry: 0,
          },
        },
      },
    )
  }
  return internalClient
}

// Function to initialize/get the client (called in provider)
export function initializeQueryClient(
  providedClient?: QueryClient,
  options?: QueryClientConfig,
): QueryClient {
  return providedClient || getOrCreateInternalClient(options)
}

// Accessor for non-React contexts (e.g., imperative fetches)
let activeClient: QueryClient | null = null // Set during initialization
export function getQueryClient(): QueryClient {
  if (!activeClient) {
    throw new Error(
      'QueryClient not initialized. Wrap your app in <PromptDevProvider>.',
    )
  }
  return activeClient
}
