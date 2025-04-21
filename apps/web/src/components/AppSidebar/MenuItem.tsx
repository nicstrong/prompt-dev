import { Thread } from '@/trpc/types'
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu'
import { FolderPenIcon, Trash2Icon, MoreHorizontal } from 'lucide-react'
import { Link } from '@tanstack/react-router'

type Props = {
  thread: Thread
  isActive: boolean
  onDelete: (threadId: string) => void
  onRename: (threadId: string) => void
}

export function MenuItem({ thread, isActive, onDelete }: Props) {
  return (
    <SidebarMenuItem key={thread.id}>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link to='/threads/$threadId' params={{ threadId: thread.id }}>
          {thread.name}
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start'>
          <DropdownMenuItem onClick={() => onDelete(thread.id)}>
            <FolderPenIcon />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(thread.id)}>
            <Trash2Icon color='red' />
            <span className='text-red-500'>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}
