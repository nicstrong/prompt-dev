import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../trpc.js'

export const messagesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({}) => {
      // .mutation(async ({ctx, input }) => {
      //   await ctx.db.insert(posts).values({
      //     name: input.name,
      //   });
    }),
})
