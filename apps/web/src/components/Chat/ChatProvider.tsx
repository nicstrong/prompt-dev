import { UIMessage, useChat } from '@ai-sdk/react'
import { useCallback, useEffect, useMemo } from 'react'
import { ChatContext, ChatContextType } from './ChatProvider.context'
import { atom, createStore, Provider, useAtom } from 'jotai'
import { useAuth } from '@clerk/clerk-react'
import { trpc, trpcClient } from '@/trpc/trpc'
import { useQueryClient } from '@tanstack/react-query'
import { useLocalStorageState } from '@/hooks/react'
import { DefaultChatTransport } from 'ai'
import { scopedLog } from 'scope-log'
import { MessageMetadata, Thread } from '@prompt-dev/shared-types'
export type Props = {
  children: React.ReactNode
}
const chatStore = createStore()

const threadIdAtom = atom<string | null>(null)
const log = scopedLog('ChatProvider')

export type ChatUIMessage = UIMessage<MessageMetadata>

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
  const [model, setModel] = useLocalStorageState('model', 'gpt-4.1')

  const { status, messages, setMessages, sendMessage } = useChat<ChatUIMessage>(
    {
      transport: new DefaultChatTransport({
        api: 'http://localhost:3000/api/chat',
        headers: async () => ({
          Authorization: `Bearer ${await getToken()}`,
        }),
        body: () => ({
          data: {
            threadId: threadId,
            model,
          },
        }),
      }),
      onFinish: ({ message }) => {
        log('onFinish', message)
        if (message.metadata) {
          const metadata = message.metadata
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
      },
    },
  )

  useEffect(() => {
    console.log('sendMessage: ', sendMessage)
  }, [sendMessage])

  const setAndLoadThreadId = useCallback(
    async (threadId: string | null) => {
      if (threadId !== null) {
        const thread = await trpcClient.messages.getAllForThreadId.query({
          threadId,
        })
        setMessages(thread?.messages ?? [])
      }
      setThreadId(threadId)
    },
    [setMessages, setThreadId],
  )

  const value = useMemo<ChatContextType>(
    () => ({
      threadId,
      setThreadId: setAndLoadThreadId,
      newThread: () => {
        setThreadId(null)
      },
      messages,
      setModel: setModel,
      model: model,
      status,
      sendMessage,
    }),
    [
      threadId,
      setAndLoadThreadId,
      messages,
      setModel,
      model,
      status,
      sendMessage,
      setThreadId,
    ],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
