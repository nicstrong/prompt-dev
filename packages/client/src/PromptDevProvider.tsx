import { useCallback, useMemo } from 'react'
import {
  PromptDevContextType,
  PromptDevContext,
} from './PromptDevProvider.context'
import { urlConcat } from './utils/url'
import { withEnricher, ensureSuccess, RequestEnricher } from './utils/fetch'

export type PromptDevOptions = {
  baseUrl: string
  getToken?: () => Promise<string>
  getHeaders?: () => Promise<Record<string, string>>
}

export type Props = {
  options: PromptDevOptions
  children: React.ReactNode
}

export function PromptDevProvider({ options, children }: Props) {
  const execute = useCallback(async (path: string, init?: RequestInit) => {
    const resp = await fetch(
      `${options.baseUrl}${urlConcat(options.baseUrl, path)}`,
      await withEnricher(createEnricher(options), init),
    )
    await ensureSuccess(resp)
    return resp
  }, [])

  const value = useMemo<PromptDevContextType>(
    () => ({ execute, options }),
    [execute, options],
  )

  return (
    <PromptDevContext.Provider value={value}>
      {children}
    </PromptDevContext.Provider>
  )
}

function createEnricher(options: PromptDevOptions): RequestEnricher {
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
