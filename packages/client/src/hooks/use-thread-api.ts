import { Thread } from '@prompt-dev/shared-types'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { ThreadApi } from '~/chat-provider'
import { threads } from '../queries/threads'
import { messages } from '../queries/messages'

export function useThreadApi(queryClient: QueryClient): ThreadApi {
  const updateThreadCache = useCallback(
    (thread: Thread) => {
      // add the thread to front of query cache
      queryClient.setQueriesData(
        threads.getAll.queryOptions({ includeLastMessage: true }),
        (oldData: Thread[] | undefined) => {
          return oldData ? [thread, ...oldData] : [thread]
        },
      )
    },
    [queryClient],
  )

  const getThreadWithMessages = useCallback(async (threadId: string) => {
    const thread = await queryClient.fetchQuery(
      messages.getByThreadId.queryOptions(threadId),
    )
    return thread
  }, [])

  const api = useMemo(
    () => ({
      updateThreadCache,
      getThreadWithMessages,
    }),
    [updateThreadCache, getThreadWithMessages],
  )

  return api
}
