import NavMain from "@/components/global/app-sidebar/nav-main";
import { HomeIcon, LayoutTemplateIcon, SettingsIcon, TrashIcon } from "lucide-react";
import { ComponentGroup, LayoutGroup, LayoutSlides, Theme } from "@/lib/types";

import {
  BlankCard,
  AccentLeft,
  AccentRight,
  ImageAndText,
  TextAndImage,
  TwoColumns,
  ThreeColumns,
  TwoColumnsWithHeadings,
  ThreeColumnsWithHeadings,
  FourColumns,
  TwoImageColumns,
  FourImageColumns,
  ThreeImageColumns,
} from "@/lib/slideLayouts";
import {
  BlankCardIcon,
  FourColumnsIcon,
  FourImageColumnsIcon,
  ImageAndTextIcon,
  TextAndImageIcon,
  ThreeColumnsIcon,
  ThreeColumnsWithHeadingsIcon,
  ThreeImageColumnsIcon,
  TwoColumnsIcon,
  TwoColumnsWithHeadingsIcon,
  TwoImageColumnsIcon,
} from "./icons-Component";
import {
  BulletListComponent,
  CalloutBoxComponent,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  NumberedListComponent,
  Paragraph,
  ResizableColumn,
  Table,
  Title,
  TodoListComponent,
} from "./slideComponent";

export const data = {
    user:{
        name:'samuel',
        email:'m@example.com',
        avatar:'/avatars/shadcn.jpg',
    },
    navMain:[{
        title: "Home",
        url: "/dashboard",
        icon:HomeIcon,
    },
    {
        title: "Templates",
        url: "/templates",
        icon:LayoutTemplateIcon,
    },
    {
        title: "Trash",
        url: "/trash",
        icon:TrashIcon,
    },
    {
        title: "Settings",
        url: "/settings",
        icon:SettingsIcon,
    }
]
}



export const containerVariants = {
    hidden: {opacity: 0},
    visible: {opacity: 1, transition: {staggerChildren: 0.1}}
}

export const itemVariants = {
    hidden: {y:20, opacity: 0},
    visible: {
        y:0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            // damping: 20
        }as const,
    }
}

