import { ChatInput } from './ChatInput'

export const ChatInputBottomPanel = () => {
  return (
    <div className='absolute bottom-0 w-full pr-2'>
      <div className='relative z-10 mx-auto flex w-full max-w-3xl flex-col text-center'>
        <ChatInput />
      </div>
    </div>
  )
}
