import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc.js'
import { getThreadAndMessages } from '~/db/messages.js'
import { db } from '~/db/index.js'
import { TRPCError } from '@trpc/server/unstable-core-do-not-import'

export const messagesRouter = createTRPCRouter({
  getAllForThreadId: protectedProcedure
    .input(z.object({ threadId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const { threadId } = input
      const dbThread = await getThreadAndMessages(threadId)
      if (dbThread === null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Thread with id '${threadId}' not found`,
        })
      }
      const thread = {
        ...dbThread,
        updatedAt: dbThread.updatedAt?.valueOf() ?? null,
        createdAt: dbThread.createdAt.valueOf(),
        messages: dbThread.messages.map((message) => ({
          ...message,
          updatedAt: message.updatedAt?.valueOf() ?? null,
          createdAt: message.createdAt.valueOf(),
        })),
      }
      return thread
    }),
})
