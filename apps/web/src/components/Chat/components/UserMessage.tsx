import { UIMessage } from '@ai-sdk/ui-utils'

type Props = {
  message: UIMessage
}

export function UserMessage({ message }: Props) {
  if (message.role !== 'user') {
    return null
  }
  return (
    <div className='flex justify-end'>
      <div className='prose prose-neutral prose-invert group text-left" relative inline-block max-w-[80%] rounded-2xl bg-neutral-700 p-4 break-words'>
        {message.content}
      </div>
    </div>
  )
}
