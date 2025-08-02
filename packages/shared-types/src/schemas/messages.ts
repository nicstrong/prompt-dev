import z from "zod";
import { FileUIPartSchema, ReasoningUIPartSchema, SourceUIPartSchema, StepStartUIPartSchema, TextUIPartSchema, ToolInvocationUIPartSchema } from "./chat-parts";

export const messageSchema = z.object({
    id: z.string(),
    content: z.string(),
    createdAt: z.number(),
    updatedAt: z.number().nullable(),
  role: z.enum(['system', 'user', 'assistant']),
  parts: z.array(
    z.union([
      TextUIPartSchema,
      ReasoningUIPartSchema,
      ToolInvocationUIPartSchema,
      SourceUIPartSchema,
      FileUIPartSchema,
      StepStartUIPartSchema,
    ]),
  )
})

export type Message = z.infer<typeof messageSchema>