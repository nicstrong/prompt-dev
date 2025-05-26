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
import { useMemo, useState } from 'react'
import { ConfirmDeletedDialog } from './ConfirmDeletedDialog'
import { MenuItem } from './MenuItem'
import { RenameDialog } from './RenameDialog'
import { Link } from '@tanstack/react-router'
import { useThreadMutations } from '@/hooks/threadMutations'
import React from 'react'
import { Threads } from '@/trpc/types'
import {
  startOfDay,
  subDays,
  isToday,
  isYesterday,
  isWithinInterval,
} from 'date-fns'
import { groupBy } from 'fp-ts/NonEmptyArray'
import { pipe } from 'fp-ts/lib/function'
import { Thread } from '@prompt-dev/shared-types'
import { scopedLog } from 'scope-log'

const log = scopedLog('UI:AppSidebar')

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

type ThreadGroup =
  | 'Today'
  | 'Yesterday'
  | 'Last 7 Days'
  | 'Last 30 Days'
  | 'Older'

const ThreadSidebarGroupContent = React.memo(
  ({
    threads,
    activeThreadId,
    setShowDeleteThread,
    setRenameDeleteThread,
    refreshThread,
  }: ThreadSidebarGroupContentProps) => {
    const threadsGrouped = useMemo<Record<ThreadGroup, Thread[]>>(() => {
      const today = new Date()
      const startOfToday = startOfDay(today)
      const startOfLast7Days = startOfDay(subDays(today, 6)) // Includes today
      const startOfLast30Days = startOfDay(subDays(today, 29)) // Includes todayå

      const groupThread = (item: Thread): ThreadGroup => {
        const itemDate = item.updatedAt
        log(`Grouping thread ${item.id} by date ${itemDate}`)

        if (itemDate === null) {
          return 'Older'
        }

        if (isToday(itemDate)) {
          return 'Today'
        }
        if (isYesterday(itemDate)) {
          return 'Yesterday'
        }
        if (
          isWithinInterval(itemDate, {
            start: startOfLast7Days,
            end: startOfToday,
          })
        ) {
          return 'Last 7 Days'
        }
        if (
          isWithinInterval(itemDate, {
            start: startOfLast30Days,
            end: startOfToday,
          })
        ) {
          return 'Last 30 Days'
        }
        return 'Older'
      }

      const data = pipe(threads, groupBy(groupThread))
      return data as Record<ThreadGroup, Array<Thread>>
    }, [threads])
    return (
      <SidebarGroupContent>
        {Object.entries(threadsGrouped).map(([category, threadsInCategory]) =>
          threadsInCategory.length > 0 ? (
            <React.Fragment key={category}>
              <SidebarGroupLabel className='text-muted-foreground px-3 pt-2 text-xs first:pt-0'>
                {category}
              </SidebarGroupLabel>
              <SidebarMenu>
                {(threads ?? []).map((thread) => (
                  <MenuItem
                    key={thread.id}
                    thread={thread}
                    isActive={activeThreadId === thread.id}
                    onDelete={(tid) => setShowDeleteThread(tid)}
                    onRename={(tid) =>
                      setRenameDeleteThread([tid, thread.name])
                    }
                    onRefresh={async (tid) => {
                      await refreshThread({ threadId: tid })
                    }}
                  />
                ))}
              </SidebarMenu>
            </React.Fragment>
          ) : null,
        )}
      </SidebarGroupContent>
    )
  },
)

export const AppSidebar = React.memo(AppSidebarImpl)
