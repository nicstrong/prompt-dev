import { UIMessage } from 'ai'
import { z } from 'zod'

export const TextUIPartSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
})
export const ReasoningUIPartSchema = z.object({
  type: z.literal('reasoning'),
  reasoning: z.string(),
  details: z.array(
    z.union([
      z.object({
        type: z.literal('text'),
        text: z.string(),
        signature: z.string().optional(),
      }),
      z.object({
        type: z.literal('redacted'),
        text: z.string(),
        signature: z.string().optional(),
      }),
    ]),
  ),
})
const chatMessageSchema = z.object({
  createdAt: z.date().optional(),
  content: z.string(),
  role: z.enum(['system', 'user', 'assistant', 'data']),
  parts: z.array(z.union([TextUIPartSchema, ReasoningUIPartSchema]).optional()),
})
export const newChatSchema = z.object({
  id: z.string(),
  messages: z.array(chatMessageSchema),
  data: z
    .object({
      threadId: z.string().nullable(),
    })
    .nullable(),
})

export type NewChatType = {
  id: string
  messages: UIMessage[]
  data: {
    threadId: string | null
  } | null
}
