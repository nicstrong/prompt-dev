import { openai } from '@ai-sdk/openai'
import { createIdGenerator, pipeDataStreamToResponse, streamText } from 'ai'
import { NextFunction, Request, Response, Router } from 'express'
import { requireAuthOrError } from '../utils.js'
import { validation } from '../validationMiddleware.js'
import { NewChatType, newChatSchema } from './chat.schemas.js'
import { newThread, Thread } from '~/db/threads.js'
import { createId } from '@paralleldrive/cuid2'
import { newMessage } from '~/db/messages.js'
import { convertResponseMessageToDbMessage } from './chat.services.js'
import { generateThreadName } from '~/api/routers/threads.js'
import { threadMetadataAnnotationSchema } from '@prompt-dev/shared-types'
import { z } from 'zod'
import { createModel } from './modelFactory.js'

const router: Router = Router()
router.use(requireAuthOrError)

router.post(
  '/chat',
  validation(newChatSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.auth.userId!
    const data = req.body as NewChatType
    const { messages } = data
    let threadId = data.data?.threadId ?? null
    let createdThread: Thread | null = null

    const model = await createModel(data.data?.model ?? null)
    if (threadId === null) {
      threadId = createId()
      createdThread = await newThread({
        id: threadId,
        userId: req.auth.userId!,
        name: 'New Chat',
      })
    }

    await newMessage({
      role: 'user',
      threadId,
      content: messages[messages.length - 1].content,
      parts: messages[messages.length - 1].parts,
    })

    pipeDataStreamToResponse(res, {
      execute: async (dataStreamWriter) => {
        if (createdThread) {
          const evt: z.infer<typeof threadMetadataAnnotationSchema> = {
            kind: 'thread-metadata',
            content: {
              threadId,
              isNew: true,
              name: createdThread.name,
              createdAt: createdThread.createdAt.valueOf(),
              updatedAt: createdThread.updatedAt?.valueOf() ?? null,
              userId: createdThread.userId,
            },
          }
          dataStreamWriter.writeMessageAnnotation(evt)
        } else {
          const evt: z.infer<typeof threadMetadataAnnotationSchema> = {
            kind: 'thread-metadata',
            content: {
              threadId,
              isNew: false,
            },
          }
          dataStreamWriter.writeMessageAnnotation(evt)
        }

        const result = streamText({
          model: model,
          messages,
          // id format for server-side messages:
          experimental_generateMessageId: createIdGenerator({
            prefix: 'msgs',
            size: 16,
          }),
          async onFinish({ response }) {
            const responseMessage = convertResponseMessageToDbMessage(
              response.messages,
              threadId,
            )
            const newMsg = await newMessage(responseMessage)
            if (createdThread) {
              generateThreadName(threadId, userId).catch((err) => {
                console.error('renameThread failed:', err)
              })
            }
          },
        })

        // result.consumeStream()
        result.mergeIntoDataStream(dataStreamWriter, {})
      },
      onError: (error) => {
        // Error messages are masked by default for security reasons.
        // If you want to expose the error message to the client, you can do so here:
        return error instanceof Error ? error.message : String(error)
      },
    })
  },
)

export default router
