import { ChatStatus } from 'ai'
import { createContext, useContext } from 'react'
import { ChatUIMessage } from './ChatProvider'
import { UseChatHelpers } from '@ai-sdk/react'

type SendMessageType = UseChatHelpers<ChatUIMessage>['sendMessage']

export type ChatContextType = {
  threadId: string | null
  setThreadId: (threadId: string, isNew: boolean) => void
  messages: ChatUIMessage[]
  setModel: (model: string) => void
  model: string | null
  status: ChatStatus
  sendMessage: SendMessageType
  autoResume: boolean
  setAutoResume: (autoResume: boolean) => void
  stop: () => Promise<void>
}

export const ChatContext = createContext<ChatContextType | null>(null)

export function useChatContext() {
  const value = useContext(ChatContext)
  if (!value) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return value
}
