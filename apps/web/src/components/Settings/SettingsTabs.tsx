import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { ManageModels } from './ManageModels'

type TabType = 'account' | 'manageModels'

export function SettingsTabs() {
  const [tab, setTab] = useState<TabType>('account')

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as TabType)}>
      <TabsList>
        <TabsTrigger value='account'>Account</TabsTrigger>
        <TabsTrigger value='manageModels'>Manage models</TabsTrigger>
      </TabsList>
      <TabsContent value='account'>
        Make changes to your account here.
      </TabsContent>
      <TabsContent value='manageModels'>
        <ManageModels />
      </TabsContent>
    </Tabs>
  )
}
