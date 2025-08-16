import { useEffect, useMemo } from 'react'
import { AppSidebar } from './AppSidebar/AppSidebar'
import { Main } from './Main'
import { SidebarInset, SidebarProvider } from './ui/sidebar'
import { SocketProvider } from '@/contexts/SocketContext'
import { useSocketEventListener } from '@/hooks/useSocketEventListener'
import {
  ChatProvider,
  ChatProviderOptions,
  useChatContext,
} from '@prompt-dev/client'
import { useTRPCThreadApi } from './Chat/use-trpc-api'
import { useAuth } from '@clerk/clerk-react'
import { useLocalStorageState } from '@/hooks/react'
import { useNavigate } from '@tanstack/react-router'

type Props = {
  threadId: string
  isNew?: boolean
  autoResume: boolean
}

function Layout(props: Props) {
  const threadApi = useTRPCThreadApi()
  const { getToken } = useAuth()
  const [model, setModel] = useLocalStorageState('model', 'gpt-4.1')
  const navigate = useNavigate()

  const chatOptions = useMemo<ChatProviderOptions>(
    () => ({
      threadApi,
      api: 'http://localhost:3000/api',
      getAuthToken: async () => {
        const res = await getToken()
        if (!res) {
          throw new Error('No auth token available')
        }
        return res
      },
      model,
      setModel,
      onMessageComplete: (threadId, isNew) => {
        if (isNew) {
          navigate({ to: `/threads/${threadId}` })
        }
      },
    }),
    [threadApi, model, setModel, getToken, navigate],
  )
  return (
    <SocketProvider>
      <ChatProvider options={chatOptions}>
        <SidebarProvider className='h-svh'>
          <InnerLayout {...props} />
        </SidebarProvider>
      </ChatProvider>
    </SocketProvider>
  )
}

function InnerLayout({ threadId, autoResume, isNew }: Props) {
  useSocketEventListener()
  const { setThreadId, setAutoResume } = useChatContext()

  useEffect(() => {
    setThreadId(threadId, !!isNew)
    setAutoResume(autoResume)
  }, [setThreadId, threadId, setAutoResume, isNew, autoResume])

  return (
    <>
      <AppSidebar />
      <SidebarInset className='min-h-0 md:peer-data-[variant=inset]:!m-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:p-2 md:peer-data-[variant=inset]:shadow-sm'>
        <Main />
      </SidebarInset>
    </>
  )
}

export default Layout
