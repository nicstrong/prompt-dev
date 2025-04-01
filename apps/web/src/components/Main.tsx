import { useChat } from '@ai-sdk/react'
import { Chat } from './Chat/Chat'
import { ChatInputBottomPanel } from './ChatInputBottomPanel'
import { trpc } from '@/trpc/trpc'
import { useQuery } from '@tanstack/react-query'

export const Main = () => {
  const chatApi = useChat({ api: 'http://localhost:3000/api/chat' })

  const { data } = useQuery(trpc.threads.getAll.queryOptions())

  console.log('chatApi', chatApi)
  console.log('data', data)
  return (
    <main className='relative flex w-full flex-1 flex-col'>
      <Chat chatApi={chatApi} />
      <ChatInputBottomPanel chatApi={chatApi} />
    </main>
  )
}
