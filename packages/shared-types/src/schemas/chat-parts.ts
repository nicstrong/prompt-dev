import z from "zod";

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
        data: z.string(),
      }),
    ]),
  ),
})
export const ToolInvocationSchema = z.object({
  state: z.union([
    z.literal('partial-call'),
    z.literal('call'),
    z.literal('result'),
  ]),
  step: z.number().optional(),
  // Add other properties as needed for your ToolCall/ToolResult
})

export const ToolInvocationUIPartSchema = z.object({
  type: z.literal('tool-invocation'),
  toolInvocation: ToolInvocationSchema,
})

type JSONValue = null | string | number | boolean | {
    [value: string]: JSONValue;
} | Array<JSONValue>;

export const JSONValueSchema: z.ZodType<JSONValue> = z.lazy(() =>
  z.union([
    z.null(),
    z.string(),
    z.number(),
    z.boolean(),
    z.array(JSONValueSchema),
    z.record(JSONValueSchema),
  ]),
)

export const LanguageModelV1SourceSchema = z.object({
  sourceType: z.literal('url'),
  id: z.string(),
  url: z.string(),
  title: z.string().optional(),
  providerMetadata: z
    .record(z.string(), z.record(z.string(), JSONValueSchema))
    .optional(),
})

export const SourceUIPartSchema = z.object({
  type: z.literal('source'),
  source: LanguageModelV1SourceSchema,
})

export const FileUIPartSchema = z.object({
  type: z.literal('file'),
  mimeType: z.string(),
  data: z.string(),
})
export const StepStartUIPartSchema = z.object({
  type: z.literal('step-start'),
})