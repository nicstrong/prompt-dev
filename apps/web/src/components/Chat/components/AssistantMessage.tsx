import { ChatUIMessage } from '../types'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'

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
              return (
                <MessageResponse key={`${message.id}-${i}`}>
                  {part.text}
                </MessageResponse>
              )
            default:
              return null
          }
        })}
      </MessageContent>
    </Message>
  )
}
