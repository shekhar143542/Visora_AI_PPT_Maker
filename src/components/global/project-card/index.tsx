'use client';

import { itemVariants, themes } from '@/lib/constants';
import { useSlideStore } from '@/store/useSlideStore';
import { JsonValue } from '@prisma/client/runtime/library';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import ThumbnailPreview from './thumbnail-preview';
import { timeAgo } from '@/lib/utils';
import AlertDialougBox from '../aler-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { deleteProject, recoverProject } from '@/actions/project';
import { Upload, Sparkles } from 'lucide-react';

type Props = {
    projectId: string;
    title: string;
    createdAt: string;
    isDeleted: boolean;
    slideData: JsonValue
    themeName: string;
    source?: string;
    originalFileName?: string;
    importDate?: string;
}

const ProjectCard = ({
    projectId,
    title,
    createdAt,
    isDeleted,
    slideData,
    themeName,
    source = 'ai-generated',
    originalFileName,
    importDate,
}:Props) => {

    const [loading,setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const router = useRouter();

    const {setSlides} = useSlideStore();

    const handleNavigateToProject = () => {
        // Navigate to the project page
        // This function should be implemented to handle navigation logic
        console.log(`Navigating to project: ${projectId}`);
        setSlides(JSON.parse(JSON.stringify(slideData)));
        router.push(`/presentation/${projectId}`);
    }

    const theme = themes.find((theme) => theme.name === themeName) || themes[0];

    const handleRecover = async () => {
        setLoading(true)
        if(!projectId){
            setLoading(false)
            toast.error("Error", {
            description:"Project not found"})
                 
            return;
        }

        try {
            const res = await recoverProject(projectId)

            if(res.status!==200 ){
                toast.error("Oopse!", {
                description: res.error || "Something went wrong. Please contact support.",
            })

            return 

            }

            setOpen(false)
            router.refresh()
            toast.success("Success", {
                description:"Project recovered successfully"
            })
        } catch (error) {

            console.log(error)
            toast.error("Oopse!", {
                description:"Something went wrong. Please contact support.",
            })
        }
    }

    const handleDelete = async () => {
        setLoading(true)
        if(!projectId){
            setLoading(false)
            toast.error("Error", {
            description:"Project not found"})
                 
            return;
        }

        try {
            const res = await deleteProject(projectId)

            if(res.status!==200 ){
                toast.error("Oopse!", {
                description: res.error || "Failed to delete the project",
            })

            return 
            
            }

            setOpen(false)
            router.refresh()
            toast.success("Success", {
                description:"Project deleted successfully"
            })
        } catch (error) {

            console.log(error)
            toast.error("Oopse!", {
                description:"Something went wrong. Please contact support.",
            })
        }
    }

  return (
    <motion.div
  variants={itemVariants}
  className={`group w-full flex flex-col gap-y-3 rounded-xl p-3 transition-colors ${isDeleted && 'hover:bg-muted/50'}`}
>
        <div className='relative aspect-[16/10] overflow-hidden rounded-lg cursor-pointer'
        onClick={handleNavigateToProject}
        >
         <ThumbnailPreview 
           theme={theme}
         
          slide={JSON.parse(JSON.stringify(slideData))?.[0]}
          />  
          
        </div>
        <div className='w-full'>
            <div className='space-y-1'>
                <div className='flex items-center gap-2'>
                    <h3 className='font-semibold text-base text-primary line-clamp-1 flex-1'>
                        {title}
                    </h3>
                    {source === 'imported' ? (
                        <div className='flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs'>
                            <Upload className='h-3 w-3' />
                            Imported
                        </div>
                    ) : (
                        <div className='flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs'>
                            <Sparkles className='h-3 w-3' />
                            AI Generated
                        </div>
                    )}
                </div>
                <div className='flex w-full justify-between items-center gap-2'>
                    <div className='flex flex-col'>
                        <p className="text-sm text-muted-foreground dark:text-gray-400"
                        suppressHydrationWarning
                        >
                            {source === 'imported' && importDate ? timeAgo(importDate) : timeAgo(createdAt)}
                        </p>
                        {source === 'imported' && originalFileName && (
                            <p className="text-xs text-muted-foreground dark:text-gray-500">
                                from {originalFileName}
                            </p>
                        )}
                    </div>

                    {isDeleted ? 
                    (
                    <AlertDialougBox description='This will recover your project and restore your
                     data' className='bg-green-500 text-white dark:bg-green-600 hover:bg-green-600
                     dark:hover:bg-green-700'
                     loading={loading}
                     open={open}
                     onClick={handleRecover}
                     handleOpen={ () => setOpen(!open)}
                     ><Button
                    size="sm"
                    variant="ghost"
                    className="
                        bg-gray-200 hover:bg-gray-300 text-black
                        dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white
                        transition-colors duration-200
                    "
                    disabled={loading}
                    >
                    Recover
                    </Button>

             </AlertDialougBox>
                      ) : (

                         <AlertDialougBox description='This will delete your project and send to trash.'
                          className='bg-red-500 text-white dark:bg-red-600 hover:bg-red-600
                     dark:hover:bg-red-700'
                     loading={loading}
                     open={open}
                     onClick={handleDelete}
                     handleOpen={ () => setOpen(!open)}
                     ><Button
                    size="sm"
                    variant="ghost"
                    className="
                        bg-gray-200 hover:bg-gray-300 text-black
                        dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white
                        transition-colors duration-200
                    "
                    disabled={loading}
                    >
                    Delete
                    </Button>

             </AlertDialougBox>
                      )} 
                </div>
            </div>
        </div>
    </motion.div>
  )
}

export default ProjectCard
