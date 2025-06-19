export interface Slide {
    id: string;
    slideName: string;
    type: string;
    content: ContentItem;
   slideOrder: number;
    className?: string;
}

export type ContentType = 
    |'column'
    | 'resizable-column'
    | 'text'
    | 'paragraph'
    | 'image'
    | 'table'
    | 'multiColumn'
    | 'blank'
    | 'imageAndText'
    | 'heading1'
    | 'heading2'
    | 'heading3'
    | 'table'
    | 'blockquote'
    | 'numberedList'
    | 'bulletedList'
    | 'code'
    | 'link'
    | 'quote'
    | 'divider'
    | 'calloutBox'
    | 'todoList'
    | 'bulletList'
    | 'codeBlock'
    | 'customButton'
    | 'table'
    | 'tableOfContents'
    
     

export interface ContentItem {
    id: string;
    type: ContentType;
    name: string;
    content: ContentItem[] | string | string[] | string[][];
    initialRows?:number;
    initialColumns?: number;
    restrictToDrop?: boolean;
    columns?: number;
    placeholder?: string;
    className?: string;
    alt?: string;
    callOutType?: 'sucess' | 'warning' | 'info' | 'question' | 'caution';
    link?: string;
    code?: string;
    bgColor?: string;
    isTransparent?: boolean;
}

export interface Theme {
    
    name: string;
    fontFamily: string;
    fontColor: string;
    backgroundColor: string;
    slideBackgroundColor?: string;
    accentColor: string;
    gradientColor?: string;
    gradientBackground?: string;
    navbarColor?: string;
    sidebarColor?: string;
    type: 'light' | 'dark';
}

export interface OutlineCard {
    id: string;
    title: string;
    order: number;
}