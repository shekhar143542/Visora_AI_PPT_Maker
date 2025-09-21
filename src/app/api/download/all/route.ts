import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import JSZip from 'jszip'
import PptxGenJS from 'pptxgenjs'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slides, project, theme } = await request.json()

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json({ error: 'No slides provided' }, { status: 400 })
    }

    // Create a ZIP file containing all formats
    const zip = new JSZip()

    // Generate PowerPoint file
    try {
      const pptx = new PptxGenJS()
      pptx.author = user.firstName || 'User'
      pptx.company = 'Visora'
      pptx.title = project?.title || 'Untitled Presentation'
      pptx.subject = 'AI Generated Presentation'

      // Process each slide
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i]
        const pptxSlide = pptx.addSlide()

        // Apply theme background
        if (theme?.gradientBackground) {
          // For now, use solid background color instead of gradient
          pptxSlide.background = { color: theme.backgroundColor || '#ffffff' }
        } else if (theme?.backgroundColor) {
          pptxSlide.background = { color: theme.backgroundColor }
        }

        // Process slide content
        await processSlideContent(pptxSlide, slide, theme)
      }

      const pptxBuffer = await pptx.write('nodebuffer')
      zip.file(`${project?.title || 'presentation'}.pptx`, pptxBuffer)
    } catch (error) {
      console.error('PowerPoint generation error:', error)
    }

    // Generate PDF HTML
    try {
      const pdfHTML = generatePresentationHTML(slides, project, theme)
      zip.file(`${project?.title || 'presentation'}.html`, pdfHTML)
    } catch (error) {
      console.error('PDF HTML generation error:', error)
    }

    // Generate interactive HTML
    try {
      const interactiveHTML = generateInteractiveHTML(slides, project, theme)
      zip.file(`${project?.title || 'presentation'}-interactive.html`, interactiveHTML)
    } catch (error) {
      console.error('Interactive HTML generation error:', error)
    }

    // Generate individual slide HTML files
    try {
      const slidesFolder = zip.folder('slides')
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i]
        const slideHTML = generateSlideImageHTML(slide, i + 1, theme)
        slidesFolder?.file(`slide-${i + 1}.html`, slideHTML)
      }
    } catch (error) {
      console.error('Slide HTML generation error:', error)
    }

    // Generate the ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${project?.title || 'presentation'}-all-formats.zip"`,
      },
    })

  } catch (error) {
    console.error('Bulk download error:', error)
    return NextResponse.json(
      { error: 'Failed to generate bulk download' },
      { status: 500 }
    )
  }
}

// Helper functions (reused from other endpoints)
function generatePresentationHTML(slides: any[], project: any, theme: any) {
  const backgroundColor = theme?.backgroundColor || '#ffffff'
  const fontColor = theme?.fontColor || '#000000'
  const fontFamily = theme?.fontFamily || 'Arial, sans-serif'
  const accentColor = theme?.accentColor || '#3b82f6'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project?.title || 'Presentation'}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: ${fontFamily}; background-color: ${backgroundColor}; color: ${fontColor}; line-height: 1.6; }
        .slide { width: 100%; min-height: 100vh; padding: 2rem; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; page-break-after: always; }
        .slide:last-child { page-break-after: avoid; }
        .slide-title { font-size: 2.5rem; font-weight: bold; margin-bottom: 2rem; color: ${accentColor}; }
        .slide-content { max-width: 800px; width: 100%; }
        h1 { font-size: 2rem; font-weight: bold; margin-bottom: 1rem; color: ${accentColor}; }
        h2 { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.8rem; color: ${accentColor}; }
        h3 { font-size: 1.25rem; font-weight: bold; margin-bottom: 0.6rem; color: ${accentColor}; }
        p { font-size: 1rem; margin-bottom: 1rem; text-align: left; }
        .image-container { margin: 1rem 0; text-align: center; }
        .image-container img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .bullet-list, .numbered-list { text-align: left; margin: 1rem 0; }
        .bullet-list li, .numbered-list li { margin-bottom: 0.5rem; font-size: 1rem; }
        .two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 1rem 0; }
        .three-columns { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; margin: 1rem 0; }
        .slide-number { position: absolute; bottom: 1rem; right: 1rem; font-size: 0.875rem; color: ${fontColor}80; }
        @media print { .slide { page-break-after: always; } .slide:last-child { page-break-after: avoid; } }
    </style>
</head>
<body>
    <div class="presentation">
        ${slides.map((slide, index) => generateSlideHTML(slide, index + 1, theme)).join('')}
    </div>
