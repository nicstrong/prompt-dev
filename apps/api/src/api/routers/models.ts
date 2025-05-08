import { createTRPCRouter, protectedProcedure } from '../trpc.js'
import { getModels } from '~/db/models.js'

export const modelsRouter = createTRPCRouter({
  getModels: protectedProcedure.query(async ({ ctx }) => {
    const models = await getModels()
    return models
  }),
})
