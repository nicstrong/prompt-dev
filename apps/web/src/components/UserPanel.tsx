import { UserButton, useUser } from '@clerk/clerk-react'

export function UserPanel() {
  const user = useUser()

  return (
    <div className='flex flex-row items-center gap-4'>
      <UserButton />
      <div className='text-foreground flex flex-col'>
        <span className='text-xs'>{user.user?.fullName}</span>
        <span className='text-xs'>
          {user.user?.emailAddresses[0].emailAddress}
        </span>
      </div>
    </div>
  )
}