export const themes: Theme[] = [
  {
      name: "Executive Classic",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#1a1a1a",
      backgroundColor: "#ffffff",
      slideBackgroundColor: "#ffffff",
      accentColor: "#2563eb",
      navbarColor: "#f8fafc",
      sidebarColor: "#ffffff",
      type: "light",
  },
  {
      name: "Corporate Platinum",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#0f172a",
      backgroundColor: "#f1f5f9",
      slideBackgroundColor: "#ffffff",
      accentColor: "#475569",
      gradientBackground: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      navbarColor: "#e2e8f0",
      sidebarColor: "#f1f5f9",
      type: "light",
  },
  {
      name: "Modern Charcoal",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#f8fafc",
      backgroundColor: "#0f172a",
      slideBackgroundColor: "#1e293b",
      accentColor: "#3b82f6",
      gradientBackground: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      navbarColor: "#1e293b",
      sidebarColor: "#0f172a",
      type: "dark",
  },
  {
      name: "Executive Blue",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#ffffff",
      backgroundColor: "#1e40af",
      slideBackgroundColor: "#2563eb",
      accentColor: "#60a5fa",
      gradientBackground: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
      navbarColor: "#2563eb",
      sidebarColor: "#1e40af",
      type: "dark",
  },
  {
      name: "Minimal Slate",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#334155",
      backgroundColor: "#f8fafc",
      slideBackgroundColor: "#ffffff",
      accentColor: "#64748b",
      gradientBackground: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      navbarColor: "#f1f5f9",
      sidebarColor: "#f8fafc",
      type: "light",
  },
  {
      name: "Professional Navy",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#f1f5f9",
      backgroundColor: "#1e293b",
      slideBackgroundColor: "#334155",
      accentColor: "#0ea5e9",
      gradientBackground: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
      navbarColor: "#334155",
      sidebarColor: "#1e293b",
      type: "dark",
  },
  {
      name: "Clean Monochrome",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#111827",
      backgroundColor: "#ffffff",
      slideBackgroundColor: "#ffffff",
      accentColor: "#374151",
      navbarColor: "#f9fafb",
      sidebarColor: "#ffffff",
      type: "light",
  },
  {
      name: "Business Teal",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#ffffff",
      backgroundColor: "#0f766e",
      slideBackgroundColor: "#0d9488",
      accentColor: "#14b8a6",
      gradientBackground: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
      navbarColor: "#0d9488",
      sidebarColor: "#0f766e",
      type: "dark",
  },
  {
      name: "Sophisticated Gray",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#1f2937",
      backgroundColor: "#f3f4f6",
      slideBackgroundColor: "#ffffff",
      accentColor: "#6b7280",
      gradientBackground: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
      navbarColor: "#e5e7eb",
      sidebarColor: "#f3f4f6",
      type: "light",
  },
  {
      name: "Executive Emerald",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#ffffff",
      backgroundColor: "#064e3b",
      slideBackgroundColor: "#065f46",
      accentColor: "#10b981",
      gradientBackground: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
      navbarColor: "#065f46",
      sidebarColor: "#064e3b",
      type: "dark",
  },
  {
      name: "Classic Indigo",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#f8fafc",
      backgroundColor: "#312e81",
      slideBackgroundColor: "#3730a3",
      accentColor: "#6366f1",
      gradientBackground: "linear-gradient(135deg, #312e81 0%, #3730a3 100%)",
      navbarColor: "#3730a3",
      sidebarColor: "#312e81",
      type: "dark",
  },
  {
      name: "Premium Stone",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#292524",
      backgroundColor: "#fafaf9",
      slideBackgroundColor: "#ffffff",
      accentColor: "#78716c",
      gradientBackground: "linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)",
      navbarColor: "#f5f5f4",
      sidebarColor: "#fafaf9",
      type: "light",
  },
  {
      name: "Corporate Crimson",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#ffffff",
      backgroundColor: "#991b1b",
      slideBackgroundColor: "#b91c1c",
      accentColor: "#ef4444",
      gradientBackground: "linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)",
      navbarColor: "#b91c1c",
      sidebarColor: "#991b1b",
      type: "dark",
  },
  {
      name: "Modern Zinc",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#18181b",
      backgroundColor: "#fafafa",
      slideBackgroundColor: "#ffffff",
      accentColor: "#52525b",
      gradientBackground: "linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%)",
      navbarColor: "#f4f4f5",
      sidebarColor: "#fafafa",
      type: "light",
  },
  {
      name: "Executive Violet",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#faf5ff",
      backgroundColor: "#581c87",
      slideBackgroundColor: "#6b21a8",
      accentColor: "#a855f7",
      gradientBackground: "linear-gradient(135deg, #581c87 0%, #6b21a8 100%)",
      navbarColor: "#6b21a8",
      sidebarColor: "#581c87",
      type: "dark",
  },
  {
      name: "Professional Amber",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#451a03",
      backgroundColor: "#fffbeb",
      slideBackgroundColor: "#ffffff",
      accentColor: "#f59e0b",
      gradientBackground: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
      navbarColor: "#fef3c7",
      sidebarColor: "#fffbeb",
      type: "light",
  },
  {
      name: "Midnight Professional",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#e4e4e7",
      backgroundColor: "#18181b",
      slideBackgroundColor: "#27272a",
      accentColor: "#71717a",
      gradientBackground: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
      navbarColor: "#27272a",
      sidebarColor: "#18181b",
      type: "dark",
  },
  {
      name: "Business Rose",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#ffffff",
      backgroundColor: "#9f1239",
      slideBackgroundColor: "#be185d",
      accentColor: "#f43f5e",
      gradientBackground: "linear-gradient(135deg, #9f1239 0%, #be185d 100%)",
      navbarColor: "#be185d",
      sidebarColor: "#9f1239",
      type: "dark",
  },
  {
      name: "Corporate Sage",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#14532d",
      backgroundColor: "#f0fdf4",
      slideBackgroundColor: "#ffffff",
      accentColor: "#16a34a",
      gradientBackground: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      navbarColor: "#dcfce7",
      sidebarColor: "#f0fdf4",
      type: "light",
  },
  {
      name: "Executive Orange",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#ffffff",
      backgroundColor: "#c2410c",
      slideBackgroundColor: "#ea580c",
      accentColor: "#fb923c",
      gradientBackground: "linear-gradient(135deg, #c2410c 0%, #ea580c 100%)",
      navbarColor: "#ea580c",
      sidebarColor: "#c2410c",
      type: "dark",
  },
  {
      name: "Professional Cyan",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#083344",
      backgroundColor: "#ecfeff",
      slideBackgroundColor: "#ffffff",
      accentColor: "#0891b2",
      gradientBackground: "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)",
      navbarColor: "#cffafe",
      sidebarColor: "#ecfeff",
      type: "light",
  },
  {
      name: "Modern Neutral",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#171717",
      backgroundColor: "#fafafa",
      slideBackgroundColor: "#ffffff",
      accentColor: "#525252",
      gradientBackground: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
      navbarColor: "#f5f5f5",
      sidebarColor: "#fafafa",
      type: "light",
  },
  {
      name: "Executive Purple",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#f3e8ff",
      backgroundColor: "#4c1d95",
      slideBackgroundColor: "#5b21b6",
      accentColor: "#8b5cf6",
      gradientBackground: "linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)",
      navbarColor: "#5b21b6",
      sidebarColor: "#4c1d95",
      type: "dark",
  },
  {
      name: "Business Lime",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#1a2e05",
      backgroundColor: "#f7fee7",
      slideBackgroundColor: "#ffffff",
      accentColor: "#65a30d",
      gradientBackground: "linear-gradient(135deg, #f7fee7 0%, #ecfccb 100%)",
      navbarColor: "#ecfccb",
      sidebarColor: "#f7fee7",
      type: "light",
  },
  {
      name: "Corporate Steel",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#f1f5f9",
      backgroundColor: "#475569",
      slideBackgroundColor: "#64748b",
      accentColor: "#94a3b8",
      gradientBackground: "linear-gradient(135deg, #475569 0%, #64748b 100%)",
      navbarColor: "#64748b",
      sidebarColor: "#475569",
      type: "dark",
  },
  {
      name: "Professional Pink",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#500724",
      backgroundColor: "#fdf2f8",
      slideBackgroundColor: "#ffffff",
      accentColor: "#ec4899",
      gradientBackground: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
      navbarColor: "#fce7f3",
      sidebarColor: "#fdf2f8",
      type: "light",
  },
  {
      name: "Executive Forest",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#ffffff",
      backgroundColor: "#14532d",
      slideBackgroundColor: "#166534",
      accentColor: "#22c55e",
      gradientBackground: "linear-gradient(135deg, #14532d 0%, #166534 100%)",
      navbarColor: "#166534",
      sidebarColor: "#14532d",
      type: "dark",
  },
  {
      name: "Modern Sky",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#0c4a6e",
      backgroundColor: "#f0f9ff",
      slideBackgroundColor: "#ffffff",
      accentColor: "#0284c7",
      gradientBackground: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
      navbarColor: "#e0f2fe",
      sidebarColor: "#f0f9ff",
      type: "light",
  },
  {
      name: "Corporate Gold",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#451a03",
      backgroundColor: "#fffbeb",
      slideBackgroundColor: "#ffffff",
      accentColor: "#d97706",
      gradientBackground: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
      navbarColor: "#fef3c7",
      sidebarColor: "#fffbeb",
      type: "light",
  },
  {
      name: "Executive Black",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#ffffff",
      backgroundColor: "#000000",
      slideBackgroundColor: "#1f1f1f",
      accentColor: "#6b7280",
      gradientBackground: "linear-gradient(135deg, #000000 0%, #1f1f1f 100%)",
      navbarColor: "#1f1f1f",
      sidebarColor: "#000000",
      type: "dark",
  }
];



