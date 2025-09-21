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

    // Generate interactive HTML presentation
    const html = generateInteractiveHTML(slides, project, theme)

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${project?.title || 'presentation'}.html"`,
      },
    })

  } catch (error) {
    console.error('HTML generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate HTML presentation' },
      { status: 500 }
    )
  }
}

function generateInteractiveHTML(slides: any[], project: any, theme: any) {
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
            overflow: hidden;
        }
        
        .presentation-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .slide {
            width: 90vw;
            height: 90vh;
            padding: 3rem;
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .slide.active {
            display: flex;
        }
        
        .slide-title {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 2rem;
            color: ${accentColor};
        }
        
        .slide-content {
            max-width: 1000px;
            width: 100%;
        }
        
        .content-item {
            margin-bottom: 1.5rem;
        }
        
        .content-item:last-child {
            margin-bottom: 0;
        }
        
        h1 {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 1.5rem;
            color: ${accentColor};
        }
        
        h2 {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 1.2rem;
            color: ${accentColor};
        }
        
        h3 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
            color: ${accentColor};
        }
        
        p {
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
            text-align: left;
        }
        
        .image-container {
            margin: 2rem 0;
            text-align: center;
        }
        
        .image-container img {
            max-width: 100%;
            height: auto;
            max-height: 500px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .bullet-list, .numbered-list {
            text-align: left;
            margin: 1.5rem 0;
        }
        
        .bullet-list li, .numbered-list li {
            margin-bottom: 0.8rem;
            font-size: 1.2rem;
        }
        
        .two-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin: 1.5rem 0;
        }
        
        .three-columns {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 1.5rem;
            margin: 1.5rem 0;
        }
        
        .slide-number {
            position: absolute;
            bottom: 1rem;
            right: 1rem;
            font-size: 1rem;
            color: ${fontColor}80;
        }
        
        .navigation {
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 1rem;
            z-index: 1000;
        }
        
        .nav-button {
            padding: 0.75rem 1.5rem;
            background-color: ${accentColor};
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .nav-button:hover {
            background-color: ${accentColor}dd;
            transform: translateY(-2px);
        }
        
        .nav-button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        
        .slide-indicators {
            position: fixed;
            top: 2rem;
            right: 2rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            z-index: 1000;
        }
        
        .indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: ${fontColor}40;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .indicator.active {
            background-color: ${accentColor};
        }
        
        .indicator:hover {
            background-color: ${accentColor}80;
        }
        
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            height: 4px;
            background-color: ${accentColor};
            transition: width 0.3s ease;
            z-index: 1000;
        }
        
        /* Gradient background support */
        .gradient-bg {
            background: ${theme?.gradientBackground || backgroundColor};
        }
        
        @media (max-width: 768px) {
            .slide {
                width: 95vw;
                height: 95vh;
                padding: 2rem;
            }
            
            .slide-title {
                font-size: 2rem;
            }
            
            h1 {
                font-size: 1.8rem;
            }
            
            h2 {
                font-size: 1.5rem;
            }
            
            p {
                font-size: 1rem;
            }
            
            .two-columns, .three-columns {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="progress-bar" id="progressBar"></div>
    
    <div class="presentation-container">
        ${slides.map((slide, index) => generateSlideHTML(slide, index + 1, theme)).join('')}
    </div>
    
    <div class="slide-indicators" id="slideIndicators">
        ${slides.map((_, index) => `
            <div class="indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>
        `).join('')}
    </div>
    
    <div class="navigation">
        <button class="nav-button" id="prevBtn" onclick="previousSlide()">Previous</button>
        <button class="nav-button" id="nextBtn" onclick="nextSlide()">Next</button>
    </div>

    <script>
        let currentSlide = 0;
        const totalSlides = ${slides.length};
        
        function showSlide(index) {
            // Hide all slides
            const slides = document.querySelectorAll('.slide');
            slides.forEach(slide => slide.classList.remove('active'));
            
            // Show current slide
            if (slides[index]) {
                slides[index].classList.add('active');
            }
            
            // Update indicators
            const indicators = document.querySelectorAll('.indicator');
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
            
            // Update navigation buttons
            document.getElementById('prevBtn').disabled = index === 0;
            document.getElementById('nextBtn').disabled = index === totalSlides - 1;
            
            // Update progress bar
            const progress = ((index + 1) / totalSlides) * 100;
            document.getElementById('progressBar').style.width = progress + '%';
        }
        
        function nextSlide() {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                showSlide(currentSlide);
            }
        }
        
        function previousSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                showSlide(currentSlide);
            }
        }
        
        function goToSlide(index) {
            currentSlide = index;
            showSlide(currentSlide);
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                previousSlide();
            }
        });
        
        // Touch/swipe support
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', function(e) {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 50) {
                    nextSlide();
                } else if (diffX < -50) {
                    previousSlide();
                }
            }
            
            startX = 0;
            startY = 0;
        });
        
        // Initialize presentation
        showSlide(0);
    </script>
</body>
</html>
  `
}

function generateSlideHTML(slide: any, slideNumber: number, theme: any) {
  const slideTitle = slide.slideName || `Slide ${slideNumber}`
  
  return `
    <div class="slide ${theme?.gradientBackground ? 'gradient-bg' : ''}">
      <div class="slide-content">
        <h1 class="slide-title">${slideTitle}</h1>
        <div class="slide-body">
          ${processSlideContent(slide.content, theme)}
        </div>
      </div>
      <div class="slide-number">${slideNumber} / ${slideNumber}</div>
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
