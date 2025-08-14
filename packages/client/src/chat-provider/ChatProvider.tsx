import { useChat } from '@ai-sdk/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChatContext, ChatContextType } from './ChatProvider.context'
import { createIdGenerator, DefaultChatTransport } from 'ai'

import { ChatProviderOptions, ChatUIMessage } from './ChatProvider.types'
import { Provider as JotaiProvider } from 'jotai'
import { chatStore, setConfig } from './ChatProvider.atom'
import { urlConcat } from '~/utils/url'

export type Props = {
  children: React.ReactNode
  options: ChatProviderOptions
}

const generateId = createIdGenerator({ size: 24 })

type ThreadState = { threadId: string; isNew: boolean }

export function ChatProvider({ children, options }: Props) {
  const [threadState, setThreadState] = useState<ThreadState>({
    threadId: generateId(),
    isNew: true,
  })
  const [autoResume, setAutoResume] = useState<boolean>(false)

  const [modelInState, setModelInState] = useState<string | null>(null)
  const setModel = useRef(options?.setModel ?? setModelInState)
  const model = useMemo(
    () => (options?.model !== undefined ? options.model : modelInState),
    [options?.model, modelInState],
  )

  useEffect(() => {
    setConfig(options)
    console.log('[ChatProvider] options=', options)
  }, [options])

  const threadStateRef = useRef(threadState)
  threadStateRef.current = threadState

  const getAuthToken = options?.getAuthToken
  const { status, messages, setMessages, sendMessage, stop, error } =
    useChat<ChatUIMessage>({
      transport: new DefaultChatTransport({
        api: options?.api ? urlConcat(options.api, 'chat') : undefined,
        fetch: options?.fetch,
        headers: getAuthToken
          ? async () => ({
              Authorization: `Bearer ${await getAuthToken()}`,
            })
          : undefined,
        body: () => ({
          data: {
            threadId: threadStateRef.current.threadId,
            isNew: threadStateRef.current.isNew,
            model,
          },
        }),
      }),
      onData: (data) => {
        console.log(`[ChatProvider] onData: `, data)
      },
      onFinish: ({ message }) => {
        console.log(`[ChatProvider] onFinish: `, message.metadata)

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
            const isNew = threadState.isNew
            setThreadState((prev) => ({ ...prev, isNew: false }))
          }
          options.onMessageComplete?.(
            message.metadata.threadId,
            message.metadata.isNew,
            message.id,
          )
        }
      },
    })

  useEffect(() => {
    console.log(`[ChatProvider] Status=${status}`)
    if (status === 'error' && error) {
      console.error(`[ChatProvider] Error: ${error.message}`)
    }
  }, [status, error])

  const setAndLoadThreadId = useCallback(
    async (threadId: string, isNew: boolean) => {
      if (isNew) {
        console.log(`[ChatProvider] New thread: ${threadId}`)
        setThreadState({ threadId: threadId, isNew: true })
        setMessages([])
      } else {
        const thread = await options.threadApi.getThreadWithMessages(threadId)
        console.log(
          `[ChatProvider] Loaded thread: ${threadId} with messages: ${thread?.messages.length}`,
        )
        setThreadState({ threadId: threadId, isNew: false })
        setMessages(thread?.messages ?? [])
      }
    },
    [setMessages, setThreadState],
  )

  const value = useMemo<ChatContextType>(
    () => ({
      threadId: threadState.threadId,
      setThreadId: setAndLoadThreadId,
      messages,
      setModel: (model) => setModel.current(model),
      model: model,
      status,
      sendMessage,
      setAutoResume,
      autoResume,
      stop,
    }),
    [
      threadState.threadId,
      setAndLoadThreadId,
      messages,
      setModel,
      model,
      status,
      sendMessage,
      setAutoResume,
      autoResume,
      stop,
    ],
  )

  return (
    <JotaiProvider store={chatStore}>
      <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
    </JotaiProvider>
  )
}
