import { useEffect } from 'react'
import { AppSidebar } from './AppSidebar'
import { ChatProvider } from './Chat/ChatProvider'
import { useChatContext } from './Chat/ChatProvider.provider'
import { Main } from './Main'
import { SidebarInset, SidebarProvider } from './ui/sidebar'

type Props = {
  threadId?: string
}

function Layout(props: Props) {
  return (
    <ChatProvider>
      <SidebarProvider>
        <InnerLayout {...props} />
      </SidebarProvider>
    </ChatProvider>
  )
}

function InnerLayout({ threadId }: Props) {
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
