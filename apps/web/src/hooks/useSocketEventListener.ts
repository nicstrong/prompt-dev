import { useSocket } from '@/contexts/SocketContext.provider'
import { trpc } from '@/trpc/trpc'
import { Thread } from '@/trpc/types'
import { ItemUpdatePayload } from '@prompt-dev/shared-types'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { scopedLog } from 'scope-log'

const log = scopedLog('SocketEventListener')

export const useSocketEventListener = () => {
  const { socket, isConnected } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket || !isConnected) {
      return // Don't set up listeners if socket is not ready
    }

    const updateQueryCache = (payload: ItemUpdatePayload) => {
      log('Received socket event:', payload)
      switch (payload.kind) {
        case 'thread-name':
          queryClient.setQueriesData(
            trpc.threads.getAllForUser.queryFilter(),
            (oldData: Thread[] | undefined) => {
              return (oldData ?? []).map((thread) =>
                thread.id === payload.itemId
                  ? { ...thread, name: payload.newName }
                  : thread,
              )
            },
          )
          break
        default:
          break
      }
    }

    socket.on('item_updated', updateQueryCache)

    return () => {
      if (socket) {
        socket.off('item_updated', updateQueryCache)
      }
    }
  }, [socket, isConnected, queryClient])
}
