import { NextFunction, Request, Response } from 'express'

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
  if (!req.auth.userId) {
    return next(new UnauthorizedError('Unauthorized'))
  }
  next()
}
