import { ThreadsFilter } from '@prompt-dev/shared-types'

export const threadsKeys = {
  all: ['threads'] as const,

  // For all threads (no messages, optional filter like { userId: '123' })
  lists: () => [...threadsKeys.all, 'list'] as const,
  listWithFilter: (filter: ThreadsFilter) =>
    [...threadsKeys.lists(), { filter }] as const,

  // For a single thread by ID
  byId: (id: string) => [...threadsKeys.all, 'detail', id] as const,
}
