'use client'

import { useRouter } from 'next/navigation';
import {motion, AnimatePresence} from 'framer-motion';
import usePromptStore from '@/store/usePromptStore';
import CreatePage from './CreatePage/CreatePage';
import CreativeAI from './GenetateAI/CreativeAI';
import ScratchPage from './Scratch/ScratchPage';

type Props = {}

const RenderPage = (props:Props) => {

    const router = useRouter();

    const {page, setPage} = usePromptStore()

    const handleBack = () => {
        setPage('create');
    }

    const handleSelectOption = (option: string) => {
        if (option === 'template') {
            router.push('/templates')
        } else if (option === 'create-scratch') {
            setPage('create-scratch');
            
        }
        else {
            setPage('creative-ai');
            
        }
    }

    const renderStep = () => {

        switch (page) {
            case 'create':
                return <CreatePage onSelectOption={handleSelectOption}/>
                case 'creative-ai':
                return <CreativeAI onBack={handleBack}/>
            case 'create-scratch':
                return <ScratchPage onBack={handleBack}/>
            
            default:
                return null;
        }
    }


  return (
    <AnimatePresence mode='wait'>
        <motion.div 
        key={page}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            {renderStep()}
        </motion.div>
    </AnimatePresence>
  )
}

export default RenderPage
