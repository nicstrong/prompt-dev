import { db } from './index.js'
import { messages } from './schema.js'
import { eq, asc } from 'drizzle-orm'

export type NewMessage = typeof messages.$inferInsert

export async function newMessage(newMessage: NewMessage) {
  return db.insert(messages).values(newMessage)
}

export async function getAllMessagesForThread(threadId: string) {
  const threadMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.threadId, threadId))
    .orderBy(asc(messages.createdAt))

  return threadMessages
}
