import { generateLayouts } from '@/actions/chatgpt'
import { Button } from '@/components/ui/button'
import { Theme } from '@/lib/types'
import { useSlideStore } from '@/store/useSlideStore'
import { Loader2, Wand2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from 'framer-motion'
import { themes } from '@/lib/constants'


type Props = {
    selectedTheme: Theme
    themes: Theme[]
    onThemeSelect: (theme: Theme) => void
}

const ThemePicker = ({
    onThemeSelect,
    selectedTheme,
}:Props) => {

    const router = useRouter();

    const params = useParams();
    
    const {project, setSlides, currentTheme} = useSlideStore();

    const [loading, setLoading] = useState(false)

    const handleGenerateLayouts = async () => {
    setLoading(true);
    if (!selectedTheme) {
      toast.error(
         "Error",
        {description: "Please select a theme",
            duration:2000,
    });
      return;
    }

    if (project?.id === "") {
      toast.error(
         "Error",
        {
        description: "Please create a project",
      });
      router.push("/create-page");
      return;
    }

    try {
        const res = await generateLayouts(params.presentationId as string,
            currentTheme.name
        )

        if(res?.status !== 200 && !res?.data){
            throw new Error('Failed to generate layouts')
        }

        toast.success('Success',{
            description: 'Layouts generated',
        })

        router.push(`/presentation/${project?.id}`)
        setSlides(res.data)

    } catch (error) {

        toast.error(
         "Error",
        {
        description: "Failed to generate layouts",
      });

        return{
            status:500,
            error:'Internal server error'

        }
    }finally{
        setLoading(false)
    }
}

  return (
    <div
    className="w-[400px] overflow-hidden sticky top-0 h-screen flex flex-col"
      style={{
        backgroundColor:
          selectedTheme.sidebarColor || selectedTheme.backgroundColor,
        borderLeft: `1px solid ${selectedTheme.accentColor}20`,
      }}
    >
      <div className="p-8 space-y-6 flex-shrink-0">
        <div className="space-y-2">
            <h2
            className="text-3xl font-bold tracking-tight"
            style={{ color: selectedTheme.accentColor }}
          >
            Pick a theme
          </h2>
          <p
            className="text-sm"
            style={{ color: `${selectedTheme.accentColor}80` }}
          >
            Choose from our curated collection or generate a custom theme
          </p>
        </div>
        <Button
        className="w-full h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 "
          style={{
            backgroundColor: selectedTheme.accentColor,
            color: selectedTheme.backgroundColor,
          }}
           onClick={handleGenerateLayouts}
        >
          {  loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-5 w-5" />
          )}
          {loading ? (
            <p className="animate-pulse">Generating...</p>
          ) : (
            "Generate Theme"
          )}
        </Button>
      </div>
<ScrollArea className="flex-grow px-8 pb-10">
  <div className="grid grid-cols-1 gap-6">
    {themes.map((theme) => (
      <motion.div
        key={theme.name}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className="rounded-3xl overflow-hidden shadow-lg ring-1 ring-black/5 hover:ring-2 hover:ring-black/10 transition-all duration-300 bg-white dark:bg-neutral-900"
      >
        <Button
          className="flex flex-col items-start justify-start w-full h-auto p-6 gap-4 rounded-3xl text-left"
          onClick={() => onThemeSelect(theme)}
          style={{
            fontFamily: theme.fontFamily,
            color: theme.fontColor,
            background: theme.gradientBackground || theme.backgroundColor,
          }}
        >
          <div className="w-full flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-bold tracking-tight drop-shadow-sm">
              {theme.name}
            </span>
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: theme.accentColor }}
            />
          </div>

          <div className="w-full space-y-2">
            <div
              className="text-4xl font-extrabold leading-tight tracking-tight drop-shadow-sm"
              style={{ color: theme.accentColor }}
            >
              Title
            </div>
            <div className="text-base font-medium opacity-90 tracking-wide leading-snug">
              Body &{" "}
              <span
                className="underline underline-offset-4 font-semibold"
                style={{ color: theme.accentColor }}
              >
                link
              </span>
            </div>
          </div>
        </Button>
      </motion.div>
    ))}
  </div>
</ScrollArea>

    </div>
  )
}

export default ThemePicker
