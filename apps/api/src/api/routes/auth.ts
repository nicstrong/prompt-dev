import { NextFunction, Request, RequestHandler, Response } from 'express'
import { isSessionObject } from '~/utils/auth.js'

export const requireAuthOrError = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.auth()
  if (!isSessionObject(auth) || !auth.userId) {
    return next(new UnauthorizedError('Unauthorized'))
  }
  res.locals.signedInAuth = auth
  next()
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ForbiddenError'
  }
}
