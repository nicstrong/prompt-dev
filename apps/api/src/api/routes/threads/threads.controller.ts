import { Router } from 'express'
import { protectedHandler, requireAuthOrError } from '../auth.js'
import { getAllThreadsForUser } from '~/data/threads.js'

const router: Router = Router()
router.use(requireAuthOrError)

router.get(
  '/threads',
  protectedHandler(async (req, res, next) => {
    const userId = req.auth.userId
    const userThreads = await getAllThreadsForUser(userId)
    res.send(userThreads)
  }),
)

export default router
