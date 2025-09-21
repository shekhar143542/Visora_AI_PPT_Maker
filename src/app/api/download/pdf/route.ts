import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'

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

    // Generate HTML for PDF conversion
    const html = generatePresentationHTML(slides, project, theme)

    // For now, we'll return the HTML and let the client handle PDF generation
    // In a production environment, you might want to use Puppeteer server-side
    return NextResponse.json({
      html,
      title: project?.title || 'presentation',
      slides: slides.length,
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

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
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${fontFamily};
            background-color: ${backgroundColor};
            color: ${fontColor};
            line-height: 1.6;
        }
        
        .presentation {
            max-width: 100%;
            margin: 0 auto;
        }
        
        .slide {
            width: 100%;
            min-height: 100vh;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            page-break-after: always;
            position: relative;
        }
        
        .slide:last-child {
            page-break-after: avoid;
        }
        
        .slide-title {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 2rem;
            color: ${accentColor};
        }
        
        .slide-content {
            max-width: 800px;
            width: 100%;
        }
        
        .content-item {
            margin-bottom: 1.5rem;
        }
        
        .content-item:last-child {
            margin-bottom: 0;
        }
        
        h1 {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 1rem;
            color: ${accentColor};
        }
        
        h2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 0.8rem;
            color: ${accentColor};
        }
        
        h3 {
            font-size: 1.25rem;
            font-weight: bold;
            margin-bottom: 0.6rem;
            color: ${accentColor};
        }
        
        p {
            font-size: 1rem;
            margin-bottom: 1rem;
            text-align: left;
        }
        
        .image-container {
            margin: 1rem 0;
            text-align: center;
        }
        
        .image-container img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .bullet-list, .numbered-list {
            text-align: left;
            margin: 1rem 0;
        }
        
        .bullet-list li, .numbered-list li {
            margin-bottom: 0.5rem;
            font-size: 1rem;
        }
        
        .two-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin: 1rem 0;
        }
        
        .three-columns {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 1.5rem;
            margin: 1rem 0;
        }
        
        .slide-number {
            position: absolute;
            bottom: 1rem;
            right: 1rem;
            font-size: 0.875rem;
            color: ${fontColor}80;
        }
        
        @media print {
            .slide {
                page-break-after: always;
            }
            
            .slide:last-child {
                page-break-after: avoid;
            }
        }
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

function generateSlideHTML(slide: any, slideNumber: number, theme: any) {
  const slideTitle = slide.slideName || `Slide ${slideNumber}`
  
  return `
    <div class="slide">
      <div class="slide-content">
        <h1 class="slide-title">${slideTitle}</h1>
        <div class="slide-body">
          ${processSlideContent(slide.content, theme)}
        </div>
      </div>
      <div class="slide-number">${slideNumber}</div>
    </div>
  `
}

function processSlideContent(content: any, theme: any): string {
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
        return `
          <div class="image-container">
            <img src="${content.content}" alt="${content.alt || 'Slide image'}" />
          </div>
        `
      }
      return ''
    
    case 'bulletList':
      if (Array.isArray(content.content)) {
        const items = content.content.map((item: any) => 
          `<li>${item.text || item}</li>`
        ).join('')
        return `<ul class="bullet-list">${items}</ul>`
      }
      return ''
    
    case 'numberedList':
      if (Array.isArray(content.content)) {
        const items = content.content.map((item: any) => 
          `<li>${item.text || item}</li>`
        ).join('')
        return `<ol class="numbered-list">${items}</ol>`
      }
      return ''
    
    case 'column':
    case 'resizable-column':
      if (Array.isArray(content.content)) {
        const columnClass = content.content.length === 2 ? 'two-columns' : 
                           content.content.length === 3 ? 'three-columns' : ''
        
        const items = content.content.map((item: any) => 
          `<div class="content-item">${processSlideContent(item, theme)}</div>`
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
