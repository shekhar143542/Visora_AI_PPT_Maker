import { clsx, type ClassValue } from "clsx"
import { timeStamp } from "console"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const timeAgo = ( timeStamp:string) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(timeStamp).getTime()) / 1000);
    const intervals = [
        { label: 'year', value: 60*60*24*365 },
        { label: 'month', value: 60*60*24*30 },
        { label: 'day', value: 60*60*24 },
        { label: 'hour', value: 60*60 },
        { label: 'minute', value: 60 },
        { label: 'second', value: 1 },
    ];
    
    for(let i=0; i < intervals.length; i++) {
        const interval = intervals[i];
        const count = Math.floor(diffInSeconds / interval.value);
        if (count > 0) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }
    return 'just now'; // If no intervals match, return 'just now'
}