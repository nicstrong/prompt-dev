import {z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc';


export const messagesRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ }) => {
      // .mutation(async ({ctx, input }) => {
        //   await ctx.db.insert(posts).values({
    //     name: input.name,
    //   });
    }),
  });
  
