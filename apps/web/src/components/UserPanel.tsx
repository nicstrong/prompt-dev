import { useUser } from '@clerk/clerk-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useNavigate } from '@tanstack/react-router'

export function UserPanel() {
  const user = useUser()
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({ to: '/settings' })
  }
  return (
    <button
      onClick={handleClick}
      className='hover:bg-sidebar-accent flex flex-row items-center gap-4 p-2'
    >
      <Avatar>
        <AvatarImage
          src={user.user?.imageUrl}
          alt={user.user?.fullName ?? ''}
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className='text-foreground flex flex-col items-start'>
        <span className='text-xs'>{user.user?.fullName}</span>
        <span className='text-xs'>
          {user.user?.emailAddresses[0].emailAddress}
        </span>
      </div>
    </button>
  )
}
