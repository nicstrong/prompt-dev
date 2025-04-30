import { useMutation, useQuery } from '@tanstack/react-query'
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
  SidebarRail,
} from '../ui/sidebar'
import { UserPanel } from '../UserPanel'
import { getQueryClient, trpc } from '@/trpc/trpc'
import { Plus } from 'lucide-react'
import { useChatContext } from '../Chat/ChatProvider.provider'
import { useState } from 'react'
import { ConfirmDeletedDialog } from './ConfirmDeletedDialog'
import { MenuItem } from './MenuItem'
import { RenameDialog } from './RenameDialog'

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { data: threads } = useQuery(trpc.threads.getAllForUser.queryOptions())
  const { mutateAsync: deleteThread } = useMutation(
    trpc.threads.deleteThread.mutationOptions({
      onSuccess: () => {
        getQueryClient().invalidateQueries(
          trpc.threads.getAllForUser.queryFilter(),
        )
      },
    }),
  )
  const { mutateAsync: renameThread } = useMutation(
    trpc.threads.renameThread.mutationOptions(),
  )
  const { mutateAsync: refreshThread } = useMutation(
    trpc.threads.refreshThread.mutationOptions(),
  )

  const { threadId } = useChatContext()
  const [showDeleteThread, setShowDeleteThread] = useState<string | null>(null)
  const [showRenameThread, setRenameDeleteThread] = useState<
    readonly [string, string] | null
  >(null)

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h2>Prompt Workbench</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup key='threads'>
          <SidebarGroupLabel className='text-foreground'>
            Threads
          </SidebarGroupLabel>
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
                  onDelete={(tid) => setShowDeleteThread(tid)}
                  onRename={(tid) => setRenameDeleteThread([tid, thread.name])}
                  onRefresh={async (tid) => {
                    await refreshThread({ threadId: tid })
                  }}
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
      {showDeleteThread && (
        <ConfirmDeletedDialog
          onConfirm={async () => {
            setShowDeleteThread(null)
            await deleteThread({ threadId: showDeleteThread })
          }}
          onDismiss={() => setShowDeleteThread(null)}
        />
      )}
      {showRenameThread && (
        <RenameDialog
          onConfirm={async (name) => {
            setRenameDeleteThread(null)
            await renameThread({
              threadId: showRenameThread[0],
              name,
            })
          }}
          onDismiss={() => setRenameDeleteThread(null)}
          currentName={showRenameThread[1]}
        />
      )}
    </Sidebar>
  )
}
