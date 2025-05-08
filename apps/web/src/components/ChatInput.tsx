import { useForm } from '@tanstack/react-form'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import { useChatContext } from './Chat/ChatProvider.context'
import { ModelSelect } from './Chat/ModelSelect'
import { useLocalStorageState } from '@/hooks/react'

type Props = {}

export const ChatInput = ({}: Props) => {
  const { handleSubmit, handleInputChange, createRequestOptions } =
    useChatContext()

  const [model, setModel] = useLocalStorageState('model', 'gpt-4.1')

  const form = useForm({
    defaultValues: {
      chatMessage: '',
      model: model,
    },

    onSubmit: async ({ formApi }) => {
      const opts = await createRequestOptions()
      handleSubmit({}, opts)
      formApi.reset()
    },
  })

  const handleKeyDown = (
    e: React.KeyboardEvent,
    field: any,
    submit: () => void,
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      const cursorPosition = (e.target as HTMLTextAreaElement).selectionStart
      const textBeforeCursor = field.state.value.substring(0, cursorPosition)
      const textAfterCursor = field.state.value.substring(cursorPosition)

      const newValue = `${textBeforeCursor}\n${textAfterCursor}`
      field.handleChange(newValue)

      // Set cursor position after the inserted newline
      setTimeout(() => {
        const textarea = document.getElementById(
          field.name,
        ) as HTMLTextAreaElement
        if (textarea) {
          textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1
        }
      }, 0)
    }
  }

  return (
    <form
      className='relative flex w-full flex-col items-stretch gap-2 rounded-t-xl px-3 py-3'
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className='flex flex-grow flex-col'>
        <div>
          <form.Field
            name='chatMessage'
            children={(field) => (
              <>
                <Textarea
                  className='bg-input-background dark:bg-input-background max-h-64 resize-none border-0 backdrop-blur-xl focus-visible:border-0 focus-visible:ring-0'
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                    handleInputChange(e)
                  }}
                  onKeyDown={(e) => handleKeyDown(e, field, form.handleSubmit)}
                  placeholder='Type your message here...'
                  data-1p-ignore
                />
              </>
            )}
          />
        </div>
        <div className='flex flex-1'>
          <form.Field
            name='model'
            children={(field) => (
              <ModelSelect
                value={field.state.value}
                onValueChange={(v) => {
                  field.setValue(v)
                  setModel(v)
                }}
              />
            )}
          />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                className='absolute right-3 bottom-3 ml-auto rounded-lg border-1 border-sky-900 bg-[#0284c740] text-neutral-100 hover:bg-[#0284c790]'
                type='submit'
                disabled={!canSubmit || isSubmitting}
              >
                <Send />
              </Button>
            )}
          />
        </div>
      </div>
    </form>
  )
}
