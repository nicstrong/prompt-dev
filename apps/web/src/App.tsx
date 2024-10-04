import css from './App.module.scss'
import { trpc } from './client/client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { useState } from 'react'

function App() {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/trpc',
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              //authorization: getAuthCookie(),
            }
          },
        }),
      ],
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Content />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

function Content() {
  const userList = trpc.userList.useQuery()
  return (
    <div className={css.App}>
      <header className={css.AppHeader}>
        <h1>Users</h1>
      </header>
      <div className={css.AppContent}>
        {userList.data ? (
          <ul>
            {userList.data.users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
}

export default App
