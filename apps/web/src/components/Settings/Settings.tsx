import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { SignOutButton, useUser } from '@clerk/clerk-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { SettingsTabs } from './SettingsTabs'
import { useNavigate } from '@tanstack/react-router'

export function Settings() {
  const navigate = useNavigate()
  const user = useUser()

  return (
    <div className='mx-auto flex h-full max-w-5xl flex-col gap-4 p-4'>
      <div className='flex w-full items-center justify-between'>
        <Button variant={'ghost'} onClick={() => navigate({ to: '/' })}>
          <ArrowLeft />
          Back to chat
        </Button>
        <SignOutButton />
      </div>
      <div className='flex gap-8'>
        <div className='flex flex-col items-center gap-2 px-8'>
          <Avatar className='h-48 w-48'>
            <AvatarImage
              src={user.user?.imageUrl}
              alt={user.user?.fullName ?? ''}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className='text-2xl font-bold'>{user.user?.fullName}</h1>
          <span className='text-muted-foreground break-all'>
            {user.user?.emailAddresses[0].emailAddress}
          </span>
        </div>
        <SettingsTabs />
      </div>
    </div>
  )
}
