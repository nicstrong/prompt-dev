import { RequestHandler } from 'express'
import {
  CompleteValidationSchema,
  EmptyValidationSchema,
  ErrorListItem,
  ValidationSchema,
  ZodOutput,
  types,
} from './middleware.types.js'
import z, { ZodType } from 'zod'
import { ProblemDocument } from 'http-problem-details'
import { SignedInAuthObject } from '@clerk/backend/internal'
import express from 'express'

function isZodType(schema: unknown): schema is ZodType {
  return !!schema && typeof (schema as ZodType).safeParseAsync === 'function'
}

const descriptor = Object.getOwnPropertyDescriptor(express.request, 'query')
if (descriptor) {
  Object.defineProperty(express.request, 'query', {
    get(this: Request) {
      if (Object.hasOwn(this, '_query')) return this._query
      return descriptor?.get?.call(this)
    },
    set(this: Request, query: unknown) {
      this._query = query
    },
    configurable: true,
    enumerable: true,
  })
}

export default function validate<
  TParams extends ValidationSchema = EmptyValidationSchema,
  TQuery extends ValidationSchema = EmptyValidationSchema,
  TBody extends ValidationSchema = EmptyValidationSchema,
>(
  schemas: CompleteValidationSchema<TParams, TQuery, TBody>,
): RequestHandler<
  ZodOutput<TParams>,
  any,
  ZodOutput<TBody>,
  ZodOutput<TQuery>,
  { signedInAuth: SignedInAuthObject } & Record<string, unknown>
> {
  // Create validation objects for each type
  const validation = {
    params: isZodType(schemas.params)
      ? schemas.params
      : z.strictObject(schemas.params ?? {}),
    query: isZodType(schemas.query)
      ? schemas.query
      : z.strictObject(schemas.query ?? {}),
    body: isZodType(schemas.body)
      ? schemas.body
      : z.strictObject(schemas.body ?? {}),
  }

  return async (req, res, next): Promise<void> => {
    const errors: ErrorListItem[] = []

    // Validate all types (params, query, body)
    for (const type of types) {
      const parsed = await validation[type].safeParseAsync(req[type] ?? {})
      if (parsed.success) req[type] = parsed.data as any
      else errors.push({ type, errors: parsed.error })
    }

    // Return all errors if there are any
    if (errors.length > 0) {
      // If a custom error handler is provided, use it
      if (schemas.handler) return schemas.handler(errors, req, res, next)

      const err = new ProblemDocument(
        {
          title: 'Bad Request',
          detail: 'Validation error',
          status: 400,
        },
        {
          errors: errors.map((error) => ({
            type: error.type,
            errors: error.errors,
          })),
        },
      )
      res.status(400).json(err)
      return
    }

    return next()
  }
}
