import { Thread } from '@prompt-dev/shared-types'
import {
  getAllThreadsForUser as getAllThreadsForUserDb,
  getAllThreadsForUserWithLastMessage as getAllThreadsForUserWithLastMessageDb,
  ThreadWithLastMessage as ThreadWithLastMessageDb,
} from '~/db/threads.js'

export type ThreadWithLastMessage = Thread & {
  lastMessage?: {
    id: string
    content: string
    createdAt: number
    updatedAt: number | null
  }
}

export async function getAllThreadsForUser(
  userId: string,
  includeLastMessage: boolean,
): Promise<ThreadWithLastMessage[]> {
  if (!includeLastMessage) {
    const userThreads = await getAllThreadsForUserDb(userId)
    const result = userThreads.map((thread) => ({
      ...thread,
      createdAt: thread.createdAt.valueOf(),
      updatedAt: thread.updatedAt?.valueOf() ?? null,
    }))
    return result
  }
  const threadsWithLastMessage =
    await getAllThreadsForUserWithLastMessageDb(userId)

  const threadsWithMessage = threadsWithLastMessage.map((thread) => ({
    ...thread.thread,
    createdAt: thread.thread.createdAt.valueOf(),
    updatedAt: thread.thread.updatedAt?.valueOf() ?? null,
    lastMessage: thread.lastMessage
      ? {
          id: thread.lastMessage.id!,
          content: thread.lastMessage.parts
            .map((part) => (part.type === 'text' ? part.text : ''))
            .join(''),
          createdAt: thread.lastMessage.createdAt.valueOf(),
          updatedAt: thread.lastMessage.updatedAt?.valueOf() ?? null,
        }
      : undefined,
  }))
  return threadsWithMessage
}
