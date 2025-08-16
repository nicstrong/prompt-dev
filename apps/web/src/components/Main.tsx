import { Chat } from './Chat/Chat'
import { ChatInputBottomPanel } from './ChatInputBottomPanel'
import { SidebarTrigger } from './ui/sidebar'

export const Main = () => {
  return (
    <div className='relative flex min-h-0 w-full flex-1 flex-col'>
      <SidebarTrigger className='absolute top-0 left-0' />
      <Chat />
      <ChatInputBottomPanel />
    </div>
  )
}
