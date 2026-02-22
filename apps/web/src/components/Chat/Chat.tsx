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
import { cn } from '@/lib/utils'

export function Chat() {
  const { messages, status } = useChatContext()
  // const { stableMessages, generatingMessage } = useStableMessages(
  //   status,
  //   messages,
  // )

  // const isGeneratingFirstTextPart =
  //   status === 'submitted' ||
  //   (status === 'streaming' &&
  //     generatingMessage !== undefined &&
  //     generatingMessage.parts.every((part) => part.type !== 'text'))

  // useEffect(() => {
  //   if (generatingMessage) {
  //     const summary = generatingMessage.parts
  //       .filter((p) => p.type === 'text')
  //       .map((message) => {
  //         return `${message.type}: ${message.text.length > 20 ? `...${JSON.stringify(message.text.substring(message.text.length - 20))}` : JSON.stringify(message.text)}`
  //       })
  //       .join('\n')
  //     console.log(
  //       `[Chat] generatingMessage(${isGeneratingFirstTextPart}): ${summary}`,
  //     )
  //   }
  // }, [generatingMessage, isGeneratingFirstTextPart])

  return (
    // <Conversation
    //   className={cn(
    //     'relative overflow-y-auto pb-32',
    //     !isGeneratingFirstTextPart && generatingMessage && 'bg-red-800',
    //   )}
    // >
    <div className='relative overflow-y-auto pb-32'>
      {/* <ConversationContent className='pb-10-pt-safe-offset-10 mx-auto flex w-full max-w-4xl flex-col space-y-4 px-4'> */}
      <div className='pb-10-pt-safe-offset-10 mx-auto flex w-full max-w-4xl flex-col space-y-4 px-4'>
        {messages.map((message, index) =>
          message.role === 'user' ? (
            <UserMessage key={message.id} message={message} />
          ) : (
            <AssistantMessage
              key={message.id}
              message={message}
              debug={index === messages.length - 1}
            />
          ),
        )}
        {/* {!isGeneratingFirstTextPart && generatingMessage && (
          <AssistantMessage
            key={generatingMessage.id}
            message={generatingMessage}
            debug
          />
        )} */}
        {/* {isGeneratingFirstTextPart && (
          <Loader size={32} className='fill-current' />
        )} */}
        {/* </ConversationContent> */}
      </div>
      {/* <ConversationScrollButton className='hover:bg-secondary bottom-36 backdrop-blur-xl' /> */}
      {/* </Conversation> */}
    </div>
  )
}
