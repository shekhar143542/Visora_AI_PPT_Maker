'use client'

import { Project, User } from '@prisma/client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import NavMain from './nav-main'
import { data } from '@/lib/constants'
import RecentOpen from './recent-open' // Typo fixed here: RecenetOpen → RecentOpen
import NavFooter from './nav-footer'

const AppSidebar = ({
  recentProjects,
  user,
  ...props
}: {
  recentProjects: Project[]
} & {
  user: User
} & React.ComponentProps<typeof Sidebar>) => {
  return (
    <div>
      <Sidebar
        collapsible="icon"
        className="max-w-[212px] bg-background-90 overflow-x-hidden"
        {...props}
      >
        <SidebarHeader className="pt-6 px-3 pb-0">
          <SidebarMenuButton size="lg" className="flex items-center space-x-0.7 data-[state=open]:text-sidebar-accent-foreground">
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarImage src="/visora.png" alt="visora_ai-logo" />
              <AvatarFallback className="rounded-lg">VI</AvatarFallback>
            </Avatar>
            <span className="text-primary text-2xl font-semibold">Visora</span>
          </SidebarMenuButton>
        </SidebarHeader>

        <SidebarContent className="px-2 mt-10 gap-y-6">
          <NavMain items={data.navMain} />
          <RecentOpen recentProjects={recentProjects} />
        </SidebarContent>

        <SidebarFooter>
          <NavFooter prismaUser={user} />
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}

export default AppSidebar
