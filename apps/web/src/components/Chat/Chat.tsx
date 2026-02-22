import { useEffect } from 'react'
import { UserMessage } from './components/UserMessage'
import { AssistantMessage } from './components/AssistantMessage'
import { useChatContext, useStableMessages } from '@prompt-dev/client'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'

import { Loader } from '@/components/ai-elements/loader'

export function Chat() {
  const { messages, status } = useChatContext()
  const { stableMessages, generatingMessage } = useStableMessages(
    status,
    messages,
  )
  useEffect(() => {
    if (generatingMessage) {
      const summary = generatingMessage.parts
        .map((message) => {
          if (message.type === 'text') {
            return `${message.type}: ${message.text.length > 20 ? `...${message.text.substring(message.text.length - 20)}` : message.text}`
          }
          return `${message.type}:`
        })
        .join('\n')
      console.log(`[Chat] generatingMessage:\n${summary}`)
    }
  }, [generatingMessage])

  const isGenerating =
    status === 'submitted' ||
    (status === 'streaming' &&
      generatingMessage !== undefined &&
      generatingMessage.parts.every((part) => part.type !== 'text'))

  return (
    <Conversation className='relative overflow-y-auto pb-32'>
      <ConversationContent className='pb-10-pt-safe-offset-10 mx-auto flex w-full max-w-4xl flex-col space-y-4 px-4'>
        {stableMessages.map((message) =>
          message.role === 'user' ? (
            <UserMessage key={message.id} message={message} />
          ) : (
            <AssistantMessage key={message.id} message={message} />
          ),
        )}
        {!isGenerating && generatingMessage && (
          <AssistantMessage
            key={generatingMessage.id}
            message={generatingMessage}
          />
        )}
        {isGenerating && <Loader size={32} className='fill-current' />}
      </ConversationContent>
      <ConversationScrollButton className='hover:bg-secondary bottom-36 backdrop-blur-xl' />
    </Conversation>
  )
}
