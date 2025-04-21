import { useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

type Props = {
  onConfirm: (name: string) => void
  onDismiss: () => void
  currentName: string
}

export function RenameDialog({ onConfirm, onDismiss, currentName }: Props) {
  const [name, setName] = useState(currentName)

  return (
    <Dialog open onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Rename thread</DialogTitle>
          <DialogDescription>
            Rename the thread. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onConfirm(name)}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
