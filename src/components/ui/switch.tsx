"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
  "peer relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-lg overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-amber-400 data-[state=checked]:to-orange-500 data-[state=unchecked]:bg-gradient-to-r data-[state=unchecked]:from-slate-800 data-[state=unchecked]:to-slate-900 hover:shadow-xl",
  className
)}

    {...props}
    ref={ref}
  >
    {/* Moon Icon - Left Side */}
    <div className="absolute left-1 z-10 flex items-center justify-center transition-all duration-300">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="peer-data-[state=checked]:text-slate-700 peer-data-[state=unchecked]:text-slate-200 drop-shadow-sm peer-data-[state=checked]:opacity-30 peer-data-[state=unchecked]:opacity-100"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </div>
    
    {/* Sun Icon - Right Side */}
    <div className="absolute right-1 z-10 flex items-center justify-center transition-all duration-300">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="peer-data-[state=checked]:text-orange-900 peer-data-[state=unchecked]:text-slate-400 drop-shadow-sm peer-data-[state=checked]:opacity-100 peer-data-[state=unchecked]:opacity-30"
      >
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    </div>

   <SwitchPrimitives.Thumb
  className={cn(
    "pointer-events-none block h-7 w-7 rounded-full bg-white shadow-xl ring-0 transition-all duration-300 data-[state=checked]:translate-x-[40px] data-[state=unchecked]:translate-x-0 z-20 border-2 border-gray-100"
  )}
/>

  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
