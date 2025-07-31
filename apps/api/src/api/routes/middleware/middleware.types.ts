import z, { ZodError, ZodRawShape, ZodType } from 'zod'

import { NextFunction, Request, RequestHandler, Response } from 'express'

export const types = ['query', 'params', 'body'] as const
export const emptyObjectSchema = z.object({}).strict()
export type EmptyValidationSchema = typeof emptyObjectSchema
export type ValidationSchema = ZodType | ZodRawShape

export interface ErrorListItem {
  type: DataType
  errors: ZodError
}
type DataType = (typeof types)[number]

export type ErrorRequestHandler<
  P = unknown,
  ResBody = any,
  ReqBody = unknown,
  ReqQuery = unknown,
  LocalsObj extends Record<string, any> = Record<string, any>,
> = (
  err: ErrorListItem[],
  req: Request<P, ResBody, ReqBody, ReqQuery, LocalsObj>,
  res: Response<ResBody, LocalsObj>,
  next: NextFunction,
) => void | Promise<void>

export interface CompleteValidationSchema<
  TParams extends ValidationSchema = EmptyValidationSchema,
  TQuery extends ValidationSchema = EmptyValidationSchema,
  TBody extends ValidationSchema = EmptyValidationSchema,
> {
  handler?: ErrorRequestHandler
  params?: TParams
  query?: TQuery
  body?: TBody
}

export type ZodOutput<T extends ValidationSchema> = z.output<
  T extends ZodRawShape ? z.ZodObject<T> : T
>
export type WeakRequestHandler = RequestHandler<
  unknown,
  unknown,
  unknown,
  Record<string, unknown>
>
