'use client'

import { Button } from '@/components/ui/button'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const NavFooter = ({prismaUser}: {prismaUser:User}) => {

    const { isLoaded, isSignedIn, user } = useUser()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    if(!isLoaded || !isSignedIn) {
        return (
            <div className='p-6 text-center text-gray-500'>
                <p className='mb-2'>Please sign in to access more features</p>
            </div>
        )
    }
  return (
   <SidebarMenu>
    <SidebarMenuItem>
   <div className='flex flex-col gap-y-6 items-start group-data-[collapsible=icon]:hidden'>
      {!prismaUser.subscription && (
  <div className="relative w-full card-border-animate rounded-2xl">
    <div className="relative z-10 flex flex-col items-start gap-3 w-full rounded-2xl p-4 border border-gray-300 dark:border-gray-700 shadow-xl bg-gray-50 dark:bg-[#252525] transition-all">
      <div className="flex flex-col items-start gap-1">
        <p className="text-base font-semibold text-gray-900 dark:text-white">
          Get <span className="text-vivid">Creative AI</span>
        </p>
        <p className="text-xs text-gray-700 dark:text-gray-300">
          Upgrade to unlock all features including AI and more.
        </p>
      </div>

      <div className="w-full rounded-full p-[2px] bg-gradient-to-r from-orange-400 via-purple-500 to-pink-400 animate-border shadow-sm">
        <Button
          className="w-full bg-background-80 hover:bg-background-90 text-primary font-bold rounded-full border-none transition-all text-sm"
          variant="default"
          size="lg"
        >
          {loading ? 'Upgrading...' : 'Upgrade Now'}
        </Button>
      </div>
    </div>
  </div>
)}

<SignedIn>
  <SidebarMenuButton
    size="lg"
    className="
      flex items-center gap-4
      p-4
      rounded-xl
      hover:bg-muted
      transition-all
      data-[state=open]:bg-sidebar-accent
      data-[state=open]:text-sidebar-accent-foreground
      min-h-[64px]  /* ensure enough height */
      overflow-visible  /* prevent clipping */
    "
  >
    <UserButton />

    <div
      className="
        flex flex-col justify-center
        text-left
        leading-snug
        group-data-[collapsible=icon]:hidden
      "
      style={{ lineHeight: '1.2rem' }} /* Ensure line height fits */
    >
      <span className="truncate text-sm font-semibold text-foreground">
        {user?.fullName || 'No name'}
      </span>

      <span className="truncate text-xs text-muted-foreground">
        {user?.emailAddresses[0]?.emailAddress || 'No email'}
      </span>

      <span className="truncate text-xs font-medium mt-1 text-violet-600 dark:text-violet-400">
        {prismaUser?.subscription ? (
  <span className="text-yellow-500 font-semibold">Plan: Premium</span>
) : (
  <span className="text-gray-500">Free Plan</span>
)}

      </span>
    </div>
  </SidebarMenuButton>
</SignedIn>


    </div>
   </SidebarMenuItem>
   </SidebarMenu>
  )
}

export default NavFooter
