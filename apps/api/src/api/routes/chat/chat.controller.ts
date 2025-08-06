import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  pipeUIMessageStreamToResponse,
  streamText,
} from 'ai'
import { Router } from 'express'
import { newChatSchema } from './chat.schemas.js'
import { newThread, Thread } from '~/db/threads.js'
import { createId } from '@paralleldrive/cuid2'
import { newMessage } from '~/db/messages.js'
import { convertUIMessageToDbMessage } from './chat.services.js'
import { ChatUIMessage } from './chat.schemas.js'
import { generateThreadName } from '~/api/routers/threads.js'
import { createModel } from './modelFactory.js'
import { requireAuthOrError } from '../auth.js'
import validate from '../middleware/middleware.js'
import { getUserMessageParts } from '~/utils/ui-messages.js'
import { MessageMetadata } from '@prompt-dev/shared-types'
import { scopedLog } from 'scope-log'

const router: Router = Router()
router.use(requireAuthOrError)

router.post('/chat', validate({ body: newChatSchema }), async (req, res) => {
  const userId = res.locals.signedInAuth.userId
  const data = req.body
  const { messages } = data
  let threadId = data.data?.threadId ?? null
  let createdThread: Thread | null = null

  const model = await createModel(data.data?.model ?? null)
  if (threadId === null) {
    threadId = createId()
    createdThread = await newThread({
      id: threadId,
      userId,
      name: 'New Chat',
    })
  }

  await newMessage({
    role: 'user',
    threadId,
    parts: getUserMessageParts(messages[messages.length - 1]),
  })

  const result = streamText({
    model: model,
    messages: convertToModelMessages(messages),
  })

  result.pipeUIMessageStreamToResponse<ChatUIMessage>(res, {
    messageMetadata: () => {
      if (createdThread) {
        const meta: MessageMetadata = {
          threadId,
          isNew: true,
          name: createdThread.name,
          createdAt: createdThread.createdAt.valueOf(),
          updatedAt: createdThread.updatedAt?.valueOf() ?? null,
          userId: createdThread.userId,
        }
        return meta
      } else {
        const meta: MessageMetadata = {
          threadId,
          isNew: false,
        }
        return meta
      }
    },
    onFinish: async ({ messages }) => {
      const newMsg = await newMessage(
        convertUIMessageToDbMessage(messages, threadId),
      )
      if (createdThread) {
        generateThreadName(threadId, userId).catch((err) => {
          console.error('renameThread failed:', err)
        })
      }
    },
    onError: (error) => {
      // Error messages are masked by default for security reasons.
      // If you want to expose the error message to the client, you can do so here:
      return error instanceof Error ? error.message : String(error)
    },
  })
})

export default router
