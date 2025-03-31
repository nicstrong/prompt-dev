import { openai } from '@ai-sdk/openai'
import { getAuth, requireAuth } from '@clerk/express'
import { createIdGenerator, pipeDataStreamToResponse, streamText } from 'ai'
import { NextFunction, Request, Response, Router } from 'express'
import { requireAuthOrError } from '../utils.js'

const router: Router = Router()
router.use(requireAuthOrError)

router.post(
  '/chat',
  async (req: Request, res: Response, next: NextFunction) => {
    const authState = getAuth(req)
    console.log('/chat', authState)

    const { messages, id } = await req.body

    pipeDataStreamToResponse(res, {
      execute: async (dataStreamWriter) => {
        dataStreamWriter.writeData('initialized call')

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
