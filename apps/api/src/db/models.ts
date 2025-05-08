import { db } from './index.js'
import { models } from './schema.js'

export type Model = typeof models.$inferSelect

export async function getModels(): Promise<Model[]> {
  const result = await db.select().from(models).orderBy(models.provider)
  return result
}
