import { db } from './index.js'
import { models } from './schema.js'
import { eq } from 'drizzle-orm'

export type Model = typeof models.$inferSelect

export async function getModels(): Promise<Model[]> {
  const result = await db
    .select()
    .from(models)
    .orderBy(models.provider, models.order)
  return result
}

export async function getModelById(id: string): Promise<Model | null> {
  const result = await db
    .select()
    .from(models)
    .where(eq(models.id, id))
    .limit(1)
  return result.length > 0 ? result[0] : null
}
