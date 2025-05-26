import { UserMessage } from './components/UserMessage'
import { AssistantMessage } from './components/AssistantMessage'
import { useChatContext } from './ChatProvider.context'

export function Chat() {
  const { messages } = useChatContext()
  return (
    <div className='absolute inset-0 overflow-y-scroll pb-32'>
      <div className='pb-10-pt-safe-offset-10 mx-auto flex w-full max-w-3xl flex-col space-y-4 px-4'>
        {messages.map((message) =>
          message.role === 'user' ? (
            <UserMessage key={message.id} message={message} />
          ) : (
            <AssistantMessage key={message.id} message={message} />
          ),
        )}
      </div>
    </div>
  )
}
