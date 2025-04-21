import { db } from './index.js'
import { threads } from './schema.js'
import { eq, desc } from 'drizzle-orm'

type NewThread = typeof threads.$inferInsert

export async function newThread(newThread: NewThread) {
  return db.insert(threads).values(newThread)
}

type Thread = typeof threads.$inferSelect
export async function getAllThreadsForUser(userId: string): Promise<Thread[]> {
  const userThreads = await db
    .select()
    .from(threads)
    .where(eq(threads.userId, userId))
    .orderBy(desc(threads.createdAt))

  return userThreads
}

export async function deleteThread(threadId: string) {
  return db.delete(threads).where(eq(threads.id, threadId))
}

export async function renameThread(threadId: string, name: string) {
  return db.update(threads).set({ name: name }).where(eq(threads.id, threadId))
}
