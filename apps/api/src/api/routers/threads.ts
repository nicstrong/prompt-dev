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
  refreshThread: protectedProcedure
    .input(z.object({ threadId: z.string().min(1) }))
    .output(z.void())
    .mutation(async (opts) => {
      const { threadId } = opts.input
      console.log(
        `[refreshThread] Received event: ${
          threadId
        }, Payload: ${JSON.stringify}`,
      )
      processBackgroundTask(`Event: ${threadId}`).catch((err) => {
        // CRITICAL: Handle errors from the background task separately
        // (e.g., log to an error tracking service). The client won't know.
        console.error('Background task failed:', err)
      })
      console.log(`[Server Sync] Background task triggered for: ${threadId}`)
    }),
})

const processBackgroundTask = async (event: string): Promise<void> => {
  console.log(`[Server Background] Starting task for: ${event}`)
  // Simulate work (e.g., database write, external API call)
  await new Promise((resolve) => setTimeout(resolve, 20000)) // Wait 2 seconds
  console.log(`[Server Background] Finished task for: ${event}`)
  // Note: Proper error handling for background tasks is crucial in production!
}
