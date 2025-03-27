import { SideNav } from './SideNav'
import { Main } from './Main'

function Content() {
  return (
    <div className='relative flex h-[100dvh] text-gray-100'>
      <SideNav />
      <Main />
    </div>
  )
}

export default Content
