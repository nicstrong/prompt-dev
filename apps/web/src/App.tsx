import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { getQueryClient, trpcClient, TRPCProvider, useTRPC } from './trpc/trpc'

function App() {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <TRPCProvider trpcClient={trpcClient} queryClient={getQueryClient()}>
        <Content />
      </TRPCProvider>
    </QueryClientProvider>
  )
}

function Content() {
  const trpc = useTRPC()

  const { data } = useQuery(trpc.messages.hello.queryOptions({ text: 'world' }))

  return (
    <div className='dark'>
    </div>
  )
}

export default App
