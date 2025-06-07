import React from 'react'
import { User } from '@prisma/client'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import SearchBar from './upper-info-searchbar'
import ThemeSwitcher from '../mode-toggle'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import NewProjectButton from './new-project-button'

type Props = {
  user: User
  // children?: React.ReactNode
}

const UpperInfoBar = ({ user }: Props) => {
  return (
    <header className='sticky top-0 z-[10] flex shrink-0 flex-wrap items-center gap-2 
    bg-background p-4 justify-between'>
      <SidebarTrigger className='-ml-1' />
      <Separator orientation='vertical' className='mr-2 h-4' />

      <div className='w-full max-w-[95%] flex items-center justify-between gap-6 flex-wrap'>
        {/* Left side: Search and Theme Switch */}
        <div className='flex items-center gap-4 flex-1 min-w-[300px]'>
          <SearchBar />
          <ThemeSwitcher />
        </div>

        {/* Right side: Buttons */}
        <div className='flex items-center gap-3 justify-end mr-2'>
          <Button
            className='bg-primary-80/90 hover:bg-primary-80/80 text-primary font-semibold rounded-lg shadow-sm border border-primary-80/50 
            flex gap-2 items-center transition-colors'
          >
            <Upload size={16} />
            Import
          </Button>

          <div className='ml-2'>
            <NewProjectButton user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default UpperInfoBar
