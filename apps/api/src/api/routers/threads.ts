import {
  deleteThread,
  getAllThreadsForUser,
  renameThread,
} from '~/db/threads.js'
import { createTRPCRouter, protectedProcedure } from '../trpc.js'
import { z } from 'zod'
import {
  deleteMessagesForThreadId,
  getAllMessagesForThread,
} from '~/db/messages.js'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { inspect } from 'util'
import { io } from '~/index.js'
import { threadSchema } from '@prompt-dev/shared-types'

export const threadsRouter = createTRPCRouter({
  getAllForUser: protectedProcedure
    .output(z.array(threadSchema))
    .query(async (opts) => {
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
      generateThreadName(threadId, opts.ctx.auth?.userId).catch((err) => {
        console.error('renameThread failed:', err)
      })
    }),
})

export const generateThreadName = async (
  threadId: string,
  forUserId: string | undefined,
): Promise<void> => {
  const messages = await getAllMessagesForThread(threadId)
  const transcript = messages
    .map(
      (m) => `${m.role === 'assistant' ? 'Assistant' : 'User'}: ${m.content}`,
    )
    .join('\n')
  const result = await generateText({
    model: openai('gpt-4.1-mini-2025-04-14'),
    prompt: `The following transcript is a conversation thread between a user and an AI assistant. Generate a thread title that can be used in a UI showing a list of threads.\n\n${transcript}`,
  })
  await renameThread(threadId, result.text)

  console.log(`Generated thread name for user ${forUserId}:`, result.text)

  if (forUserId) {
    const sockets = await io.fetchSockets()
    const socket = sockets.find((s) => s.data.userId === forUserId)
    if (socket) {
      console.log(`Emitting item_updated event to socket ${socket.id}`)
      socket.emit('item_updated', {
        kind: 'thread-name',
        itemId: threadId,
        newName: result.text,
      })
    }
  }
}
