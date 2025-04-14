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
} from './ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { UserPanel } from './UserPanel'
import { trpc } from '@/trpc/trpc'
import { Edit, MoreHorizontal, Plus, Trash } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Thread } from '@/trpc/types'
import { Route } from '@/routes/_authed.threads.$threadId'

export const AppSidebar = () => {
  const { data: threads } = useQuery(trpc.threads.getAllForUser.queryOptions())
  const { threadId } = Route.useParams()

  return (
    <Sidebar>
      <SidebarHeader>
        <h2>Prompt Workbench</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
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
