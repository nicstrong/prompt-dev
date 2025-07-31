import { get } from '~/api'
import { threadsKeys } from '~/keys/threadKeys'
import * as api from '~/api'
import { useQueryClient } from '@tanstack/react-query'
import { Thread, ThreadWithLastMessage } from '@prompt-dev/shared-types'

export const threads = {
  // Query: Get all threads (summary)
  getAll: {
    queryOptions: (filter = {}) => ({
      queryKey: threadsKeys.listWithFilter(filter),
      queryFn: () => api.get<ThreadWithLastMessage[]>('threads', filter),
    }),
  },

  // Query: Get thread by ID (with aggregated messages)
  getById: {
    queryOptions: (id: string) => ({
      queryKey: threadsKeys.byId(id),
      queryFn: () => api.get<Thread>(`threads/${id}`),
    }),
  },

  // Mutation: Create a thread
  create: {
    mutationOptions: () => {
      const queryClient = useQueryClient()
      return {
        mutationKey: ['threads', 'create'],
        mutationFn: (payload: Thread) => api.post('threads', payload),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: threadsKeys.lists() })
        },
      }
    },
  },
}
