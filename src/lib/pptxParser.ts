import { DOMParser } from '@xmldom/xmldom';
import JSZip from 'jszip';
import { Slide } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export interface ParsedSlide {
  title: string;
  content: string;
  images: string[];
}

export async function parsePowerPointFile(filePath: string): Promise<ParsedSlide[]> {
  try {
    console.log('📄 Starting PowerPoint parsing for:', filePath);
    
    // Read the file
    const fs = await import('fs/promises');
    const fileBuffer = await fs.readFile(filePath);
    
    // Parse the ZIP file
    const zip = await JSZip.loadAsync(fileBuffer);
    
    // Get the presentation XML
    const presentationXml = await zip.file('ppt/presentation.xml')?.async('string');
    if (!presentationXml) {
      throw new Error('Could not find presentation.xml in PowerPoint file');
    }
    
    console.log('📄 Presentation XML found, parsing...');
    
    // Parse the XML
    const parser = new DOMParser();
    const presentationDoc = parser.parseFromString(presentationXml, 'text/xml');
    
    // Get slide references - try different possible tag names
    let slideRefs = presentationDoc.getElementsByTagName('p:sldId');
    if (slideRefs.length === 0) {
      slideRefs = presentationDoc.getElementsByTagName('sldId');
    }
    if (slideRefs.length === 0) {
      slideRefs = presentationDoc.getElementsByTagName('a:sldId');
    }
    
    console.log(`📄 Found ${slideRefs.length} slide references`);
    
    const slides: ParsedSlide[] = [];
    
    for (let i = 0; i < slideRefs.length; i++) {
      const slideRef = slideRefs[i];
      const slideId = slideRef.getAttribute('r:id') || slideRef.getAttribute('id');
      
      console.log(`📄 Processing slide ${i + 1}, ID: ${slideId}`);
      
      if (slideId) {
        try {
          // Try different possible slide file paths
          let slideXml = await zip.file(`ppt/slides/slide${i + 1}.xml`)?.async('string');
          if (!slideXml) {
            slideXml = await zip.file(`ppt/slides/slide${slideId}.xml`)?.async('string');
          }
          if (!slideXml) {
            // List all files in ppt/slides to debug
            const slideFiles = Object.keys(zip.files).filter(name => name.startsWith('ppt/slides/'));
            console.log('📄 Available slide files:', slideFiles);
            slideXml = await zip.file(slideFiles[i])?.async('string');
          }
          
          if (slideXml) {
            console.log(`📄 Parsing slide ${i + 1} XML...`);
            const slideDoc = parser.parseFromString(slideXml, 'text/xml');
            const slide = await parseSlide(slideDoc, zip, i + 1);
            slides.push(slide);
            console.log(`✅ Slide ${i + 1} parsed:`, slide.title);
          } else {
            console.warn(`❌ Could not find slide ${i + 1} file`);
            slides.push({
              title: `Slide ${i + 1}`,
              content: 'Slide file not found',
              images: []
            });
          }
        } catch (error) {
          console.warn(`❌ Failed to parse slide ${i + 1}:`, error);
          // Add a placeholder slide
          slides.push({
            title: `Slide ${i + 1}`,
            content: 'Content could not be parsed',
            images: []
          });
        }
      }
    }
    
    console.log(`✅ Successfully parsed ${slides.length} slides`);
    
    // If no slides were parsed, create a fallback slide
    if (slides.length === 0) {
      console.log('⚠️ No slides parsed, creating fallback slide');
      slides.push({
        title: 'Imported Presentation',
        content: 'This presentation was imported but the content could not be parsed. You can edit this slide to add your content.',
        images: []
      });
    }
    
    return slides;
    
  } catch (error) {
    console.error('❌ Error parsing PowerPoint file:', error);
    console.error('❌ PowerPoint parsing error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      filePath: filePath
    });
    
    // Return a fallback slide instead of throwing
    console.log('🔄 Creating fallback slide due to parsing error');
    return [{
      title: 'Imported Presentation',
      content: 'This presentation was imported but encountered an error during parsing. You can edit this slide to add your content.',
      images: []
    }];
  }
}

