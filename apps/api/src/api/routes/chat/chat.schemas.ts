import { chatUIMessageSchema, MessageMetadata } from '@prompt-dev/shared-types'
import { JSONValue, UIMessage } from 'ai'
import { z } from 'zod'

export type ChatUIMessage = UIMessage<MessageMetadata>

export const newChatSchema = z.object({
  id: z.string(),
  messages: z.array(chatUIMessageSchema),
  data: z
    .object({
      threadId: z.string().nullable(),
      model: z.string().nullable(),
    })
    .nullable(),
})

export type NewChatMessage = z.infer<typeof newChatSchema>

export type NewChatType = {
  id: string
  messages: UIMessage[]
  data: {
    threadId: string | null
    model: string | null
  } | null
}
