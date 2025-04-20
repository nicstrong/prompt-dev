import { useChat } from '@ai-sdk/react'
import { ChatRequestOptions, JSONValue, Message } from '@ai-sdk/ui-utils'
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
    onFinish: async (message) => {
      if (message.annotations) {
        const threadIdObj = message.annotations.find((ann) =>
          isThreadIdAnnotation(ann),
        )
        if (threadIdObj) {
          setThreadId(threadIdObj.threadId)
        }
      }
    },
  })

  const createRequestOptions = useCallback(async () => {
    const token = await getToken()
    if (!token) return
    const opts: ChatRequestOptions = {
      headers: { Authorization: `Bearer ${token}` },
      data: { threadId: threadId },
    }
    return opts
  }, [threadId, getToken])

  const setAndLoadThreadId = useCallback(async (threadId: string | null) => {
    if (threadId !== null) {
      const messages = await trpcClient.messages.getAllForThreadId.query({
        threadId,
      })

      const transformed = messages.map(
        (message) =>
          ({
            ...message,
            content: message.content ?? '',
          }) as Message,
      )
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

function isThreadIdAnnotation(value: JSONValue): value is { threadId: string } {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  if (Array.isArray(value)) {
    return false
  }

  if (!Object.prototype.hasOwnProperty.call(value, 'threadId')) {
    return false
  }

  if (typeof (value as { threadId?: unknown }).threadId !== 'string') {
    return false
  }
  return true
}
