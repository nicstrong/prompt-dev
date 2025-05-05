import { useChat } from '@ai-sdk/react'
import { ChatRequestOptions, Message } from '@ai-sdk/ui-utils'
import { useCallback, useMemo } from 'react'
import { ChatContext, ChatContextType } from './ChatProvider.context'
import { atom, createStore, Provider, useAtom } from 'jotai'
import { useAuth } from '@clerk/clerk-react'
import { trpc, trpcClient } from '@/trpc/trpc'
import { useQueryClient } from '@tanstack/react-query'
import { Thread } from '@/trpc/types'
import { annotationSchema } from '@prompt-dev/shared-types'
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
  const queryClient = useQueryClient()

  const chatApi = useChat({
    api: 'http://localhost:3000/api/chat',
    onFinish: async (message) => {
      console.log('onFinish', message)
      if (message.annotations) {
        const parsed = message.annotations
          .map((ann) => annotationSchema.safeParse(ann))
          .filter((r) => r.success)
          .map((r) => r.data)

        parsed.forEach((annotation) => {
          switch (annotation.kind) {
            case 'thread-metadata': {
              const metadata = annotation.content
              console.log('thread-metadata annotation', metadata)
              if (metadata.isNew === true) {
                // add the thread to front of query cache
                queryClient.setQueriesData(
                  trpc.threads.getAllForUser.queryFilter(),
                  (oldData: Thread[] | undefined) => {
                    const newThread = {
                      id: metadata.threadId,
                      name: metadata.name,
                      createdAt: metadata.createdAt,
                      updatedAt: metadata.updatedAt,
                      userId: metadata.userId,
                    }
                    return oldData ? [newThread, ...oldData] : [newThread]
                  },
                )
              } else {
                setThreadId(metadata.threadId)
              }
            }
          }
        })
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
