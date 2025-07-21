import { SignedInAuthObject } from '@clerk/backend/internal'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { isSessionObject } from '~/utils/auth.js'

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export const requireAuthOrError = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!isSessionObject(req.auth) || !req.auth.userId) {
    return next(new UnauthorizedError('Unauthorized'))
  }
  next()
}

export function protectedHandler(
  handler: (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => Promise<void> | void,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) =>
    handler(req as AuthenticatedRequest, res, next)
}

export type AuthenticatedRequest = Request & { auth: SignedInAuthObject }
