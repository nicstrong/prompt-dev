import { db } from './index.js'
import { messages } from './schema.js'
import { eq, desc } from 'drizzle-orm'

type NewMessage = typeof messages.$inferInsert

export async function newMessage(newMessage: NewMessage) {
  return db.insert(messages).values(newMessage)
}

export async function getAllMessagesForThread(threadId: string) {
  const threadMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.threadId, threadId))
    .orderBy(desc(messages.createdAt))

  return threadMessages
}
