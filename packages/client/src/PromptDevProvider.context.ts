import { createContext, useContext } from 'react'
import { PromptDevOptions } from './PromptDevProvider'

export type RequestOptions = {
  headers?: Record<string, string> | Headers
}
export type PromptDevContextType = {
  execute: (path: string, init?: RequestInit) => Promise<Response>
  options: PromptDevOptions
}

export const PromptDevContext = createContext<PromptDevContextType | null>(null)

export function usePromptDevContext() {
  const value = useContext(PromptDevContext)
  if (!value) {
    throw new Error(
      'usePromptDevContext must be used within a PromptDevProvider',
    )
  }
  return value
}
