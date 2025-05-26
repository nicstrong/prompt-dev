import { Settings } from '@/components/Settings/Settings'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/settings')({
  component: SettingsComponent,
})

function SettingsComponent() {
  return <Settings />
}
