import * as api from '~/api'
import { ThreadWithMessages } from '@prompt-dev/shared-types'
import { messagesKeys } from '~/keys/messagesKeys'

export const messages = {
  getByThreadId: {
    queryOptions: (threadId: string) => ({
      queryKey: messagesKeys.forThread(threadId),
      queryFn: () =>
        api.get<ThreadWithMessages>(`threads/${threadId}/messages`),
    }),
  },
}
