import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import css from './App.module.scss'
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
    <div className={css.App}>
      <header className={css.AppHeader}>
        <h1>Users</h1>
      </header>
      <div className={css.AppContent}>
        <span>{data?.greeting}</span>
      </div>
    </div>
  )
}

export default App
