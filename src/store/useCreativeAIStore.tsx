import { OutlineCard } from '@/lib/types';
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

type CreativeAIStore = {
    outlines: OutlineCard[] | [];
    setCurrentAiPrompt: (prompt: string) => void;
    addMultipleOutlines: (outlines: OutlineCard[]) => void;
    addOutline: (outline: OutlineCard) => void;
    currentAiPrompt: string;
    resetOutlines: () => void;
}

const useCreativeAIStore = create<CreativeAIStore>()(
   persist((set) => ({

    currentAiPrompt: '',
    setCurrentAiPrompt: (prompt: string) => {
        set({ currentAiPrompt: prompt });
    },
    outlines: [],
    addOutline: (outline: OutlineCard) => {
        set((state) => ({
            outlines: [ outline,...state.outlines],
        }));
    },

    addMultipleOutlines: (outlines: OutlineCard[]) => {
        set((state) => ({
            outlines: [...outlines],
        }));
    },

    resetOutlines: () => {
        set({ outlines: [] });
    },

   }), {
    name: 'Creative-ai', 
   })
   
)

export default useCreativeAIStore;