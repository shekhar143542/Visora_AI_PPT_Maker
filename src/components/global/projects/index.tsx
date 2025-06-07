import React from 'react'
import { Project } from '@prisma/client'
import { motion } from 'framer-motion'
import { containerVariants } from '@/lib/constants'
import ProjectCard from '@/components/global/project-card';

type Props = {
  projects:Project[]
}

const Projects = ({projects}: Props) => {
  return (
    <motion.div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    >
      {projects.map((project, id) => (
        <ProjectCard 
        key={id} 
        projectId={project?.id}
        title={project?.title}
        createdAt={project?.createdAt.toString()}
        isDeleted={project?.isDeleted ?? false}
        slideData={project?.slides}
        themeName={project.themeName ?? "Default"}
       
        />
      ))}
    </motion.div>
  )
}

export default Projects
