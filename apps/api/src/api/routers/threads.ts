import { getAllThreadsForUser } from '~/db/threads.js'
import { createTRPCRouter, protectedProcedure } from '../trpc.js'

export const threadsRouter = createTRPCRouter({
  getAllForUser: protectedProcedure.query(async (opts) => {
    const userId = opts.ctx.auth?.userId

    if (!userId) {
      throw new Error('User not authenticated')
    }

    const userThreads = await getAllThreadsForUser(userId)

    return userThreads
  }),
})
