import { z } from 'zod'

export const threadSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  name: z.string(),
  userId: z.string(),
})
