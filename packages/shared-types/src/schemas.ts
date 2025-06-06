import { z } from 'zod'

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

export type ThreadMetadataAnnotation = z.infer<typeof threadSchema>

export const annotationSchema = z.discriminatedUnion('kind', [
  threadMetadataAnnotationSchema,
])

export type Annotation = z.infer<typeof annotationSchema>