export const layouts: LayoutGroup[] = [
  {
    name: "Basic",
    layouts: [
      {
        name: "Blank card",
        icon: BlankCardIcon,
        type: "layout",
        layoutType: "blank-card",
        component: BlankCard,
      },
      {
        name: "Image and text",
        icon: ImageAndTextIcon,
        type: "layout",
        layoutType: "imageAndText",
        component: ImageAndText,
      },
      {
        name: "Text and image",
        icon: TextAndImageIcon,
        type: "layout",
        layoutType: "textAndImage",
        component: TextAndImage,
      },
      {
        name: "Two Columns",
        icon: TwoColumnsIcon,
        type: "layout",
        layoutType: "twoColumns",
        component: TwoColumns,
      },
      {
        name: "Two Columns with headings",
        icon: TwoColumnsWithHeadingsIcon,
        type: "layout",
        layoutType: "twoColumnsWithHeadings",
        component: TwoColumnsWithHeadings,
      },
      {
        name: "Three Columns",
        icon: ThreeColumnsIcon,
        type: "layout",
        layoutType: "threeColumns",
        component: ThreeColumns,
      },
      {
        name: "Three Columns with headings",
        icon: ThreeColumnsWithHeadingsIcon,
        type: "layout",
        layoutType: "threeColumnsWithHeadings",
        component: ThreeColumnsWithHeadings,
      },

      {
        name: "Four Columns",
        icon: FourColumnsIcon,
        type: "layout",
        layoutType: "fourColumns",
        component: FourColumns,
      },
    ],
  },

  {
    name: "Card layouts",
    layouts: [
      {
        name: "Accent left",
        icon: ImageAndTextIcon,
        type: "layout",
        layoutType: "accentLeft",
        component: AccentLeft,
      },
      {
        name: "Accent right",
        icon: TextAndImageIcon,
        type: "layout",
        layoutType: "accentRight",
        component: AccentRight,
      },
    ],
  },

  {
    name: "Images",
    layouts: [
      {
        name: "2 images columns",
        icon: TwoImageColumnsIcon,
        type: "layout",
        layoutType: "twoImageColumns",
        component: TwoImageColumns,
      },
      {
        name: "3 images columns",
        icon: ThreeImageColumnsIcon,
        type: "layout",
        layoutType: "threeImageColumns",
        component: ThreeImageColumns,
      },
      {
        name: "4 images columns",
        icon: FourImageColumnsIcon,
        type: "layout",
        layoutType: "fourImageColumns",
        component: FourImageColumns,
      },
    ],
  },
];

