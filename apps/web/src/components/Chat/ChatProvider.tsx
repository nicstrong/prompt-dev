import { useChat } from '@ai-sdk/react'
import { ChatRequestOptions } from '@ai-sdk/ui-utils'
import { useCallback, useMemo } from 'react'
import { ChatContext, ChatContextType } from './ChatProvider.provider'
import { atom, createStore, Provider, useAtom } from 'jotai'
import { useAuth } from '@clerk/clerk-react'
import { trpcClient } from '@/trpc/trpc'
export type Props = {
  children: React.ReactNode
}
const chatStore = createStore()

const threadIdAtom = atom<string | null>(null)

export function ChatProvider({ children }: Props) {
  return (
    <Provider store={chatStore}>
      <InnerChatProvider children={children} />
    </Provider>
  )
}

function InnerChatProvider({ children }: Props) {
  const [threadId, setThreadId] = useAtom(threadIdAtom)
  const { getToken } = useAuth()

  const chatApi = useChat({
    api: 'http://localhost:3000/api/chat',
  })

  const createRequestOptions = useCallback(async () => {
    const token = await getToken()
    if (!token) return
    const opts: ChatRequestOptions = {
      headers: { Authorization: `Bearer ${token}` },
      data: { threadId: threadId },
    }
    return opts
  }, [])

  const setAndLoadThreadId = useCallback(async (threadId: string | null) => {
    if (threadId !== null) {
      const messages = await trpcClient.messages.getAllForThreadId.query({
        threadId,
      })

      const transformed = messages.map((message) => ({
        ...message,
        content: message.content ?? '',
      }))
      chatApi.setMessages(transformed)
    }

    setThreadId(threadId)
  }, [])

  const value = useMemo<ChatContextType>(
    () => ({
      threadId,
      setThreadId: setAndLoadThreadId,
      createRequestOptions,
      newThread: () => {
        setThreadId(null)
      },
      handleSubmit: chatApi.handleSubmit,
      handleInputChange: chatApi.handleInputChange,
      messages: chatApi.messages,
    }),
    [chatApi],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
