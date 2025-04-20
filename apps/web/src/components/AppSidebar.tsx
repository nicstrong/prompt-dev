import { useQuery } from '@tanstack/react-query'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarRail,
} from './ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { UserPanel } from './UserPanel'
import { trpc } from '@/trpc/trpc'
import { MoreHorizontal, Plus } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Thread } from '@/trpc/types'
import { useChatContext } from './Chat/ChatProvider.provider'

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { data: threads } = useQuery(trpc.threads.getAllForUser.queryOptions())
  const { threadId } = useChatContext()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h2>Prompt Workbench</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup key='threads'>
          <SidebarGroupLabel>Threads</SidebarGroupLabel>
          <SidebarGroupAction title='New Thread'>
            <Plus /> <span className='sr-only'>New Thread</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {(threads ?? []).map((thread) => (
                <MenuItem
                  key={thread.id}
                  thread={thread}
                  isActive={threadId === thread.id}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserPanel />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

type MenuItemProps = {
  thread: Thread
  isActive: boolean
}

function MenuItem({ thread, isActive }: MenuItemProps) {
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
          <DropdownMenuItem>
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}