export const CreatePageCard = [
    {
        title: 'Use a',
        highlightedText: 'Template',
        description: 'Write a prompt and leave everything else for us to handle',
        type: 'template',
    },
    {
        title: 'Generate with',
        highlightedText: 'Creative AI',
        description: 'Write a prompt and leave everything else for us to handle',
        type: 'creative-ai', 
        highlight:true
    },

  { title: 'Create from',
    highlightedText: 'Scratch',
    description: 'Write a prompt and leave everything else for us to handle',
    type: 'create-scratch',
}
]

export const createSlideFromLayout = (layoutType: string): LayoutSlides => {
  switch (layoutType) {
    case "blank-card":
      return BlankCard;
    case "accentLeft":
      return AccentLeft;
    case "accentRight":
      return AccentRight;
    case "imageAndText":
      return ImageAndText;
    case "textAndImage":
      return TextAndImage;
    default:
      return BlankCard;
  }
};

export const component: ComponentGroup[] = [
  {
    name: "Text",
    components: [
      {
        name: "Title",
        icon: "T",
        type: "component",
        component: Title,
        componentType: "title",
      },
      {
        componentType: "heading1",
        name: "Heading 1",
        type: "component",
        component: Heading1,
        icon: "H1",
      },
      {
        componentType: "heading2",
        name: "Heading 2",
        type: "component",
        component: Heading2,
        icon: "H2",
      },
      {
        componentType: "heading3",
        name: "Heading 3",
        type: "component",
        component: Heading3,
        icon: "H3",
      },
      {
        componentType: "heading4",
        name: "Heading 4",
        type: "component",
        component: Heading4,
        icon: "H4",
      },

      {
        componentType: "paragraph",
        name: "Paragraph",
        type: "component",
        component: Paragraph,
        icon: "Paragraph",
      },
    ],
  },

  {
    name: "Tables",
    components: [
      {
        componentType: "table2x2",
        name: "2×2 table",
        type: "component",
        component: { ...Table, initialColumns: 2, initialRows: 2 },
        icon: "⊞",
      },
      {
        componentType: "table3x3",
        name: "3×3 table",
        type: "component",
        component: { ...Table, initialColumns: 3, initialRows: 3 },
        icon: "⊞",
      },
      {
        componentType: "table4x4",
        name: "4×4 table",
        type: "component",
        component: { ...Table, initialColumns: 4, initialRows: 4 },
        icon: "⊞",
      },
    ],
  },

  {
    name: "Lists",
    components: [
      {
        componentType: "bulletList",
        name: "Bulleted list",
        type: "component",
        component: BulletListComponent,
        icon: "•",
      },
      {
        componentType: "numberedList",
        name: "Numbered list",
        type: "component",
        component: NumberedListComponent,
        icon: "1.",
      },
      {
        componentType: "todoList",
        name: "Todo list",
        type: "component",
        component: TodoListComponent,
        icon: "☐",
      },
    ],
  },
  {
    name: "Callouts",
    components: [
      {
        componentType: "note",
        name: "Note box",
        type: "component",
        component: { ...CalloutBoxComponent, callOutType: "info" },
        icon: "📝",
      },
      {
        componentType: "info",
        name: "Info box",
        type: "component",
        component: { ...CalloutBoxComponent, callOutType: "info" },
        icon: "ℹ",
      },
      {
        componentType: "warning",
        name: "Warning box",
        type: "component",
        component: { ...CalloutBoxComponent, callOutType: "warning" },
        icon: "⚠",
      },
      {
        componentType: "caution",
        name: "Caution box",
        type: "component",
        component: { ...CalloutBoxComponent, callOutType: "caution" },
        icon: "⚠",
      },
      {
        componentType: "success",
        name: "Success box",
        type: "component",
        component: { ...CalloutBoxComponent, callOutType: "success" },
        icon: "✓",
      },
      {
        componentType: "question",
        name: "Question box",
        type: "component",
        component: { ...CalloutBoxComponent, callOutType: "question" },
        icon: "?",
      },
    ],
  },

  {
    name: "Columns",
    components: [
      {
        componentType: "resizableColumns",
        name: "2x2 Column",
        type: "component",
        component: ResizableColumn,
        icon: "⊞",
      },
    ],
  },
];