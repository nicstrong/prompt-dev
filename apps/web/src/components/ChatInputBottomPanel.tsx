import { ChatInput } from './Chat/ChatInput'

export const ChatInputBottomPanel = () => {
  return (
    <div className='absolute bottom-0 z-10 w-full px-2'>
      <div className='bg-input-background relative mx-auto flex w-full max-w-3xl flex-col rounded-md text-center backdrop-blur-xl'>
        <ChatInput />
      </div>
    </div>
  )
}
