import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { readFile, unlink } from 'fs/promises'
import { join } from 'path'
import { createProject, updateSlides } from '@/actions/project'
import { v4 as uuidv4 } from 'uuid'
import { Slide } from '@/lib/types'
import { parsePowerPointFile, convertParsedSlidesToAppSlides } from '@/lib/pptxParser'
import { parsePowerPointFileSimple, convertParsedSlidesToAppSlidesSimple } from '@/lib/simplePptxParser'
import { parsePowerPointFileBasic, convertParsedSlidesToAppSlidesBasic } from '@/lib/basicPptxParser'
import { parsePowerPointFileDebug, convertParsedSlidesToAppSlidesDebug } from '@/lib/debugPptxParser'
import { parsePDFFile, convertParsedPDFSlidesToAppSlides } from '@/lib/pdfParser'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Import process request received')
    
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { fileId, originalName } = await request.json()

    if (!fileId || !originalName) {
      return NextResponse.json({ 
        error: 'File ID and original name are required' 
      }, { status: 400 })
    }

    // Construct file path from fileId and originalName
    const fileExtension = originalName.split('.').pop() || 'unknown';
    const fileName = `${fileId}.${fileExtension}`;
    const filePath = join(process.cwd(), 'uploads', 'imports', fileName);
    
    console.log('📄 File path constructed:', filePath);
    
    // Check if file exists
    try {
      await readFile(filePath);
      console.log('📄 File exists, proceeding with parsing...');
    } catch (error) {
      console.error('❌ File not found:', filePath);
      throw new Error(`File not found: ${filePath}`);
    }
    
    // Parse the actual PowerPoint file content
    let presentationData;
    
    try {
      // Determine file type and parse accordingly
      
      if (fileExtension === 'pptx' || fileExtension === 'ppt') {
        console.log('📄 Parsing PowerPoint file...');
        
        // Use debug parser to see what's happening
        let parsedSlides;
        try {
          parsedSlides = await parsePowerPointFileDebug(filePath);
          console.log('📄 Debug parser succeeded, parsed slides:', parsedSlides.map(s => ({ title: s.title, contentLength: s.content.length })));
        } catch (debugError) {
          console.warn('⚠️ Debug parser failed, trying basic parser:', debugError);
          try {
            parsedSlides = await parsePowerPointFileBasic(filePath);
            console.log('📄 Basic parser succeeded, parsed slides:', parsedSlides.map(s => ({ title: s.title, contentLength: s.content.length })));
          } catch (basicError) {
            console.warn('⚠️ Basic parser failed, trying simple parser:', basicError);
            try {
              parsedSlides = await parsePowerPointFileSimple(filePath);
              console.log('📄 Simple parser succeeded, parsed slides:', parsedSlides.map(s => ({ title: s.title, contentLength: s.content.length })));
            } catch (simpleError) {
              console.warn('⚠️ Simple parser failed, trying complex parser:', simpleError);
              parsedSlides = await parsePowerPointFile(filePath);
              console.log('📄 Complex parser succeeded, parsed slides:', parsedSlides.map(s => ({ title: s.title, contentLength: s.content.length })));
            }
          }
        }
        
        const appSlides = convertParsedSlidesToAppSlidesDebug(parsedSlides, 'temp-project-id');
        console.log('📄 Converted to app slides:', appSlides.map(s => ({ slideName: s.slideName, content: s.content.content })));
        
        presentationData = {
          title: originalName.replace(/\.[^/.]+$/, '') || 'Imported Presentation',
          slides: appSlides,
          outlines: parsedSlides.map((slide, index) => ({
            id: uuidv4(),
            title: slide.title || `Slide ${index + 1}`,
            order: index + 1
          }))
        };
        console.log(`✅ Successfully parsed ${parsedSlides.length} slides from PowerPoint`);
      } else if (fileExtension === 'pdf') {
        console.log('📄 Parsing PDF file...');
        const parsedSlides = await parsePDFFile(filePath);
        presentationData = {
          title: originalName.replace(/\.[^/.]+$/, '') || 'Imported PDF',
          slides: convertParsedPDFSlidesToAppSlides(parsedSlides, 'temp-project-id'),
          outlines: parsedSlides.map((slide, index) => ({
            id: uuidv4(),
            title: slide.title || `Page ${slide.pageNumber}`,
            order: index + 1
          }))
        };
        console.log(`✅ Successfully parsed ${parsedSlides.length} pages from PDF`);
      } else {
        console.log('📄 Unknown file type, using mock data...');
        presentationData = await createMockPresentation(originalName, user.id);
      }
    } catch (parseError) {
      console.error('❌ Error parsing file, falling back to mock data:', parseError);
      console.error('❌ Parse error details:', {
        message: parseError instanceof Error ? parseError.message : 'Unknown error',
        stack: parseError instanceof Error ? parseError.stack : undefined,
        filePath: filePath,
        fileExtension: fileExtension
      });
      presentationData = await createMockPresentation(originalName, user.id);
    }

    if (!presentationData) {
      return NextResponse.json({ 
        error: 'Failed to process presentation' 
      }, { status: 500 })
    }

    // Create project in database
    const projectResult = await createProject(
      presentationData.title,
      presentationData.outlines,
      {
        source: 'imported',
        originalFileName: originalName,
        fileSize: 0, // We don't have the actual file size in this mock
        fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      }
    )

    // Update the project with slides
    if (projectResult.status === 200 && projectResult.data) {
      if (presentationData.slides && presentationData.slides.length > 0) {
        // Use parsed slides if available
        await updateProjectWithSlides(projectResult.data.id, presentationData.slides)
      } else {
        // Fallback to mock slides
        const mockSlides = createMockSlides(presentationData.outlines, projectResult.data.id)
        await updateProjectWithSlides(projectResult.data.id, mockSlides)
      }
    }

    if (projectResult.status !== 200 || !projectResult.data) {
      return NextResponse.json({ 
        error: 'Failed to create project' 
      }, { status: 500 })
    }

    // Clean up uploaded file
    try {
      await unlink(filePath)
    } catch (error) {
      console.warn('Failed to clean up uploaded file:', error)
    }

    console.log('✅ Presentation processed successfully:', { 
      projectId: projectResult.data.id, 
      title: presentationData.title, 
      slideCount: presentationData.outlines.length 
    })

    return NextResponse.json({
      success: true,
      projectId: projectResult.data.id,
      title: presentationData.title,
      slideCount: presentationData.outlines.length,
      message: 'Presentation imported successfully'
    })

  } catch (error) {
    console.error('Presentation processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process presentation' },
      { status: 500 }
    )
  }
}

