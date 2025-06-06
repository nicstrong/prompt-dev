import { UseChatHelpers } from '@ai-sdk/react'
import { ChatRequestOptions, UIMessage } from '@ai-sdk/ui-utils'
import { createContext, useContext } from 'react'

export type ChatContextType = {
  threadId: string | null
  setThreadId: (threadId: string | null) => void
  newThread: () => void
  handleSubmit: UseChatHelpers['handleSubmit']
  handleInputChange: UseChatHelpers['handleInputChange']
  input: string
  setInput: UseChatHelpers['setInput']
  createRequestOptions: () => Promise<ChatRequestOptions | undefined>
  messages: UIMessage[]
  setModel: (updater: string | ((prev: string) => string)) => void
  model: string
}

export const ChatContext = createContext<ChatContextType | null>(null)

export function useChatContext() {
  const value = useContext(ChatContext)
  if (!value) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return value
}
