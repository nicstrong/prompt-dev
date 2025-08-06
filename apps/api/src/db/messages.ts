import { db } from './index.js'
import { messages, threads } from './schema.js'
import { eq, asc } from 'drizzle-orm'

export type NewMessage = typeof messages.$inferInsert
export type Message = typeof messages.$inferSelect
export type Thread = typeof threads.$inferSelect

export type ThreadWithMessages = Thread & {
  messages: Message[]
}

export async function newMessage(newMessage: NewMessage) {
  return db.insert(messages).values(newMessage)
}

export async function getThreadAndMessages(
  threadId: string,
): Promise<ThreadWithMessages | null> {
  const result = await db
    .select({
      thread: threads,
      messages: messages,
    })
    .from(threads)
    .leftJoin(messages, eq(messages.threadId, threads.id))
    .where(eq(threads.id, threadId))
    .orderBy(asc(messages.createdAt))

  if (result.length === 0) {
    return null
  }

  const thread = result[0].thread
  const threadMessages = result
    .filter((row) => row.messages !== null)
    .map((row) => row.messages!)

  return {
    ...thread,
    messages: threadMessages,
  }
}

export async function deleteMessagesForThreadId(threadId: string) {
  return db.delete(messages).where(eq(messages.threadId, threadId))
}
