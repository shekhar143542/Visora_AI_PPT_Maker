// 'use client'

// import { Button } from '@/components/ui/button';
// import { containerVariants, CreatePageCard, itemVariants } from '@/lib/constants';
// import { motion } from 'framer-motion';
// import React from 'react'

// type Props = {
//     onSelectOption: (option: string) => void;
// }

// const CreatePage = ({onSelectOption}: Props) => {

    
//   return (
//     <motion.div 
//     variants={containerVariants}
//     initial= "hidden"
//     animate="visible"
//     className='space-y-8'
//     >
//         <motion.div
//         variants={itemVariants}
//         className='text-center space-y-2'
//         >
//             <h1 className='text-4xl font-bold text-primary'>
//                 How would you like to get started?
//             </h1>
//             <p className='text-secondary'>
//                 Choose an option below to begin creating your project. You can always change your mind later.
//             </p>
//         </motion.div>
//         <motion.div
//         variants={containerVariants}
//         className='grid gap-6 md:grid-cols-3'
//         >
//             {CreatePageCard.map((option) => 
            
//           (  <motion.div
//           key={option.type}
//           variants={itemVariants}
//           whileHover={{ scale: 1.05, rotate: 2, transition: { duration: 0.2 } }}
//           className={ `${option.highlight ? 'bg-vivid-gradient': 'hover:bg-vivid-gradient border'}
//           rounded-xl p-[1px] transition-all duration-300 ease-in-out cursor-pointer`}
//           >
//             <motion.div
//             className='w-full p-4 flex flex-col gap-y-6 items-start bg-white dark:bg-black rounded-xl'
//             whileHover={{transition: {duration: 0.1},
//         }} >
//             <div className='flex flex-col items-start w-full gap-y-3'>
                
//                 <div>
//                     <p className='text-primary text-lg font-semibold'>
//                         {option.title}
//                     </p>
//                     <p className={`${option.highlight ? 'text-vivid':'text-primary'} text-4xl font-bold`}>
//                         {option.highlightedText}
//                     </p>
//                 </div>
//                 <p className='text-secondary text-sm font-normal'> { option.description}</p>
//             </div>
//             <motion.div
//             className='self-end'
//             whileHover={{ scale: 1.05 }}
//             whileTap={{scale:0.95}}
//             >
//                 <Button
//                 variant={option.highlight ? 'default' : 'outline'}
//                 className='w-fit rounded-xl font-bold'
//                 size={'sm'}
//                 onClick={ () => onSelectOption(option.type) }
//                 >
//                     {option.highlight? 'Generate' : 'Continue'}
//                 </Button>
//                 </motion.div>
//                 </motion.div>
//                 </motion.div>)
//             )}
//         </motion.div>
//     </motion.div>
//   )
// }

// export default CreatePage


'use client'

import { Button } from '@/components/ui/button';
import { containerVariants, CreatePageCard, itemVariants } from '@/lib/constants';
import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import RecentPrompts from '../GenetateAI/RecentPrompts';
import usePromptStore from '@/store/usePromptStore';

type Props = {
  onSelectOption: (option: string) => void;
};

const CreatePage = ({ onSelectOption }: Props) => {

    const { prompts, setPage } = usePromptStore();

    // useEffect(() => {
    //     setPage('create');
    // }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">
          How would you like to get started?
        </h1>
       <p className="text-secondary dark:text-white">
  Choose an option below to begin creating your project. You can always
  change your mind later.
</p>

      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid gap-6 md:grid-cols-3"
      >
        {CreatePageCard.map((option) => (
          <motion.div
            key={option.type}
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              rotateZ: 0.5,
              boxShadow: '0 0 25px rgba(255, 255, 255, 0.2)',
              transition: { duration: 0.4, ease: 'easeInOut' },
            }}
            className={`relative group overflow-hidden
              ${
                option.highlight
                  ? 'bg-vivid-gradient'
                  : 'hover:bg-vivid-gradient border'
              } rounded-xl p-[1px] transition-all duration-300 ease-in-out cursor-pointer`}
          >
            {/* Glowing Sweep Effect */}
            <div className="absolute inset-0 z-0 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-100%] group-hover:before:animate-sweep pointer-events-none" />

            {/* Pulse Border Animation */}
            <div className="absolute z-0 inset-0 rounded-xl border border-transparent group-hover:border-white/30 animate-pulse" />

            <motion.div
              className="relative z-10 w-full p-4 flex flex-col gap-y-6 items-start bg-white dark:bg-black rounded-xl"
            >
              <div className="flex flex-col items-start w-full gap-y-3">
                <div>
                  <p className="text-primary text-lg font-semibold">
                    {option.title}
                  </p>
                  <p
                    className={`${
                      option.highlight ? 'text-vivid' : 'text-primary'
                    } text-4xl font-bold`}
                  >
                    {option.highlightedText}
                  </p>
                </div>
                <p className="text-muted-foreground text-sm font-normal">
                  {option.description}
                </p>
              </div>

              <motion.div
                className="self-end"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={option.highlight ? 'default' : 'outline'}
                  className="w-fit rounded-xl font-bold"
                  size={'sm'}
                  onClick={() => onSelectOption(option.type)}
                >
                  {option.highlight ? 'Generate' : 'Continue'}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {prompts.length > 0 && (<RecentPrompts/>)}
    </motion.div>
  );
};

export default CreatePage;


