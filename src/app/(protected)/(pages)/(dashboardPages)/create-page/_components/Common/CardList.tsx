'use client';


import { OutlineCard } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import React from 'react'
import Card from './Card';
import AddCardButton from './AddCardButton';

type Props = {
outlines: OutlineCard[]
editingCard: string | null;
selectedCard: string | null;
editText: string;
addOutline?: (card: OutlineCard) => void;
onEditChange: (value: string) => void;
onCardSelect: (id:string) => void
onCardDoubleClick: (id:string, title:string) => void;
setEditText: (value: string) => void;
setEditingCard: (id: string | null) => void;
setSelectedCard: (id: string | null) => void;
addMultipleOutlines: (cards: OutlineCard[]) => void;
}

const CardList = ({
    addMultipleOutlines,
    editText,
    editingCard,
    onCardDoubleClick,
    onCardSelect,
    onEditChange,
    outlines,
    selectedCard,
    setEditText,
    setEditingCard,
    setSelectedCard,
    addOutline,
}:Props) => {

    const [draggedItem, setDraggedItem] = useState<OutlineCard | null>(null);

    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const dragOffsetY = useRef<number>(0);

    const onDragOver = (e: React.DragEvent, index:number) => {
        e.preventDefault();
        if(!draggedItem) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const threshold = rect.height/2

        if(y < threshold) {
            setDragOverIndex(index)
        }else{
            setDragOverIndex(index + 1);
        }
        
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if(!draggedItem || dragOverIndex === null) return;

        const udatedCards = [...outlines];
        const draggedIndex = udatedCards.findIndex((card) => card.id === draggedItem.id);
        if(draggedIndex === -1 || draggedIndex === dragOverIndex) return;

        const [removedCard] = udatedCards.splice(draggedIndex, 1);
        udatedCards.splice(dragOverIndex > draggedIndex ? dragOverIndex - 1 : dragOverIndex, 0, removedCard);

        addMultipleOutlines(udatedCards.map((card, index) => ({
            ...card,
            order: index + 1, // Update order based on new position
        })));

        setDraggedItem(null);
        setDragOverIndex(null);
    }

    const onCardUpdate = (id: string, newTitle: string) => {
        addMultipleOutlines(outlines.map((card) =>
            card.id === id ? { ...card, title: newTitle } : card
        ))

        setEditingCard(null);
        setSelectedCard(null);
        setEditText('');
        
    }

    const onAddCard = (index?: number) => {
        const newCard: OutlineCard = {
            id:Math.random().toString(36).substring(2, 9),
            title: editText.trim() || 'New Card',
            order: (index !== undefined ? index+1 : outlines.length) + 1,
        }
        const updatedCards = 
        index !==undefined?[
            ...outlines.slice(0, index + 1),
            newCard,
            ...outlines.slice(index + 1)
            .map((card) => ({...card, order: card.order + 1 })),
        ] : [
            ...outlines,
            newCard
        ]

        addMultipleOutlines(updatedCards);
        setEditText('');
    }

    const onCardDelete = (id: string) => {
        addMultipleOutlines(outlines.filter((card) => card.id !== id)
        .map((card, index) => ({
            ...card,
            order: index + 1, // Update order after deletion
        })));
    
        
    }

    const onDragStart = (e: React.DragEvent, card: OutlineCard) => {
        setDraggedItem(card);
        e.dataTransfer.effectAllowed = 'move';

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

        dragOffsetY.current = e.clientY - rect.top;
        
        const draggedElement = e.currentTarget.cloneNode(true) as HTMLElement;

        draggedElement.style.position = 'absolute';
        draggedElement.style.top = '-1000px';
        draggedElement.style.opacity = '0.8';
        draggedElement.style.width = `${(e.currentTarget as HTMLElement).offsetWidth}px`;
        document.body.appendChild(draggedElement);
        e.dataTransfer.setDragImage(draggedElement,0, dragOffsetY.current);

        setTimeout(() => {
            setDragOverIndex(outlines.findIndex((c) => c.id === card.id));
            document.body.removeChild(draggedElement);
        }, 0);


    }

    const onDragEnd = () => {
        setDraggedItem(null);
        setDragOverIndex(null);
    }

    const getDragOverStyles = (cardindex: number) => {
        if (dragOverIndex === null || draggedItem === null) return {};
        if (cardindex === dragOverIndex) {
            return {
                borderTop: '2px solid #000',
                marginTop: '0.5rem',
                transition: 'margin 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
            }
        }
        else if (cardindex === dragOverIndex - 1) {
            return {
                borderBottom: '2px solid #000',
                marginBottom: '0.5rem',
                transition: 'margin 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
                }
                }

                return {}
    }

  return (
    <motion.div className='space-y-2 -my-2'
    layout
    onDragOver={(e) => {
        e.preventDefault();
        if(outlines.length === 0 || e.clientY > e.currentTarget.getBoundingClientRect().bottom - 20) {
                onDragOver(e, outlines.length);
        }
    }}

    onDrop={(e) => {
        e.preventDefault();
        onDrop(e);
    }}
    >
        <AnimatePresence>
            {outlines.map((card, index) => (

                <React.Fragment key={card.id}>
                    <Card
                    onDragOver={(e) => onDragOver(e, index)}
                    card={card}
                    isEditing={editingCard === card.id}
                    isSelected={selectedCard === card.id}
                    editText={editText}
                    onEditChange={onEditChange}
                    onEditBlur={() => onCardUpdate(card.id, editText)}
                    onEditKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onCardUpdate(card.id, editText);
                        }
                    }}
                    onCardClick={() => onCardSelect(card.id)}
                    onCardDoubleClick={() => onCardDoubleClick(card.id, card.title)}
                    onDeleteClick={() => onCardDelete(card.id)}
                    dragHandlers={{
                        onDragStart: (e) => onDragStart(e, card),
                        onDragEnd:  onDragEnd,
                    }}
                    dragOverStyles={getDragOverStyles(index)}
                    />
                    <AddCardButton 
                    onAddCard = {() => onAddCard(index)}
                    />
                </React.Fragment>

            ))
            
        }
            </AnimatePresence>   
            
         </motion.div>
  )
}


export default CardList
