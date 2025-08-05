import z from "zod";
import { UIMessagePartSchema } from "./chat-parts";

export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
  role: z.enum(['system', 'user', 'assistant']),
  parts: z.array(UIMessagePartSchema),  
})

export type Message = z.infer<typeof messageSchema>


export const messageMetadataSchema =  z.discriminatedUnion('isNew', [
    z.object({
      threadId: z.string(),
      isNew: z.literal(false),
    }),
    z
      .object({
        threadId: z.string(),
        isNew: z.literal(true),
        createdAt: z.number(),
        updatedAt: z.number().nullable(),
        name: z.string(),
        userId: z.string(),
      })
      // .merge(threadSchema.omit({ id: true })),
  ])

export type MessageMetadata= z.infer<typeof messageMetadataSchema>

export const chatUIMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['system', 'user', 'assistant']),
  metadata: messageMetadataSchema.optional(),
  // User messages can have text parts and file parts.
  // Assistant messages can have text, reasoning, tool invocation, and file parts.
  parts: z.array(UIMessagePartSchema),
})