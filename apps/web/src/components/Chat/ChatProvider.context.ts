import { ChatStatus } from 'ai'
import { createContext, useContext } from 'react'
import { ChatUIMessage } from './ChatProvider'
import { UseChatHelpers } from '@ai-sdk/react'

type SendMessageType = UseChatHelpers<ChatUIMessage>['sendMessage']

export type ChatContextType = {
  threadId: string | null
  setThreadId: (threadId: string | null) => void
  newThread: () => void
  messages: ChatUIMessage[]
  setModel: (updater: string | ((prev: string) => string)) => void
  model: string
  status: ChatStatus
  sendMessage: SendMessageType
}

export const ChatContext = createContext<ChatContextType | null>(null)

export function useChatContext() {
  const value = useContext(ChatContext)
  if (!value) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return value
}
