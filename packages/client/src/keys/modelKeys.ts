export const modelsKeys = {
  all: ['models'] as const,

  // For all models (no filter)
  lists: () => [...modelsKeys.all, 'list'] as const,

  // For all models with a filter (e.g., { status: 'active' })
  listWithFilter: (filter: Record<string, unknown>) =>
    [...modelsKeys.lists(), { filter }] as const,

  // For a single model by ID
  byId: (id: string) => [...modelsKeys.all, 'detail', id] as const,
}
