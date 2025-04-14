import { AppSidebar } from './AppSidebar'
import { Main } from './Main'
import { SidebarProvider } from './ui/sidebar'

function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Main />
    </SidebarProvider>
  )
}

export default Layout
