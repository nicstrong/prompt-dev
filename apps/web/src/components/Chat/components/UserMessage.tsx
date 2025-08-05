import { ChatUIMessage } from '../ChatProvider'

type Props = {
  message: ChatUIMessage
}

export function UserMessage({ message }: Props) {
  if (message.role !== 'user') {
    return null
  }
  return (
    <div data-message-id={message.id} className='flex justify-end'>
      <div className='prose prose-neutral prose-invert group text-left" relative inline-block max-w-[80%] rounded-2xl bg-neutral-700 p-4 break-words'>
        {message.parts
          .map((part) => (part.type === 'text' ? part.text : ''))
          .join('')}
      </div>
    </div>
  )
}