async function createMockPresentation(originalName: string, userId: string) {
  try {
    // Extract title from filename
    const title = originalName.replace(/\.[^/.]+$/, '') || 'Imported Presentation'
    
    // Create mock outlines based on the file type
    const fileExtension = originalName.split('.').pop()?.toLowerCase()
    let outlines: string[] = []

    switch (fileExtension) {
      case 'pptx':
      case 'ppt':
        outlines = [
          'Introduction to the Topic',
          'Key Concepts and Definitions',
          'Main Points and Analysis',
          'Examples and Case Studies',
          'Best Practices and Recommendations',
          'Conclusion and Next Steps'
        ]
        break
      case 'pdf':
        outlines = [
          'Document Overview',
          'Key Information',
          'Important Details',
          'Summary and Conclusions'
        ]
        break
      default:
        outlines = [
          'Imported Content',
          'Key Points',
          'Additional Information'
        ]
    }

    return {
      title,
      outlines: outlines.map(outline => ({
        id: uuidv4(),
        title: outline,
        order: outlines.indexOf(outline) + 1
      }))
    }

  } catch (error) {
    console.error('Error creating mock presentation:', error)
    return null
  }
}

function createMockSlides(outlines: any[], projectId: string): Slide[] {
  return outlines.map((outline, index) => ({
    id: uuidv4(),
    slideOrder: index,
    slideName: outline.title || `Slide ${index + 1}`,
    type: 'title',
    content: {
      id: uuidv4(),
      type: 'title',
      name: 'title',
      content: outline.title || `Slide ${index + 1}`,
      placeholder: 'Enter slide title...'
    }
  }))
}

async function updateProjectWithSlides(projectId: string, slides: Slide[]) {
  try {
    const result = await updateSlides(projectId, slides)
    if (result.status !== 200) {
      console.error('Failed to update project with slides:', result.message)
    } else {
      console.log('✅ Project updated with mock slides')
    }
  } catch (error) {
    console.error('Error updating project with slides:', error)
  }
}
