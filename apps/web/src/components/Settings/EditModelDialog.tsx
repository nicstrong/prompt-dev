import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { useForm } from '@tanstack/react-form'
import { Model } from '@/trpc/types'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { createId } from '@paralleldrive/cuid2'

type Props = {
  onConfirm: (model: Model | Omit<Model, 'order'>) => void
  onDismiss: () => void
  model: Model | null
}

export function EditModelDialog({ model, onConfirm, onDismiss }: Props) {
  const form = useForm({
    defaultValues: {
      name: model?.name ?? '',
      shortDescription: model?.shortDescription ?? '',
      description: model?.description ?? '',
      provider: model?.provider ?? '',
      modelId: model?.id ?? '',
    },
    onSubmit: async ({ value }) => {
      // Do something with forms data
      const result = {
        ...value,
        provider: model?.provider ?? 'openai',
        id: createId(),
      }
      onConfirm(result)
    },
  })

  return (
    <Dialog open onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>Edit/Add Model</DialogTitle>
          <DialogDescription>
            Edit the model details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form
          className='flex flex-col gap-8'
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field
            name='name'
            children={(field) => (
              <div className='flex flex-col gap-4'>
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  name={field.name}
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {!field.state.meta.isValid && (
                  <em>{field.state.meta.errors.join(',')}</em>
                )}
              </div>
            )}
          />

          <form.Field
            name='shortDescription'
            children={(field) => (
              <div className='flex flex-col gap-4'>
                <Label htmlFor={field.name}>Short Description</Label>
                <Textarea
                  name={field.name}
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {!field.state.meta.isValid && (
                  <em>{field.state.meta.errors.join(',')}</em>
                )}
              </div>
            )}
          />
          <form.Field
            name='description'
            children={(field) => (
              <div className='flex flex-col gap-4'>
                <Label htmlFor={field.name}>Description</Label>
                <Textarea
                  className='min-h-40'
                  name={field.name}
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {!field.state.meta.isValid && (
                  <em>{field.state.meta.errors.join(',')}</em>
                )}
              </div>
            )}
          />
          <form.Subscribe
            selector={(state) => [state.canSubmit]}
            children={([canSubmit]) => (
              <Button type='submit' disabled={!canSubmit}>
                Save
              </Button>
            )}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
