import { trpc, trpcClient } from '@/trpc/trpc'
import { ThreadApi } from '@prompt-dev/client'
import { Thread } from '@prompt-dev/shared-types'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

export function useTRPCThreadApi(): ThreadApi {
  const queryClient = useQueryClient()

  const updateThreadCache = useCallback(
    (thread: Thread) => {
      // add the thread to front of query cache
      queryClient.setQueriesData(
        trpc.threads.getAllForUser.queryFilter(),
        (oldData: Thread[] | undefined) => {
          return oldData ? [thread, ...oldData] : [thread]
        },
      )
    },
    [queryClient],
  )

  const getThreadWithMessages = useCallback(async (threadId: string) => {
    const thread = await trpcClient.messages.getAllForThreadId.query({
      threadId,
    })

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
