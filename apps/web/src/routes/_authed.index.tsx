import Layout from '@/components/Layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/')({
  component: Home,
})

function Home() {
  return <Layout />
}
