import { Chat } from './Chat/Chat'
import { ChatInputBottomPanel } from './ChatInputBottomPanel'
import { ChatProvider } from './Chat/ChatProvider'
import { SidebarTrigger } from './ui/sidebar'

export const Main = () => {
  return (
    <ChatProvider>
      <main className='relative flex w-full flex-1 flex-col'>
        <SidebarTrigger />
        <Chat />
        <ChatInputBottomPanel />
      </main>
    </ChatProvider>
  )
}
