import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'
import { useChatContext } from './ChatProvider.context'
import { ModelSelect } from './ModelSelect'

export const ChatInput = () => {
  const {
    handleSubmit,
    createRequestOptions,
    handleInputChange,
    model,
    setModel,
    input,
    setInput,
  } = useChatContext()

  const onSubmit = async () => {
    const opts = await createRequestOptions()
    handleSubmit({}, opts)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      const cursorPosition = (e.target as HTMLTextAreaElement).selectionStart
      const textBeforeCursor = input.substring(0, cursorPosition)
      const textAfterCursor = input.substring(cursorPosition)

      const newValue = `${textBeforeCursor}\n${textAfterCursor}`
      setInput(newValue)

      // Set cursor position after the inserted newline
      setTimeout(() => {
        const textarea = document.getElementById(
          'chatMessage',
        ) as HTMLTextAreaElement
        if (textarea) {
          textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1
        }
      }, 0)
    }
  }

  return (
    <div className='relative flex w-full flex-col items-stretch gap-2 rounded-t-xl px-3 py-3'>
      <div className='flex flex-grow flex-col'>
        <div>
          <Textarea
            className='bg-input-background dark:bg-input-background max-h-64 resize-none border-0 backdrop-blur-xl focus-visible:border-0 focus-visible:ring-0'
            id='chatMessage'
            name='chatMessage'
            value={input}
            onChange={(e) => {
              handleInputChange(e)
            }}
            onKeyDown={(e) => handleKeyDown(e)}
            placeholder='Type your message here...'
            data-1p-ignore
          />
        </div>
        <div className='flex flex-1'>
          <ModelSelect
            value={model}
            onValueChange={(v) => {
              console.log('Model changed to:', v)
              setModel(v)
            }}
          />

          <Button
            className='absolute right-3 bottom-3 ml-auto rounded-lg border-1 border-sky-900 bg-[#0284c740] text-neutral-100 hover:bg-[#0284c790]'
            type='submit'
            disabled={input.length === 0}
            onClick={onSubmit}
          >
            <Send />
          </Button>
        </div>
      </div>
    </div>
  )
}
