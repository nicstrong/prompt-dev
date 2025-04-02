import { db } from './index.js'
import { messages } from './schema.js'

type NewMessage = typeof messages.$inferInsert

export async function newMessage(newMessage: NewMessage) {
  return db.insert(messages).values(newMessage)
}
