import { getAllProjects } from '@/actions/project';
import NotFound from '@/components/global/not-found';
import ProjectCard from '@/components/global/project-card';
import Projects from '@/components/global/projects';
import React from 'react'

const Dashboard = async () => {

  const allProjects = await getAllProjects();
  
return (
  <div className='w-full flex flex-col gap-6 relative'>
    <div className='flex flex-col-reverse items-start w-full gap-6 sm:flex-row sm:justify-between sm:items-center'>

      <div className='flex flex-col items-start'>
        <h1 className='text-2xl font-semibold dark:text-primary backdrop-blur-lg'>
          Projects
        </h1>
        <p className='text-base font-normal text-gray-800 dark:text-gray-300'>
          All of your work in one place
        </p>
      </div>
    </div>

    {/* projects */}
    {/* <ProjectCard /> */}
    {allProjects.data && allProjects.data.length > 0 ? (
      <Projects projects={allProjects.data} />
    ) : (
      <NotFound />
    )}
  </div>
);
}


export default Dashboard


// import { getAllProjects } from '@/actions/project';
// import NotFound from '@/components/global/not-found';
// import ProjectCard from '@/components/global/project-card';
// import Projects from '@/components/global/projects';
// import React from 'react';

// const Dashboard = async () => {
//   const allProjects = await getAllProjects();

//   return (
//     <div className="flex flex-row gap-6 w-full relative px-4 py-6">
      
//       {/* LEFT: Project Card */}
//       <div className="w-full max-w-sm">
//         <ProjectCard />
//       </div>

//       {/* RIGHT: Text and Projects */}
//       <div className="flex flex-col flex-1 gap-6">
        
//         {/* Heading and Description */}
//         <div className="flex flex-col items-start gap-2">
//           <h1 className="text-2xl font-semibold dark:text-primary backdrop-blur-lg">
//             Projects
//           </h1>
//           <p className="text-base font-normal text-gray-800 dark:text-gray-300">
//             All of your work in one place
//           </p>
//         </div>

//         {/* Projects or Not Found */}
//         <div className="w-full">
//           {allProjects.data && allProjects.data.length > 0 ? (
//             <Projects projects={allProjects.data} />
//           ) : (
//             <NotFound />
//           )}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;
