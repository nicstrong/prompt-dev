import { useQuery } from '@tanstack/react-query'
import { trpc } from '@/trpc/trpc.ts'
type Props = {}

export function ThreadList({}: Props) {
  const { data: threads } = useQuery(trpc.threads.getAllForUser.queryOptions())

  return (
    <div className='flex flex-col'>
      <ul>{threads?.map((thread) => <li>{thread.name}</li>)}</ul>
    </div>
  )
}
