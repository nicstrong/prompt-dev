import { UserMessage } from './components/UserMessage'
import { AssistantMessage } from './components/AssistantMessage'
import { useChatContext } from './ChatProvider.context'

type Props = {}

export function Chat({}: Props) {
  const { messages } = useChatContext()
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
