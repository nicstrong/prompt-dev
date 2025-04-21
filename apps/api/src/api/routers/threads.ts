import {
  deleteThread,
  getAllThreadsForUser,
  renameThread,
} from '~/db/threads.js'
import { createTRPCRouter, protectedProcedure } from '../trpc.js'
import { z } from 'zod'
import { deleteMessagesForThreadId } from '~/db/messages.js'

export const threadsRouter = createTRPCRouter({
  getAllForUser: protectedProcedure.query(async (opts) => {
    const userId = opts.ctx.auth?.userId

    if (!userId) {
      throw new Error('User not authenticated')
    }

    const userThreads = await getAllThreadsForUser(userId)

    return userThreads
  }),
  deleteThread: protectedProcedure
    .input(z.object({ threadId: z.string().min(1) }))
    .mutation(async (opts) => {
      const { threadId } = opts.input
      await deleteMessagesForThreadId(threadId)
      await deleteThread(threadId)
    }),
  renameThread: protectedProcedure
    .input(z.object({ threadId: z.string().min(1), name: z.string().min(1) }))
    .mutation(async (opts) => {
      const { threadId, name } = opts.input
      await renameThread(threadId, name)
    }),
})
