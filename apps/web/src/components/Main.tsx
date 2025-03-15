import { useChat } from '@ai-sdk/react'
import { Chat } from './Chat/Chat'
import { ChatInputBottomPanel } from './ChatInputBottomPanel'

export const Main = () => {
  const chatApi = useChat({ api: 'http://localhost:3000/api/chat' })
  console.log(chatApi)
  return (
    <main className='relative flex w-full flex-1 flex-col'>
      <Chat chatApi={chatApi} />
      <ChatInputBottomPanel chatApi={chatApi} />
    </main>
  )
}
