import { ensureSuccess, RequestEnricher, withEnricher } from './utils/fetch'
import { urlConcat } from './utils/url'
import { getConfig } from './config'
import { ApiOptions } from './types'

export const execute = async (path: string, init?: RequestInit) => {
  const config = getConfig()
  const resp = await fetch(
    urlConcat(config.baseUrl, path),
    await withEnricher(createEnricher(config), init),
  )
  await ensureSuccess(resp)
  return resp
}

export const get = async <T>(
  path: string,
  params?: Record<string, any>,
  init?: RequestInit,
): Promise<T> => {
  let finalPath = path

  if (params) {
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    }
    const queryString = searchParams.toString()
    if (queryString) {
      finalPath = `${path}${path.includes('?') ? '&' : '?'}${queryString}`
    }
  }

  const resp = await execute(finalPath, {
    ...init,
    method: 'GET',
  })
  return (await resp.json()) as T
}

export const post = async <TBody, TResponse>(
  path: string,
  body?: TBody,
  init?: RequestInit,
): Promise<TResponse> => {
  const requestInit: RequestInit = {
    ...init,
    method: 'POST',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }
  if (body !== undefined) {
    const headers = new Headers(init?.headers)
    headers.set('Content-Type', 'application/json')
    requestInit.headers = headers
  }
  const resp = await execute(path, requestInit)
  return (await resp.json()) as TResponse
}

export const del = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T | void> => {
  const resp = await execute(path, {
    ...init,
    method: 'DELETE',
  })
}

export const patch = async <TBody, TResponse>(
  path: string,
  body?: TBody,
  init?: RequestInit,
): Promise<TResponse> => {
  const requestInit: RequestInit = {
    ...init,
    method: 'PATCH',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }
  if (body !== undefined) {
    const headers = new Headers(init?.headers)
    headers.set('Content-Type', 'application/json+patch')
    requestInit.headers = headers
  }
  const resp = await execute(path, requestInit)
  return (await resp.json()) as TResponse
}

function createEnricher(options: ApiOptions): RequestEnricher {
  return async (init: RequestInit) => {
    let headers: Record<string, string> = {}
    if (options.getHeaders) {
      headers = await options.getHeaders()
    }
    if (options.getToken) {
      headers['Authorization'] = 'Bearer ' + (await options.getToken())
    }
    if (!(init.headers instanceof Headers)) {
      init.headers = new Headers(init.headers)
    }
    for (const [key, value] of Object.entries(headers)) {
      init.headers.append(key, value)
    }
  }
}
