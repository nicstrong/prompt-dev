import { Router } from 'express'
import { getAllThreadsForUser } from '~/data/threads.js'
import z from 'zod'
import { requireAuthOrError } from '../auth.js'
import validate from '../middleware/middleware.js'

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
    console.log(`/threads called with query:`, req.query.includeLastMessage)
    const userId = res.locals.signedInAuth.userId
    const userThreads = await getAllThreadsForUser(
      userId,
      req.query.includeLastMessage,
    )
    console.log(`/threads getAllThreadsForUser returned:`, userThreads)
    res.send(userThreads)
  },
)

export default router