async function parseSlide(slideDoc: Document, zip: JSZip, slideNumber: number): Promise<ParsedSlide> {
  console.log(`📄 Parsing slide ${slideNumber} content...`);
  
  // Try to find title in different possible locations
  let title = extractTextFromElement(slideDoc, 'a:t') || 
              extractTextFromElement(slideDoc, 'p:txBody') ||
              extractTextFromElement(slideDoc, 'a:txBody') ||
              `Slide ${slideNumber}`;
  
  // Extract all text content
  const content = extractAllText(slideDoc);
  
  // Extract images
  const images = await extractImages(slideDoc, zip);
  
  console.log(`📄 Slide ${slideNumber} - Title: "${title}", Content length: ${content.length}, Images: ${images.length}`);
  
  return {
    title: title || `Slide ${slideNumber}`,
    content: content || 'No content found',
    images
  };
}

function extractTextFromElement(doc: Document, tagName: string): string {
  const elements = doc.getElementsByTagName(tagName);
  let text = '';
  for (let i = 0; i < elements.length; i++) {
    const elementText = elements[i].textContent || '';
    if (elementText.trim()) {
      text += elementText.trim() + ' ';
    }
  }
  return text.trim();
}

function extractAllText(doc: Document): string {
  // Try multiple possible text element tags
  const possibleTags = ['a:t', 'p:t', 't', 'a:txBody', 'p:txBody'];
  let content = '';
  
  for (const tag of possibleTags) {
    const textElements = doc.getElementsByTagName(tag);
    for (let i = 0; i < textElements.length; i++) {
      const text = textElements[i].textContent || '';
      if (text.trim()) {
        content += text.trim() + ' ';
      }
    }
  }
  
  // Also try to get text from any element with text content
  const allElements = doc.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    if (element.textContent && element.textContent.trim() && 
        element.children.length === 0) { // Only leaf nodes
      const text = element.textContent.trim();
      if (text && !content.includes(text)) {
        content += text + ' ';
      }
    }
  }
  
  return content.trim();
}

async function extractImages(slideDoc: Document, zip: JSZip): Promise<string[]> {
  const images: string[] = [];
  const imageElements = slideDoc.getElementsByTagName('a:blip');
  
  for (let i = 0; i < imageElements.length; i++) {
    const imageRef = imageElements[i].getAttribute('r:embed');
    if (imageRef) {
      try {
        const imageFile = zip.file(`ppt/media/image${i + 1}.png`) || 
                         zip.file(`ppt/media/image${i + 1}.jpg`) ||
                         zip.file(`ppt/media/image${i + 1}.jpeg`);
        
        if (imageFile) {
          const imageBuffer = await imageFile.async('nodebuffer');
          const base64 = imageBuffer.toString('base64');
          const mimeType = imageFile.name.endsWith('.png') ? 'image/png' : 'image/jpeg';
          images.push(`data:${mimeType};base64,${base64}`);
        }
      } catch (error) {
        console.warn(`Failed to extract image ${i + 1}:`, error);
      }
    }
  }
  
  return images;
}

export function convertParsedSlidesToAppSlides(parsedSlides: ParsedSlide[], projectId: string): Slide[] {
  console.log('🔄 Converting parsed slides to app format...');
  console.log('📄 Input parsed slides:', parsedSlides.map(s => ({ title: s.title, content: s.content })));
  
  const appSlides = parsedSlides.map((parsedSlide, index) => {
    console.log(`📄 Converting slide ${index + 1}: "${parsedSlide.title}"`);
    
    const slide: Slide = {
      id: uuidv4(),
      slideOrder: index,
      slideName: parsedSlide.title || `Slide ${index + 1}`,
      type: 'title',
      content: {
        id: uuidv4(),
        type: 'title',
        name: 'title',
        content: parsedSlide.title || `Slide ${index + 1}`,
        placeholder: 'Enter slide title...'
      }
    };

    // Add content if available
    if (parsedSlide.content && parsedSlide.content.trim()) {
      console.log(`📄 Adding content to slide ${index + 1}: "${parsedSlide.content}"`);
      // For now, we'll add the content as a paragraph
      // In a more advanced implementation, you could parse different content types
      slide.content = {
        id: uuidv4(),
        type: 'paragraph',
        name: 'paragraph',
        content: parsedSlide.content,
        placeholder: 'Enter content...'
      };
    }

    console.log(`📄 Final slide ${index + 1}:`, { slideName: slide.slideName, content: slide.content.content });
    return slide;
  });
  
  console.log('✅ Converted slides:', appSlides.map(s => ({ slideName: s.slideName, content: s.content.content })));
  return appSlides;
}
