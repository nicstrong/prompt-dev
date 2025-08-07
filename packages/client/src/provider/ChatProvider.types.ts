import { Thread, ThreadWithMessages } from '@prompt-dev/shared-types'

export type ChatProviderOptions = {
  threadApi: ThreadApi

  api?: string
  // if the chat api requires auth
  getAuthToken?: () => Promise<string>

  // If not provided will be stored in local state (not persistent)
  model?: string | null
  setModel?: (model: string) => void

  onMessageComplete?: (threadId: string, isNew: boolean, messageId: string) => void
}

export type ThreadApi = {
  getThreadWithMessages: (
    threadId: string,
  ) => Promise<ThreadWithMessages | null>

  updateThreadCache: (thread: Thread) => void
}