</body>
</html>
  `
}

function generateInteractiveHTML(slides: any[], project: any, theme: any) {
  // This would be the same as the HTML endpoint but with navigation
  return generatePresentationHTML(slides, project, theme)
}

function generateSlideImageHTML(slide: any, slideNumber: number, theme: any) {
  const backgroundColor = theme?.backgroundColor || '#ffffff'
  const fontColor = theme?.fontColor || '#000000'
  const fontFamily = theme?.fontFamily || 'Arial, sans-serif'
  const accentColor = theme?.accentColor || '#3b82f6'
  const slideTitle = slide.slideName || `Slide ${slideNumber}`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${slideTitle}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: ${fontFamily}; background-color: ${backgroundColor}; color: ${fontColor}; line-height: 1.6; width: 1920px; height: 1080px; overflow: hidden; }
        .slide { width: 100%; height: 100vh; padding: 4rem; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; position: relative; }
        .slide-title { font-size: 4rem; font-weight: bold; margin-bottom: 3rem; color: ${accentColor}; }
        .slide-content { max-width: 1400px; width: 100%; }
        h1 { font-size: 3rem; font-weight: bold; margin-bottom: 1.5rem; color: ${accentColor}; }
        h2 { font-size: 2.5rem; font-weight: bold; margin-bottom: 1.2rem; color: ${accentColor}; }
        h3 { font-size: 2rem; font-weight: bold; margin-bottom: 1rem; color: ${accentColor}; }
        p { font-size: 1.5rem; margin-bottom: 1.5rem; text-align: left; }
        .image-container { margin: 2rem 0; text-align: center; }
        .image-container img { max-width: 100%; height: auto; max-height: 600px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); }
        .bullet-list, .numbered-list { text-align: left; margin: 2rem 0; }
        .bullet-list li, .numbered-list li { margin-bottom: 1rem; font-size: 1.5rem; }
        .two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin: 2rem 0; }
        .three-columns { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2rem; margin: 2rem 0; }
        .slide-number { position: absolute; bottom: 2rem; right: 2rem; font-size: 1.5rem; color: ${fontColor}80; }
        .gradient-bg { background: ${theme?.gradientBackground || backgroundColor}; }
    </style>
</head>
<body>
    <div class="slide ${theme?.gradientBackground ? 'gradient-bg' : ''}">
      <div class="slide-content">
        <h1 class="slide-title">${slideTitle}</h1>
        <div class="slide-body">
          ${processSlideContentHTML(slide.content, theme)}
        </div>
      </div>
      <div class="slide-number">${slideNumber}</div>
    </div>
</body>
</html>
  `
}

function generateSlideHTML(slide: any, slideNumber: number, theme: any) {
  const slideTitle = slide.slideName || `Slide ${slideNumber}`
  
  return `
    <div class="slide">
      <div class="slide-content">
        <h1 class="slide-title">${slideTitle}</h1>
        <div class="slide-body">
          ${processSlideContentHTML(slide.content, theme)}
        </div>
      </div>
      <div class="slide-number">${slideNumber}</div>
    </div>
  `
}

function processSlideContentHTML(content: any, theme: any): string {
  if (!content) return ''

  switch (content.type) {
    case 'title':
      return `<h1>${content.content || content.placeholder || 'Untitled'}</h1>`
    case 'heading1':
      return `<h1>${content.content || content.placeholder || 'Heading 1'}</h1>`
    case 'heading2':
      return `<h2>${content.content || content.placeholder || 'Heading 2'}</h2>`
    case 'heading3':
      return `<h3>${content.content || content.placeholder || 'Heading 3'}</h3>`
    case 'paragraph':
      return `<p>${content.content || content.placeholder || 'Paragraph text'}</p>`
    case 'image':
      if (content.content && content.content !== '') {
        return `<div class="image-container"><img src="${content.content}" alt="${content.alt || 'Slide image'}" /></div>`
      }
      return ''
    case 'bulletList':
      if (Array.isArray(content.content)) {
        const items = content.content.map((item: any) => `<li>${item.text || item}</li>`).join('')
        return `<ul class="bullet-list">${items}</ul>`
      }
      return ''
    case 'numberedList':
      if (Array.isArray(content.content)) {
        const items = content.content.map((item: any) => `<li>${item.text || item}</li>`).join('')
        return `<ol class="numbered-list">${items}</ol>`
      }
      return ''
    case 'column':
    case 'resizable-column':
      if (Array.isArray(content.content)) {
        const columnClass = content.content.length === 2 ? 'two-columns' : 
                           content.content.length === 3 ? 'three-columns' : ''
        const items = content.content.map((item: any) => 
          `<div class="content-item">${processSlideContentHTML(item, theme)}</div>`
        ).join('')
        return `<div class="${columnClass}">${items}</div>`
      }
      return ''
    default:
      if (content.content) {
        return `<p>${String(content.content)}</p>`
      }
      return ''
  }
}

async function processSlideContent(pptxSlide: any, slide: any, theme: any) {
  try {
    if (slide.content && typeof slide.content === 'object') {
      await processContentItem(pptxSlide, slide.content, theme, 0, 0, 10, 7.5)
    }
  } catch (error) {
    console.error('Error processing slide content:', error)
  }
}

async function processContentItem(
  pptxSlide: any,
  content: any,
  theme: any,
  x: number,
  y: number,
  w: number,
  h: number
) {
  if (!content) return

  const fontSize = theme?.fontSize || 14
  const fontColor = theme?.fontColor || '#000000'
  const fontFamily = theme?.fontFamily || 'Arial'

  switch (content.type) {
    case 'title':
      pptxSlide.addText(content.content || content.placeholder || 'Untitled', {
        x: x * 0.5, y: y * 0.5, w: w * 0.5, h: 1,
        fontSize: 24, fontFace: fontFamily, color: fontColor, bold: true, align: 'center',
      })
      break
    case 'heading1':
      pptxSlide.addText(content.content || content.placeholder || 'Heading 1', {
        x: x * 0.5, y: y * 0.5, w: w * 0.5, h: 0.8,
        fontSize: 20, fontFace: fontFamily, color: fontColor, bold: true,
      })
      break
    case 'heading2':
      pptxSlide.addText(content.content || content.placeholder || 'Heading 2', {
        x: x * 0.5, y: y * 0.5, w: w * 0.5, h: 0.7,
        fontSize: 18, fontFace: fontFamily, color: fontColor, bold: true,
      })
      break
    case 'heading3':
      pptxSlide.addText(content.content || content.placeholder || 'Heading 3', {
        x: x * 0.5, y: y * 0.5, w: w * 0.5, h: 0.6,
        fontSize: 16, fontFace: fontFamily, color: fontColor, bold: true,
      })
      break
    case 'paragraph':
      pptxSlide.addText(content.content || content.placeholder || 'Paragraph text', {
        x: x * 0.5, y: y * 0.5, w: w * 0.5, h: 1.5,
        fontSize: fontSize, fontFace: fontFamily, color: fontColor, align: 'left',
      })
      break
    case 'image':
      if (content.content && content.content !== '') {
        try {
          // Ensure the image has proper base64 header
          let imageData = content.content
          if (!imageData.startsWith('data:')) {
            // If it's a URL, we'll skip it for now as PptxGenJS needs base64
            console.warn('Skipping image URL, base64 required for PowerPoint')
            pptxSlide.addText('Image placeholder', {
              x: x * 0.5, y: y * 0.5, w: w * 0.5, h: h * 0.5,
              fontSize: fontSize, fontFace: fontFamily, color: fontColor, align: 'center',
            })
          } else {
            pptxSlide.addImage({
              data: imageData, x: x * 0.5, y: y * 0.5, w: w * 0.5, h: h * 0.5,
            })
          }
        } catch (error) {
          console.error('Error adding image:', error)
          pptxSlide.addText('Image placeholder', {
            x: x * 0.5, y: y * 0.5, w: w * 0.5, h: h * 0.5,
            fontSize: fontSize, fontFace: fontFamily, color: fontColor, align: 'center',
          })
        }
      }
      break
    case 'column':
    case 'resizable-column':
      if (Array.isArray(content.content)) {
        const itemHeight = h / content.content.length
        content.content.forEach((item: any, index: number) => {
          processContentItem(pptxSlide, item, theme, x, y + (index * itemHeight), w, itemHeight)
        })
      }
      break
    case 'bulletList':
      if (Array.isArray(content.content)) {
        const bulletText = content.content.map((item: any) => `• ${item.text || item}`).join('\n')
        pptxSlide.addText(bulletText, {
          x: x * 0.5, y: y * 0.5, w: w * 0.5, h: 2,
          fontSize: fontSize, fontFace: fontFamily, color: fontColor, align: 'left',
        })
      }
      break
    case 'numberedList':
      if (Array.isArray(content.content)) {
        const numberedText = content.content.map((item: any, index: number) => `${index + 1}. ${item.text || item}`).join('\n')
        pptxSlide.addText(numberedText, {
          x: x * 0.5, y: y * 0.5, w: w * 0.5, h: 2,
          fontSize: fontSize, fontFace: fontFamily, color: fontColor, align: 'left',
        })
      }
      break
    default:
      if (content.content) {
        pptxSlide.addText(String(content.content), {
          x: x * 0.5, y: y * 0.5, w: w * 0.5, h: 1,
          fontSize: fontSize, fontFace: fontFamily, color: fontColor,
        })
      }
      break
  }
}
