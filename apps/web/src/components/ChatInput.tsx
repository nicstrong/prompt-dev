import { useForm } from '@tanstack/react-form'
import { Textarea } from './ui/textarea'

export const ChatInput = () => {
  const form = useForm({
    defaultValues: {
      chatMessage: '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })

  return (
    <form
      className='relative flex w-full flex-col items-stretch gap-2 rounded-t-xl bg-[#2D2D2D] px-3 py-3'
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div>
        <form.Field
          name='chatMessage'
          children={(field) => (
            <>
              <Textarea
                className='focus-visible:border-0 focus-visible:ring-0'
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder='Type your message here...'
                data-1p-ignore
              />
            </>
          )}
        />
      </div>
    </form>
  )
}
