import { trpc } from '@/trpc/trpc'
import { Thread } from '@/trpc/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useThreadMutations() {
  const queryClient = useQueryClient()
  const { mutateAsync: deleteThread } = useMutation(
    trpc.threads.deleteThread.mutationOptions({
      onSuccess: (_, { threadId }) => {
        queryClient.setQueriesData(
          trpc.threads.getAllForUser.queryFilter(),
          (oldData: Thread[] | undefined) => {
            return (oldData ?? []).filter((thread) => thread.id !== threadId)
          },
        )
      },
    }),
  )
  const { mutateAsync: renameThread } = useMutation(
    trpc.threads.renameThread.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.setQueriesData(
          trpc.threads.getAllForUser.queryFilter(),
          (oldData: Thread[] | undefined) => {
            return (oldData ?? []).map((thread) =>
              thread.id === variables.threadId
                ? { ...thread, name: variables.name }
                : thread,
            )
          },
        )
      },
    }),
  )
  const { mutateAsync: refreshThread } = useMutation(
    trpc.threads.refreshThread.mutationOptions(),
  )

  return { deleteThread, renameThread, refreshThread }
}
