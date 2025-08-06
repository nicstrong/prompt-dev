import { useEffect, useMemo } from 'react'
import { AppSidebar } from './AppSidebar/AppSidebar'
import { Main } from './Main'
import { SidebarInset, SidebarProvider } from './ui/sidebar'
import { SocketProvider } from '@/contexts/SocketContext'
import { useSocketEventListener } from '@/hooks/useSocketEventListener'
import { ChatProvider, useChatContext } from '@prompt-dev/client'
import { useTRPCThreadApi } from './Chat/use-trpc-api'
import { useAuth } from '@clerk/clerk-react'
import { useLocalStorageState } from '@/hooks/react'

type Props = {
  threadId?: string
}

function Layout(props: Props) {
  const threadApi = useTRPCThreadApi()
  const { getToken } = useAuth()
  const [model, setModel] = useLocalStorageState('model', 'gpt-4.1')

  const chatOptions = useMemo(
    () => ({
      threadApi,
      api: 'http://localhost:3000/api/chat',
      getAuthToken: async () => {
        const res = await getToken()
        if (!res) {
          throw new Error('No auth token available')
        }
        return res
      },
      model,
      setModel,
    }),
    [threadApi, getToken, model, setModel],
  )
  return (
    <SocketProvider>
      <ChatProvider options={chatOptions}>
        <SidebarProvider>
          <InnerLayout {...props} />
        </SidebarProvider>
      </ChatProvider>
    </SocketProvider>
  )
}

function InnerLayout({ threadId }: Props) {
  useSocketEventListener()
  const { setThreadId } = useChatContext()

  useEffect(() => {
    setThreadId(threadId ?? null)
  }, [setThreadId, threadId])

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Main />
      </SidebarInset>
    </>
  )
}

export default Layout
