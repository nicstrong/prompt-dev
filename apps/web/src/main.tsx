import { scan } from 'react-scan' // must be imported before React and React DOM

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { createRouter } from './router.tsx'
import { RouterProvider } from '@tanstack/react-router'
import { ClerkProvider, useClerk } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import { LogLevel, setLogLevel } from 'scope-log'

const router = createRouter()

setLogLevel('$:*', LogLevel.DEBUG)

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

function InnerApp() {
  const auth = useClerk()
  return <RouterProvider router={router} context={{ auth }} />
}

export function App() {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl='/'
    >
      <InnerApp />
    </ClerkProvider>
  )
}

scan({
  enabled: true,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
