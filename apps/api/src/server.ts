import express, { Request, Response, NextFunction, type Express } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { AppRouter, appRouter } from './api/root.js'
import { createTRPCContext } from './api/trpc.js'

import bodyParser from 'body-parser'
import { routes } from './api/routes/routes.js'
import { isProblemException } from './api/ProblemException.js'
import { ProblemDocument } from 'http-problem-details'
const { json, urlencoded } = bodyParser
import { clerkMiddleware } from '@clerk/express'

export const createServerApp = (): Express => {
  const app = express()

  app
    .disable('x-powered-by')
    .use(morgan('dev'))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use(clerkMiddleware())
    .use(routes)
    .use(
      '/trpc',
      createExpressMiddleware<AppRouter>({
        router: appRouter,
        createContext: createTRPCContext,
      }),
    )
    .use(routes)
    .use(errorHandler)

  return app
}

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    next(err)
    return
  }
  if (err && err.name === 'UnauthorizedError') {
    const unauthed = new ProblemDocument({
      title: 'Unauthorized',
      detail: err.message,
      status: 401,
    })
    res.status(401).json(unauthed)
  } else if (err && err.name === 'ForbiddenError') {
    const unauthed = new ProblemDocument({
      title: 'Forbidden',
      detail: err.message,
      status: 403,
    })
    res.status(401).json(unauthed)
  } else if (err && err.name === 'NotFoundError') {
    const unauthed = new ProblemDocument({
      title: 'Not Found',
      detail: err.message,
      status: 404,
    })
    res.status(404).json(unauthed)
  } else if (isProblemException(err)) {
    res.status(err.status).json(
      new ProblemDocument({
        title: err.title,
        status: err.status,
        detail: err.detail,
        instance: err.instance,
        type: err.type,
      }),
    )
  } else if (err) {
    console.error('Serer error:', err)
    res.status(500).json(
      new ProblemDocument({
        title: 'Server Error',
        status: 500,
        detail: err.message,
      }),
    )
  } else {
    console.error('Serer error:', err)
    res.status(500).json(
      new ProblemDocument({
        title: 'Server Error',
        status: 500,
      }),
    )
  }
}
