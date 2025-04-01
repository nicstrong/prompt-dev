import { UseChatHelpers } from '@ai-sdk/react'
import { ChatRequestOptions, UIMessage } from '@ai-sdk/ui-utils'
import { createContext, useContext } from 'react'

export type ChatContextType = {
  threadId: string | null
  newThread: () => void
  handleSubmit: UseChatHelpers['handleSubmit']
  handleInputChange: UseChatHelpers['handleInputChange']
  createRequestOptions: () => Promise<ChatRequestOptions | undefined>
  messages: UIMessage[]
}

export const ChatContext = createContext<ChatContextType | null>(null)

export function useChatContext() {
  const value = useContext(ChatContext)
  if (!value) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return value
}
