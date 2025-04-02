import { db } from './index.js'
import { threads } from './schema.js'

type NewThread = typeof threads.$inferInsert

export function newThread(newThread: NewThread) {
  return db
    .insert(threads)
    .values(newThread)
    .returning({ insertedId: threads.id })
}
