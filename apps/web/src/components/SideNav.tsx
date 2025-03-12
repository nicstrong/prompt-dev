import { Button } from './ui/button'
import { Settings } from 'lucide-react'

export const SideNav = () => {
  return (
    <nav className='hidden flex-col border-r border-neutral-700 md:relative md:flex'>
      <div className='flex h-full w-64 flex-1 flex-col'>
        <h1 className='tems-center flex justify-between px-3 pt-3 text-lg'>
          <span>Prompt Dev</span>
        </h1>
      </div>
      <div className='border-t border-neutral-700'>
        <div className='flex w-full p-3'>
          <Button size='icon' variant='ghost' className='mr-3 ml-auto'>
            <Settings />
          </Button>
        </div>
      </div>
    </nav>
  )
}
