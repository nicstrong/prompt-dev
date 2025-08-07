import Layout from '@/components/Layout'
import { createFileRoute } from '@tanstack/react-router'
import { createIdGenerator } from 'ai';

const generateId = createIdGenerator({ size: 24 });

export const Route = createFileRoute('/_authed/')({
  component: Home,
})

function Home() {
  const id = generateId();
  return <Layout threadId={id} autoResume={false} isNew/>
}
