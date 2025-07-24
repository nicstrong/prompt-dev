export const threadsKeys = {
  all: ['threads'] as const,

  // For all threads (no messages, optional filter like { userId: '123' })
  lists: () => [...threadsKeys.all, 'list'] as const,
  listWithFilter: (filter: Record<string, unknown>) =>
    [...threadsKeys.lists(), { filter }] as const,

  // For a single thread by ID (includes aggregated messages)
  byId: (id: string) => [...threadsKeys.all, 'detail', id] as const,
}
