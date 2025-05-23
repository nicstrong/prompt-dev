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
  SidebarRail,
} from '../ui/sidebar'
import { UserPanel } from '../UserPanel'
import { trpc } from '@/trpc/trpc'
import { Plus } from 'lucide-react'
import { useChatContext } from '../Chat/ChatProvider.context'
import { useState } from 'react'
import { ConfirmDeletedDialog } from './ConfirmDeletedDialog'
import { MenuItem } from './MenuItem'
import { RenameDialog } from './RenameDialog'
import { Link } from '@tanstack/react-router'
import { useThreadMutations } from '@/hooks/threadMutations'
import React from 'react'
import { Threads } from '@/trpc/types'

const AppSidebarImpl = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { data: threads } = useQuery(trpc.threads.getAllForUser.queryOptions())
  const { deleteThread, renameThread, refreshThread } = useThreadMutations()
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
            <Link to='/'>
              <Plus /> <span className='sr-only'>New Thread</span>
            </Link>
          </SidebarGroupAction>
          <ThreadSidebarGroupContent
            threads={threads ?? []}
            activeThreadId={threadId}
            setShowDeleteThread={setShowDeleteThread}
            setRenameDeleteThread={setRenameDeleteThread}
            refreshThread={refreshThread}
          />
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

interface ThreadSidebarGroupContentProps {
  threads: Threads
  activeThreadId: string | null
  setShowDeleteThread: (threadId: string | null) => void
  setRenameDeleteThread: (arg: readonly [string, string] | null) => void
  refreshThread: (arg: { threadId: string }) => Promise<void>
}

const ThreadSidebarGroupContent = React.memo(
  ({
    threads,
    activeThreadId,
    setShowDeleteThread,
    setRenameDeleteThread,
    refreshThread,
  }: ThreadSidebarGroupContentProps) => {
    return (
      <SidebarGroupContent>
        <SidebarMenu>
          {(threads ?? []).map((thread) => (
            <MenuItem
              key={thread.id}
              thread={thread}
              isActive={activeThreadId === thread.id}
              onDelete={(tid) => setShowDeleteThread(tid)}
              onRename={(tid) => setRenameDeleteThread([tid, thread.name])}
              onRefresh={async (tid) => {
                await refreshThread({ threadId: tid })
              }}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    )
  },
)

export const AppSidebar = React.memo(AppSidebarImpl)
