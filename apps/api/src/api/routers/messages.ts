import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../trpc.js'
import { getAllMessagesForThread } from '~/db/messages.js'

export const messagesRouter = createTRPCRouter({
  getAllForThreadId: protectedProcedure
    .input(z.object({ threadId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const { threadId } = input
      const messages = await getAllMessagesForThread(threadId)
      return messages
    }),
})
