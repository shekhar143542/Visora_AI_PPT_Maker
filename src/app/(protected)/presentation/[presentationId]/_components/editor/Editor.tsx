import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useSlideStore } from '@/store/useSlideStore'
import type { LayoutSlides, Slide } from "@/lib/types";
import { useDrag, useDrop } from "react-dnd";
import React, { useState } from 'react'
import { cn } from '@/lib/utils';


interface DropZoneProps {
  index: number;
  onDrop: (
    item: {
      type: string;
      layoutType: string;
      component: LayoutSlides;
      index?: number;
    },
    dropIndex: number
  ) => void;
  isEditable: boolean;
}


export const DropZone: React.FC<DropZoneProps> = ({
     index,
  onDrop,
  isEditable,
}) => {
    const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ["SLIDE", "layout"],
    drop: (item: {
      type: string;
      layoutType: string;
      component: LayoutSlides;
      index?: number;
    }) => {
      onDrop(item, index);
    },
    canDrop: () => isEditable,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  if (!isEditable) return null;

  return (
    <div
      ref={dropRef as unknown as React.RefObject<HTMLDivElement>}
      className={cn( 
        "h-4 my-4 rounded-md transition-all duration-300 border-2 border-dashed",
        isOver && canDrop
          ? "border-green-500 bg-green-50"
          : "border-gray-200 hover:border-gray-300",
        canDrop ? "border-blue-200 hover:border-blue-300" : ""
      )}
    >
      {isOver && canDrop && (
        <div className="h-full flex items-center justify-center text-green-600 text-sm font-medium">
          Drop here
        </div>
      )}
    </div>
  );
}

type Props = {
    isEditable: boolean
}

const Editor = ({isEditable}: Props) => {

    const {
        getOrderSlides,
        currentSlide,
        removeSlide,
        addSlideAtIndex,
        reorderSlides,
        slides,
        project
           
    } = useSlideStore();

    const [loading, setLoading] = useState();

  return (
    <div className='flex-1 flex flex-col h-full max-w-3xl mx-auto px-4 mb-20'>
      {loading ? (
        <div className='w-full px-4 flex flex-col space-y-6'>
            <Skeleton className='h-52 w-full'/>
            <Skeleton className='h-52 w-full'/>
            <Skeleton className='h-52 w-full'/>
        </div>
      ) : (
        <ScrollArea className='flex-1 mt-8'>
            <div className='px-4 pb-4 space-y-4 pt-2'>
                {isEditable && <DropZone/>}
            </div>
        </ScrollArea>
      )}
    </div>
  )
}

export default Editor
