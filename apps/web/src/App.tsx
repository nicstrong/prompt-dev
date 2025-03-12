import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient, trpcClient, TRPCProvider } from './trpc/trpc'
import { SideNav } from './components/SideNav'
import { Main } from './components/Main'

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
  return (
    <div className='relative flex h-[100dvh] text-gray-100'>
      <SideNav />
      <Main />
    </div>
  )
}

export default App
