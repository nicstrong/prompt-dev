import { openai } from '@ai-sdk/openai'
import { createIdGenerator, pipeDataStreamToResponse, streamText } from 'ai'
import { NextFunction, Request, Response, Router } from 'express'
import { requireAuthOrError } from '../utils.js'
import { validation } from '../validationMiddleware.js'
import { NewChatType, newChatSchema } from './chat.schemas.js'
import { newThread } from '~/db/threads.js'

const router: Router = Router()
router.use(requireAuthOrError)

router.post(
  '/chat',
  validation(newChatSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as NewChatType
    const { messages } = data
    let threadId = data.data?.threadId ?? null

    if (threadId === null) {
      const res = await newThread({
        userId: req.auth.userId!,
        name: 'New Chat',
      })
      threadId = res[0].insertedId
    }

    pipeDataStreamToResponse(res, {
      execute: async (dataStreamWriter) => {
        dataStreamWriter.writeData({ threadId })

        const result = streamText({
          model: openai('gpt-4o-mini'),
          messages,
          // id format for server-side messages:
          experimental_generateMessageId: createIdGenerator({
            prefix: 'msgs',
            size: 16,
          }),
          async onFinish({ response }) {
            // await saveChat({
            //   id,
            //   messages: appendResponseMessages({
            //     messages,
            //     responseMessages: response.messages,
            //   }),
            // })
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
