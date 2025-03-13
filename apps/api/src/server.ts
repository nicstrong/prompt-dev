import express, { type Express } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { AppRouter, appRouter } from './api/root.js'
import { createTRPCContext } from './api/trpc.js'

import bodyParser from 'body-parser'
import { routes } from './api/routes/routes.js'
const { json, urlencoded } = bodyParser

export const createServer = (): Express => {
  const app = express()
  app
    .disable('x-powered-by')
    .use(morgan('dev'))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use(routes)
    .use(
      '/trpc',
      createExpressMiddleware<AppRouter>({
        router: appRouter,
        createContext: createTRPCContext,
      }),
    )

  return app
}
