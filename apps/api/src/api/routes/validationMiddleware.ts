import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'
import { ProblemDocument } from 'http-problem-details'

export function validation(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const err = new ProblemDocument(
          {
            title: 'Bad Request',
            detail: 'Validation error',
            status: 400,
          },
          {
            errors: error.errors,
          },
        )
        res.status(400).json(err)
      } else {
        res.status(500).json(
          new ProblemDocument({
            title: 'Server Error',
            status: 500,
          }),
        )
      }
    }
  }
}
