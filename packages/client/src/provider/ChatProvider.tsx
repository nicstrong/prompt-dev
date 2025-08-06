import { UIMessage, useChat } from '@ai-sdk/react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { ChatContext, ChatContextType } from './ChatProvider.context'
import { atom, createStore, Provider, useAtom } from 'jotai'
import { useQueryClient } from '@tanstack/react-query'
import { DefaultChatTransport } from 'ai'
import { MessageMetadata } from '@prompt-dev/shared-types'
import { ChatProviderOptions } from './ChatProvider.types'

const chatStore = createStore()

const threadIdAtom = atom<string | null>(null)

export type ChatUIMessage = UIMessage<MessageMetadata>

export type Props = {
  children: React.ReactNode
  options: ChatProviderOptions
}

export function ChatProvider({ children, ...props }: Props) {
  return (
    <Provider store={chatStore}>
      <InnerChatProvider children={children} {...props} />
    </Provider>
  )
}

function InnerChatProvider({ children, options }: Props) {
  const [threadId, setThreadId] = useAtom(threadIdAtom)
  const queryClient = useQueryClient()

  const [modelInState, setModelInState] = useState<string | null>(null)
  const setModel = useRef(options?.setModel ?? setModelInState)
  const model = useMemo(
    () => (options?.model !== undefined ? options.model : modelInState),
    [options?.model, modelInState],
  )

  const getAuthToken = options?.getAuthToken
  const { status, messages, setMessages, sendMessage } = useChat<ChatUIMessage>(
    {
      transport: new DefaultChatTransport({
        api: options?.api,
        headers: getAuthToken
          ? async () => ({
              Authorization: `Bearer ${await getAuthToken()}`,
            })
          : undefined,
        body: () => ({
          data: {
            threadId: threadId,
            model,
          },
        }),
      }),
      onFinish: ({ message }) => {
        if (message.metadata) {
          const metadata = message.metadata
          if (metadata.isNew === true) {
            const newThread = {
              id: metadata.threadId,
              name: metadata.name,
              createdAt: metadata.createdAt,
              updatedAt: metadata.updatedAt,
              userId: metadata.userId,
            }
            options.threadApi.updateThreadCache(newThread)
          } else {
            setThreadId(metadata.threadId)
          }
        }
      },
    },
  )

  const setAndLoadThreadId = useCallback(
    async (threadId: string | null) => {
      if (threadId !== null) {
        const thread = await options.threadApi.getThreadWithMessages(threadId)
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
      setModel: (model) => setModel.current(model),
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
