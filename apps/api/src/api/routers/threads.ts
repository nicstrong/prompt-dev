import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../trpc.js'

export const threadsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    return [
      { id: '1', name: 'Thread 1' },
      { id: '2', name: 'Thread 2' },
      { id: '3', name: 'Thread 3' },
    ]
  }),
})
