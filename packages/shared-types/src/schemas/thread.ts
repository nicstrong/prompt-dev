import { z } from 'zod'
import { messageSchema } from './messages'

export const threadsFilterSchema = z.object({
  includeLastMessage: z.boolean().optional(),
})

export type ThreadsFilter = z.infer<typeof threadsFilterSchema>

export const threadSchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
  name: z.string(),
  userId: z.string(),
})
export type Thread = z.infer<typeof threadSchema>

export const threadMetadataAnnotationSchema = z.object({
  kind: z.literal('thread-metadata'),
  content: z.discriminatedUnion('isNew', [
    z.object({
      threadId: z.string(),
      isNew: z.literal(false),
    }),
    z
      .object({
        threadId: z.string(),
        isNew: z.literal(true),
      })
      // Merge the properties from ThreadSchema, excluding 'id'
      .merge(threadSchema.omit({ id: true })),
  ]),
})

export type ThreadMetadataAnnotation = z.infer<typeof threadMetadataAnnotationSchema>

export const annotationSchema = z.discriminatedUnion('kind', [
  threadMetadataAnnotationSchema,
])

export type Annotation = z.infer<typeof annotationSchema>

export const threadWithLastMessageSchema = threadSchema.extend({
  lastMessage: z.object({
    id: z.string(),
    content: z.string(),
    createdAt: z.number(),
    updatedAt: z.number().nullable(),
  }).optional().nullable(),
})

export type ThreadWithLastMessage = z.infer<typeof threadWithLastMessageSchema>

export const threadWithMessageSchema = threadSchema.extend({
  messages: z.array(messageSchema)
})


export type ThreadWithMessages = z.infer<typeof threadWithMessageSchema>
