import z from "zod";


export const StateEnumSchema =  z.enum(['streaming', 'done'])
type JSONValue = null | string | number | boolean | {
    [value: string]: JSONValue;
} | Array<JSONValue>;

export const JSONValueSchema: z.ZodType<JSONValue> = z.lazy(() =>
  z.union([
    z.null(),
    z.string(),
    z.number(),
    z.boolean(),
    z.record(z.string(), JSONValueSchema),
    z.record(JSONValueSchema),
  ]),
)

export const ProviderMetadataSchema = z.record(
  z.string(),
  z.record(z.string(), JSONValueSchema),
);

export const TextUIPartSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
  state: StateEnumSchema.optional()
})
export const ReasoningUIPartSchema = z.object({
  type: z.literal('reasoning'),
  text: z.string(),
  state: StateEnumSchema.optional(),
})


export const FileUIPartSchema = z.object({
  type: z.literal('file'),
  mediaType: z.string(),
  filename: z.string().optional(),
  url: z.string(),
  providerMetadata: ProviderMetadataSchema.optional(),
})

export const StepStartUIPartSchema = z.object({
  type: z.literal('step-start')
})

const commonBase = z.object({
  type: z.any(),
  toolCallId: z.string(),
});

const inputStreaming = z
  .object({
    state: z.literal("input-streaming"),
    input:  z.any(),
    providerExecuted: z.boolean().optional(),
    output: z.never().optional(),
    errorText: z.never().optional(),
  })
  .strict();

const inputAvailable = z
  .object({
    state: z.literal("input-available"),
    input:  z.any(),
    providerExecuted: z.boolean().optional(),
    callProviderMetadata: ProviderMetadataSchema.optional(),
    output: z.never().optional(),
    errorText: z.never().optional(),
  })
  .strict();

const outputAvailable = z
  .object({
    state: z.literal("output-available"),
    input:  z.any(),
    output:  z.any(),
    providerExecuted: z.boolean().optional(),
    callProviderMetadata: ProviderMetadataSchema.optional(),
    errorText: z.never().optional(),
  })
  .strict();

const outputError = z
  .object({
    state: z.literal("output-error"),
    input:  z.any(),
    errorText: z.string(),
    providerExecuted: z.boolean().optional(),
    callProviderMetadata: ProviderMetadataSchema.optional(),
    output: z.never().optional(),
  })
  .strict();

export const ToolUIPartSchema = z.any() 
// z.union([
//       commonBase.and(inputStreaming),
//       commonBase.and(inputAvailable),
//       commonBase.and(outputAvailable),
//       commonBase.and(outputError),
//     ])

const dynamicBase = z.object({
    type: z.literal("dynamic-tool"),
    toolName: z.string(),
    toolCallId: z.string(),
  });

  const dynamicInputStreaming = z
    .object({
      state: z.literal("input-streaming"),
      input: z.unknown().optional(), 
      output: z.never().optional(),
      errorText: z.never().optional(),
    })
    .strict();

  const dynamicInputAvailable = z
    .object({
      state: z.literal("input-available"),
      input: z.unknown(), 
      callProviderMetadata: ProviderMetadataSchema.optional(),
      // forbid these in this state
      output: z.never().optional(),
      errorText: z.never().optional(),
    })
    .strict();

  const dynamicOutputAvailable = z
    .object({
      state: z.literal("output-available"),
      input: z.unknown(),
      output: z.unknown(),
      callProviderMetadata: ProviderMetadataSchema.optional(),
      errorText: z.never().optional(),
    })
    .strict();

  const dynamicOutputError = z
    .object({
      state: z.literal("output-error"),
      input: z.unknown(),
      errorText: z.string(),
      callProviderMetadata: ProviderMetadataSchema.optional(),
      // forbid in this state
      output: z.never().optional(),
    })
    .strict();

  export const DynamicToolUIPartSchema = z.union([
    dynamicBase.and(dynamicInputStreaming),
    dynamicBase.and(dynamicInputAvailable),
    dynamicBase.and(dynamicOutputAvailable),
    dynamicBase.and(dynamicOutputError),
  ]);

  export const SourceUrlUIPartSchema = z.object({
    type: z.literal('source-url'),
    sourceId: z.string(),
    url: z.string(),
    title: z.string().optional(),
    providerMetadata: ProviderMetadataSchema.optional(),
  })

  export const SourceDocumentUIPartSchema = z.object({
  type: z.literal('source-document'),
  sourceId: z.string(),
  mediaType: z.string(),
  title: z.string(),
  filename: z.string().optional(),
  providerMetadata: ProviderMetadataSchema.optional()
})

  export const UIMessagePartSchema = z.union([
    TextUIPartSchema,
    ReasoningUIPartSchema,
    ToolUIPartSchema,
    DynamicToolUIPartSchema,
    SourceUrlUIPartSchema,
    SourceDocumentUIPartSchema,
    FileUIPartSchema,
    StepStartUIPartSchema,
  ]);
