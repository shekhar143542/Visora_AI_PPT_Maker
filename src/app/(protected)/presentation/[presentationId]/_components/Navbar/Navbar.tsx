// import { Button } from '@/components/ui/button'
// import { useSlideStore } from '@/store/useSlideStore'
// import { Home, Play, Share2 } from 'lucide-react'
// import Link from 'next/link'
// import React, { useState } from 'react'
// import { toast } from 'sonner'


// type Props = {
//     presentationId: string
   
// }

// const Navbar = ({presentationId}: Props) => {

//     const {currentTheme, project} = useSlideStore()

//     const [isPresentationMode, setIsPresentationMode] = useState(false);

//     const handleCopy = () => {
//     navigator.clipboard.writeText(
//       `${window.location.origin}/share/${presentationId}`
//     );
//     toast.success("Link Copied!", {
//   description: "✨ Ready to paste and share the magic!",
// });

//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0  z-50 w-full h-20 flex justify-between items-center py-4 px-7 border-b"
//      style={{
//         backgroundColor:
//           currentTheme.navbarColor || currentTheme.backgroundColor,
//         color: currentTheme.accentColor,
//       }}
//     >
//         <Link href={"/dashboard"} passHref>

//             <Button
//             variant={"outline"}
//           className={`flex items-center gap-2`}
//           style={{
//             backgroundColor: currentTheme.backgroundColor,
//           }}
//             >
//                 <Home className="w-4 h-4"/>
//                 <span className="hidden  sm:inline">Return Home</span>
//             </Button>

//         </Link>

//         <Link 
//         href={"/presentation/template-market"}
//         className="text-lg font-semibold hidden sm:block"
//         >
//             {/* {project?.title} */}
//             Presentation Editor
//         </Link>

//         <div className="flex items-center gap-4">

//             <Button
//           style={{
//             backgroundColor: currentTheme.backgroundColor,
//           }}
//           onClick={handleCopy}
//           variant={"outline"}
//         >
//           <Share2 className="w-4 h-4" />
//         </Button>
//         {/* add lemonn sq sell templates */}
//         {/* <SellTemplate/> */}

//         <Button
//           variant={"default"}
//           className="flex items-center  gap-2"
//           onClick={() => setIsPresentationMode(true)}
//         >
//           <Play className="w-4 h-4" />
//           <span className="hidden  sm:inline">Present</span>
//         </Button>
        
//         </div>

//         {/* WIP  add presentaiton mode*/}

//          {/* {isPresentationMode && (
//         <PresentationMode onClose={() => setIsPresentationMode(false)} />
//       )} */}

//     </nav>
//   )
// }

// export default Navbar





import { Download, Home, Play, Share2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useSlideStore } from '@/store/useSlideStore'

type Props = {
  presentationId: string
}

const Navbar = ({ presentationId }: Props) => {
  const { currentTheme, project } = useSlideStore()
  const [isPresentationMode, setIsPresentationMode] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/share/${presentationId}`)
    toast.success('Link Copied!', {
      description: '✨ Ready to paste and share the magic!',
    })
  }

//   const handleDownload = async () => {
//     const content = document.getElementById('presentation') // ID should wrap your slide component
//     if (!content) return

//     const html2canvas = (await import('html2canvas')).default
//     const jsPDF = (await import('jspdf')).default

//     const canvas = await html2canvas(content)
//     const imgData = canvas.toDataURL('image/png')

//     const pdf = new jsPDF('landscape', 'mm', 'a4')
//     const width = pdf.internal.pageSize.getWidth()
//     const height = pdf.internal.pageSize.getHeight()

//     pdf.addImage(imgData, 'PNG', 0, 0, width, height)
//     pdf.save(`${project?.title || 'presentation'}.pdf`)

//     toast.success('Downloaded!', {
//       description: '📄 Your presentation is now saved as a PDF.',
//     })
//   }

  return (
    <nav
      className="fixed top-0 left-0 right-0  z-50 w-full h-20 flex justify-between items-center py-4 px-7 border-b"
      style={{
        backgroundColor: currentTheme.navbarColor || currentTheme.backgroundColor,
        color: currentTheme.accentColor,
      }}
    >
      <Link href={'/dashboard'} passHref>
        <Button
          variant={'outline'}
          className={`flex items-center gap-2`}
          style={{
            backgroundColor: currentTheme.backgroundColor,
          }}
        >
          <Home className="w-4 h-4" />
          <span className="hidden  sm:inline">Return Home</span>
        </Button>
      </Link>

      <Link href={'/presentation/template-market'} className="text-lg font-semibold hidden sm:block">
        {project?.title}
        {/* Presentation Editor */}
      </Link>

      <div className="flex items-center gap-4">
        <Button
          style={{
            backgroundColor: currentTheme.backgroundColor,
          }}
          onClick={handleCopy}
          variant={'outline'}
        >
          <Share2 className="w-4 h-4" />
        </Button>

        <Button
          variant={'default'}
          className="flex items-center gap-2"
          onClick={() => setIsPresentationMode(true)}
        >
          <Play className="w-4 h-4" />
          <span className="hidden sm:inline">Present</span>
        </Button>

        {/* ⬇️ Download Button */}
        <Button
          variant={'outline'}
          className="flex items-center gap-2"
        //   WIP add download feature
        //   onClick={handleDownload}
          style={{
            backgroundColor: 'white',
            color: 'black'
          }}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>

      {/* WIP  add presentaiton mode*/}
      {/* {isPresentationMode && (
        <PresentationMode onClose={() => setIsPresentationMode(false)} />
      )} */}
    </nav>
  )
}

export default Navbar

