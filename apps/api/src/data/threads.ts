import { Thread } from '@prompt-dev/shared-types'
import { getAllThreadsForUser as getAllThreadsForUserDb } from '~/db/threads.js'

export async function getAllThreadsForUser(userId: string): Promise<Thread[]> {
  const userThreads = await getAllThreadsForUserDb(userId)
  const result = userThreads.map((thread) => ({
    ...thread,
    createdAt: thread.createdAt.valueOf(),
    updatedAt: thread.updatedAt?.valueOf() ?? null,
  }))
  return result
}
