import Layout from '@/components/Layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/threads/$threadId')({
  component: ThreadsComponent,
})

function ThreadsComponent() {
  const { threadId } = Route.useParams()
  return <Layout threadId={threadId} />
}
