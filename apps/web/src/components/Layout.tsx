import { useEffect } from 'react'
import { AppSidebar } from './AppSidebar/AppSidebar'
import { ChatProvider } from './Chat/ChatProvider'
import { useChatContext } from './Chat/ChatProvider.context'
import { Main } from './Main'
import { SidebarInset, SidebarProvider } from './ui/sidebar'
import { SocketProvider } from '@/contexts/SocketContext'
import { useSocketEventListener } from '@/hooks/useSocketEventListener'

type Props = {
  threadId?: string
}

function Layout(props: Props) {
  return (
    <SocketProvider>
      <ChatProvider>
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
  }, [threadId])

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
