import { Thread } from '@/trpc/types'
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar'
import {
  FolderPenIcon,
  Trash2Icon,
  MoreHorizontal,
  RefreshCcwIcon,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

type Props = {
  thread: Thread
  isActive: boolean
  onDelete: (threadId: string) => void
  onRename: (threadId: string) => void
  onRefresh: (threadId: string) => void
}

export function MenuItem({
  thread,
  isActive,
  onDelete,
  onRename,
  onRefresh,
}: Props) {
  return (
    <SidebarMenuItem key={thread.id}>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link to='/threads/$threadId' params={{ threadId: thread.id }}>
          <div
            className='text-muted-foreground hover:truncate-none truncate overflow-hidden text-sm'
            title={thread.name}
          >
            {thread.name}
          </div>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start'>
          <DropdownMenuItem onClick={() => onRename(thread.id)}>
            <FolderPenIcon />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRefresh(thread.id)}>
            <RefreshCcwIcon />
            <span>Refresh</span>
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
