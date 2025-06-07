'use client'

import { Button } from '@/components/ui/button'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Project } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'
import React from 'react'
import { toast } from 'sonner'
import { FilePlus } from 'lucide-react' // example icon
import { useRouter } from 'next/navigation'
import { useSlideStore } from '@/store/useSlideStore'


type Props = {
    recentProjects: Project[]
}

const RecentOpen = ({ recentProjects }: Props) => {

    const router = useRouter()
    const {setSlides} = useSlideStore()

    const handleClick = (projectId: string, slides: JsonValue) => {
        if (!projectId || !slides) {
            toast.error("Project not found", {
                description: "The project you are trying to open does not exist or has no slides.",
            })
            return;
        }

        setSlides(JSON.parse(JSON.stringify(slides)));
        router.push(`presentation/${projectId}`);
    }

    return recentProjects.length > 0 ? (
        <SidebarGroup>
            <SidebarGroupLabel>Recently Opened</SidebarGroupLabel>
            <SidebarMenu>
                {recentProjects.map((item) => (
                    <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                            asChild
                            tooltip={item.title}
                            className={'hover:bg-primary-80'}
                        >
                            <Button variant={'link'}
                                onClick={() => handleClick(item.id, item.slides)}
                                className={'text-xs items-center justify-start '}>
                                <span>{item.title}</span>
                            </Button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    ) : (
        <div className='p-6 text-center text-gray-500'>
            <FilePlus className='mx-auto mb-2 h-8 w-8 text-gray-400' />
            <p className='mb-2'>No recent projects found</p>
           
        </div>
    )
}

export default RecentOpen
