import { threadSchema } from '@prompt-dev/shared-types'
import { z } from 'zod'

export const treadMetadataAnnotationSchema = z.object({
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

export const annotationSchema = z.discriminatedUnion('kind', [
  treadMetadataAnnotationSchema,
])
