import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc.js'
import { getModels } from '~/db/models.js'
import { models, providerEnum } from '~/db/schema.js'
import { TRPCError } from '@trpc/server'
import { db } from '~/db/index.js'
import { eq } from 'drizzle-orm'

export const modelsRouter = createTRPCRouter({
  getModels: protectedProcedure.query(async ({ ctx }) => {
    const models = await getModels()
    return models
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().optional(),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        provider: z.enum(providerEnum.enumValues).optional(),
        modelId: z.string().optional(),
        order: z.number().int().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input

      const dataToSet: Partial<typeof models.$inferInsert> = {}

      if (updateData.name !== undefined) {
        dataToSet.name = updateData.name
      }
      if (updateData.description !== undefined) {
        dataToSet.description = updateData.description
      }
      if (updateData.shortDescription !== undefined) {
        dataToSet.shortDescription = updateData.shortDescription
      }
      if (updateData.provider !== undefined) {
        dataToSet.provider = updateData.provider
      }
      if (updateData.modelId !== undefined) {
        dataToSet.modelId = updateData.modelId
      }
      if (updateData.order !== undefined) {
        dataToSet.order = updateData.order
      }

      if (Object.keys(dataToSet).length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No update data provided.',
        })
      }

      let updatedPostArray
      try {
        updatedPostArray = await db
          .update(models)
          .set(dataToSet)
          .where(eq(models.id, id))
          .returning()
      } catch (error) {
        console.error('Failed to update model with Drizzle:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update post.',
        })
      }
      if (updatedPostArray.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Model not found to update.',
        })
      }
      return updatedPostArray[0]
    }),
})
