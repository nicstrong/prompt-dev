import { ChatUIMessage } from '../types'
import { Message, MessageContent } from '@/components/ai-elements/message'
import { Response } from '@/components/ai-elements/response'

type Props = {
  message: ChatUIMessage
}

export function AssistantMessage({ message }: Props) {
  if (message.role !== 'assistant') {
    return null
  }

  return (
    <Message from={message.role} key={message.id}>
      <MessageContent className='group-[.is-assistant]:text-neutral prose-invert group-[.is-assistant]:bg-transparent'>
        {message.parts.map((part, i) => {
          switch (part.type) {
            case 'text':
              return <Response key={`${message.id}-${i}`}>{part.text}</Response>
            default:
              return null
          }
        })}
      </MessageContent>
    </Message>
  )
}
