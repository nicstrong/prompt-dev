import { Router } from 'express'
import { getAllThreadsForUser } from '~/data/threads.js'
import z from 'zod'
import {
  ForbiddenError,
  requireAuthOrError,
  UnauthorizedError,
} from '../auth.js'
import validate from '../middleware/middleware.js'
import { getAllMessagesForThread } from '~/db/messages.js'

const router: Router = Router()
router.use(requireAuthOrError)

const threadsQuerySchema = z
  .object({
    includeLastMessage: z.string().optional(),
  })
  .refine(
    (incomingData) => {
      const value = incomingData.includeLastMessage?.toLowerCase()
      return (
        value === 'true' ||
        value === '1' ||
        value === 'false' ||
        value === '0' ||
        incomingData.includeLastMessage === undefined
      )
    },
    { message: 'includeLastMessage must be a boolean string' },
  )
  .transform((incomingData) => {
    const value = incomingData.includeLastMessage?.toLowerCase()
    return {
      includeLastMessage:
        value === 'true' || value === '1'
          ? true
          : value === 'false' || value === '0'
            ? false
            : false,
    }
  })

router.get(
  '/threads',
  validate({ query: threadsQuerySchema }),
  async (req, res) => {
    const userId = res.locals.signedInAuth.userId
    const userThreads = await getAllThreadsForUser(
      userId,
      req.query.includeLastMessage,
    )
    res.send(userThreads)
  },
)

router.get(
  '/threads/:threadId/messages',
  validate({ params: z.object({ threadId: z.string() }) }),
  async (req, res) => {
    const userId = res.locals.signedInAuth.userId
    const { threadId } = req.params
    const threadAndMessages = await getAllMessagesForThread(threadId)
    if (threadAndMessages?.userId !== userId) {
      throw new ForbiddenError('You do not have access to this thread')
    }
    res.send(threadAndMessages)
  },
)

export default router
