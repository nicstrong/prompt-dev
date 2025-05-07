import { Chat } from './Chat/Chat'
import { ChatInputBottomPanel } from './ChatInputBottomPanel'
import { SidebarTrigger } from './ui/sidebar'

export const Main = () => {
  return (
    <main className='relative flex w-full flex-1 flex-col overflow-hidden'>
      <div className='absolute top-0 bottom-0 w-full'>
        <SidebarTrigger />
        <Chat />
        <ChatInputBottomPanel />
      </div>
    </main>
  )
}
