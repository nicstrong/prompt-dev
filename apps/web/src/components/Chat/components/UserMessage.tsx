import { getMessageContent } from '@prompt-dev/client'
import { ChatUIMessage } from '../types'
import { Message, MessageContent } from '@/components/ai-elements/message'

type Props = {
  message: ChatUIMessage
}

export function UserMessage({ message }: Props) {
  if (message.role !== 'user') {
    return null
  }
  return (
    <Message from={message.role} key={message.id}>
      <MessageContent className='group-[.is-user]:text-neutral prose-invert group-[.is-user]:bg-neutral-700'>
        {<div>{getMessageContent(message)}</div>}
      </MessageContent>
    </Message>
  )
}
