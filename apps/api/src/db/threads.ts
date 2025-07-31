import { db } from './index.js'
import { Message } from './messages.js'
import { threads, messages } from './schema.js'
import { eq, desc, and, max, sql } from 'drizzle-orm'

type NewThread = typeof threads.$inferInsert

export async function newThread(newThread: NewThread) {
  const rows = await db.insert(threads).values(newThread).returning()
  return rows[0]
}

export type Thread = typeof threads.$inferSelect

export async function getAllThreadsForUser(userId: string) {
  const userThreads = await db
    .select()
    .from(threads)
    .where(eq(threads.userId, userId))
    .orderBy(desc(threads.createdAt))

  return userThreads
}

export async function getAllThreadsForUserWithLastMessage(userId: string) {
  const lastMessage = db
    .select({ messageId: messages.id })
    .from(messages)
    .where(and(eq(messages.threadId, threads.id), eq(messages.role, 'user')))
    .orderBy(desc(messages.createdAt))
    .limit(1)

  const threadsWithLastMessage = await db
    .select({
      thread: threads,
      lastMessage: {
        id: messages.id,
        content: messages.content,
        parts: messages.parts,
        createdAt: messages.createdAt,
        updatedAt: messages.updatedAt,
      },
    })
    .from(threads)
    .leftJoin(messages, eq(messages.id, lastMessage))
    .where(eq(threads.userId, userId))

  return threadsWithLastMessage
}

export type ThreadWithLastMessage = Awaited<
  ReturnType<typeof getAllThreadsForUserWithLastMessage>
>[number]

export async function deleteThread(threadId: string) {
  return db.delete(threads).where(eq(threads.id, threadId))
}

export async function renameThread(threadId: string, name: string) {
  return db.update(threads).set({ name: name }).where(eq(threads.id, threadId))
}
