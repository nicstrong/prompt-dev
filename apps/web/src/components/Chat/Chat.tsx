import { UseChatHelpers } from '@ai-sdk/react'
import { getTextFromDataUrl } from '@ai-sdk/ui-utils'
import { UserMessage } from './components/UserMessage'
import { AssistantMessage } from './components/AssistantMessage'

type Props = {
  chatApi: UseChatHelpers
}

export function Chat({ chatApi }: Props) {
  const { messages } = chatApi
  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col space-y-12 p-4 pb-8'>
      {messages.map((message) =>
        message.role === 'user' ? (
          <UserMessage key={message.id} message={message} />
        ) : (
          <AssistantMessage key={message.id} message={message} />
        ),
      )}
    </div>
  )
}
