// import { Button } from '@/components/ui/button'
// import { Search } from 'lucide-react'
// import { Input } from '@/components/ui/input'
// import React from 'react'

// const SearchBar = () => {
//   return (
//     <div className='min-w-[60%] relative flex items-center border rounded-full bg-primary-90'>
//       <Button
//       type="submit"
//       size={"sm"}
//       variant={"ghost"}
//         className='absolute left-0  h-full rounded-l-none bg-transparent  hover:bg-transparent'>
//             <Search className='h-4 w-4' />
//             <span className='sr-only'>Search</span>

//       </Button>
//       <Input
//         type="text"
//         placeholder="Search by title"
//         className="flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 ml-6"
//       />
//     </div>
//   )
// }

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "../mode-toggle";

const SearchBar = () => {
  return (
    <div className="w-full max-w-2xl relative flex items-center rounded-full border shadow-sm px-3 py-0.5 bg-background transition-all dark:border-gray-700 border-gray-300">
      
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      
      <Input
        type="text"
        placeholder="Search by title..."
        className="pl-11 pr-3 text-sm bg-transparent border-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      <Button
        type="submit"
        size="sm"
        variant="ghost"
        className="text-muted-foreground hover:text-foreground"
      >
        {/* Optional icon or text if needed */}
      </Button>

      <div className="ml-2">
       
      </div>
    </div>
  );
};

export default SearchBar;

