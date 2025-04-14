import { inferOutput } from '@trpc/tanstack-react-query'
import { trpc } from './trpc'

export type Threads = inferOutput<typeof trpc.threads.getAllForUser>
export type Thread = Threads[number]
