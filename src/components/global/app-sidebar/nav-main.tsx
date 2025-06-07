'use client'

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const NavMain = ({
  items
}: {
  items: {
    title: string
    url: string
    icon: React.FC<React.SVGProps<SVGSVGElement>>
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) => {
  const pathname = usePathname()

  return (
    <SidebarGroup className='p-0 pt-6'>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname.includes(item.url)

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={isActive ? 'bg-muted' : ''}
              >
                <Link
                  href={item.url}
                  className={`flex items-center gap-2 text-lg ${
                    isActive ? 'font-bold text-foreground' : ''
                  }`}
                >
                  <item.icon className='text-xl' />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain
