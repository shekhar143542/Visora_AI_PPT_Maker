import { NextRequest, NextResponse } from 'next/server'
import PptxGenJS from 'pptxgenjs'
import { currentUser } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Starting PowerPoint generation...')
    
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slides, project, theme } = await request.json()
    console.log('📊 PowerPoint generation data:', { 
      slidesCount: slides?.length, 
      projectTitle: project?.title,
      themeName: theme?.name 
    })

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json({ error: 'No slides provided' }, { status: 400 })
    }

    // Create new presentation
    const pptx = new PptxGenJS()

    // Set presentation properties
    pptx.author = user.firstName || 'User'
    pptx.company = 'Visora'
    pptx.title = project?.title || 'Untitled Presentation'
    pptx.subject = 'AI Generated Presentation'

    // Set theme colors if available
    if (theme) {
      pptx.defineSlideMaster({
        title: 'MASTER_SLIDE',
        background: { color: theme.backgroundColor || '#FFFFFF' },
        objects: [
          {
            placeholder: {
              options: {
                name: 'title',
                type: 'title',
                x: 0.5,
                y: 0.5,
                w: 9,
                h: 1,
                fontSize: 24,
                color: theme.fontColor || '#000000',
                fontFace: theme.fontFamily || 'Arial',
              },
            },
          },
        ],
      })
    }

    // Process each slide
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]
      console.log(`📄 Processing slide ${i + 1}/${slides.length}:`, slide.slideName || `Slide ${i + 1}`)
      const pptxSlide = pptx.addSlide()

        // Apply theme background
        if (theme?.gradientBackground) {
          // For now, use solid background color instead of gradient
          // PowerPoint gradients are complex to implement
          pptxSlide.background = { color: theme.backgroundColor || '#ffffff' }
        } else if (theme?.backgroundColor) {
          pptxSlide.background = { color: theme.backgroundColor }
        }

      // Process slide content
      await processSlideContent(pptxSlide, slide, theme)
    }

    // Generate the PowerPoint file
    console.log('🔄 Generating PowerPoint buffer...')
    const buffer = await pptx.write('nodebuffer')
    console.log('✅ PowerPoint generation completed, buffer size:', buffer.length)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${project?.title || 'presentation'}.pptx"`,
      },
    })

  } catch (error) {
    console.error('❌ PowerPoint generation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate PowerPoint file',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

async function processSlideContent(pptxSlide: any, slide: any, theme: any) {
  try {
    // Process slide content recursively
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
        x: x * 0.5,
        y: y * 0.5,
        w: w * 0.5,
        h: 1,
        fontSize: 24,
        fontFace: fontFamily,
        color: fontColor,
        bold: true,
        align: 'center',
      })
      break

    case 'heading1':
      pptxSlide.addText(content.content || content.placeholder || 'Heading 1', {
        x: x * 0.5,
        y: y * 0.5,
        w: w * 0.5,
        h: 0.8,
        fontSize: 20,
        fontFace: fontFamily,
        color: fontColor,
        bold: true,
      })
      break

    case 'heading2':
      pptxSlide.addText(content.content || content.placeholder || 'Heading 2', {
        x: x * 0.5,
        y: y * 0.5,
        w: w * 0.5,
        h: 0.7,
        fontSize: 18,
        fontFace: fontFamily,
        color: fontColor,
        bold: true,
      })
      break

    case 'heading3':
      pptxSlide.addText(content.content || content.placeholder || 'Heading 3', {
        x: x * 0.5,
        y: y * 0.5,
        w: w * 0.5,
        h: 0.6,
        fontSize: 16,
        fontFace: fontFamily,
        color: fontColor,
        bold: true,
      })
      break

    case 'paragraph':
      pptxSlide.addText(content.content || content.placeholder || 'Paragraph text', {
        x: x * 0.5,
        y: y * 0.5,
        w: w * 0.5,
        h: 1.5,
        fontSize: fontSize,
        fontFace: fontFamily,
        color: fontColor,
        align: 'left',
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
              x: x * 0.5,
              y: y * 0.5,
              w: w * 0.5,
              h: h * 0.5,
              fontSize: fontSize,
              fontFace: fontFamily,
              color: fontColor,
              align: 'center',
            })
          } else {
            pptxSlide.addImage({
              data: imageData,
              x: x * 0.5,
              y: y * 0.5,
              w: w * 0.5,
              h: h * 0.5,
            })
          }
        } catch (error) {
          console.error('Error adding image:', error)
          // Add placeholder text if image fails
          pptxSlide.addText('Image placeholder', {
            x: x * 0.5,
            y: y * 0.5,
            w: w * 0.5,
            h: h * 0.5,
            fontSize: fontSize,
            fontFace: fontFamily,
            color: fontColor,
            align: 'center',
          })
        }
      }
      break

    case 'column':
    case 'resizable-column':
      if (Array.isArray(content.content)) {
        const itemHeight = h / content.content.length
        content.content.forEach((item: any, index: number) => {
          processContentItem(
            pptxSlide,
            item,
            theme,
            x,
            y + (index * itemHeight),
            w,
            itemHeight
          )
        })
      }
      break

    case 'bulletList':
      if (Array.isArray(content.content)) {
        const bulletText = content.content
          .map((item: any) => `• ${item.text || item}`)
          .join('\n')
        pptxSlide.addText(bulletText, {
          x: x * 0.5,
          y: y * 0.5,
          w: w * 0.5,
          h: 2,
          fontSize: fontSize,
          fontFace: fontFamily,
          color: fontColor,
          align: 'left',
        })
      }
      break

    case 'numberedList':
      if (Array.isArray(content.content)) {
        const numberedText = content.content
          .map((item: any, index: number) => `${index + 1}. ${item.text || item}`)
          .join('\n')
        pptxSlide.addText(numberedText, {
          x: x * 0.5,
          y: y * 0.5,
          w: w * 0.5,
          h: 2,
          fontSize: fontSize,
          fontFace: fontFamily,
          color: fontColor,
          align: 'left',
        })
      }
      break

    default:
      // Handle unknown content types
      if (content.content) {
        pptxSlide.addText(String(content.content), {
          x: x * 0.5,
          y: y * 0.5,
          w: w * 0.5,
          h: 1,
          fontSize: fontSize,
          fontFace: fontFamily,
          color: fontColor,
        })
      }
      break
  }
}
