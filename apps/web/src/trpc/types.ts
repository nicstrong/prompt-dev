import { inferOutput } from '@trpc/tanstack-react-query'
import { trpc } from './trpc'

export type Threads = inferOutput<typeof trpc.threads.getAllForUser>
export type Thread = Threads[number]

export type ThreadWithMessages = inferOutput<
  typeof trpc.messages.getAllForThreadId
>
export type Message = NonNullable<ThreadWithMessages>['messages'][number]

export type Models = inferOutput<typeof trpc.models.getModels>
export type Model = Models[number]
