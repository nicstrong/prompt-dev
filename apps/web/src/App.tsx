import { useQuery } from '@tanstack/react-query';
import css from './App.module.scss'
import { TRPCReactProvider } from './trpc/react'
import { useTRPC } from './trpc/trpc';

function App() {
  return (
    <TRPCReactProvider>
      <Content />
    </TRPCReactProvider>
  )
}

function Content() {
  const trpc = useTRPC();
  const messages =   useQuery(trpc.messages({ id: 'id_bilbo' }));


  return (
    <div className={css.App}>
      <header className={css.AppHeader}>
        <h1>Users</h1>
      </header>
      <div className={css.AppContent}>
        
      </div>
    </div>
  )
}

export default App
