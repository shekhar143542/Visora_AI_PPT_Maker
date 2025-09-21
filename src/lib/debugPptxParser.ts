import JSZip from 'jszip';
import { DOMParser } from '@xmldom/xmldom';
import { Slide } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export interface ParsedSlide {
  title: string;
  content: string;
  images: string[];
}

export async function parsePowerPointFileDebug(filePath: string): Promise<ParsedSlide[]> {
  try {
    console.log('🔍 Starting DEBUG PowerPoint parsing for:', filePath);
    
    // Read the file
    const fs = await import('fs/promises');
    const fileBuffer = await fs.readFile(filePath);
    console.log('🔍 File read successfully, size:', fileBuffer.length);
    
    // Parse the ZIP file
    const zip = await JSZip.loadAsync(fileBuffer);
    console.log('🔍 ZIP loaded successfully');
    
    // List all files for debugging
    const fileNames = Object.keys(zip.files);
    console.log('🔍 All files in ZIP:', fileNames);
    
    // Get the presentation XML
    const presentationXml = await zip.file('ppt/presentation.xml')?.async('string');
    if (!presentationXml) {
      throw new Error('Could not find presentation.xml in PowerPoint file');
    }
    
    console.log('🔍 Presentation XML found, length:', presentationXml.length);
    console.log('🔍 Presentation XML preview:', presentationXml.substring(0, 1000));
    
    // Parse the XML
    const parser = new DOMParser();
    const presentationDoc = parser.parseFromString(presentationXml, 'text/xml');
    
    // Get slide references
    let slideRefs = presentationDoc.getElementsByTagName('p:sldId');
    if (slideRefs.length === 0) {
      slideRefs = presentationDoc.getElementsByTagName('sldId');
    }
    if (slideRefs.length === 0) {
      slideRefs = presentationDoc.getElementsByTagName('a:sldId');
    }
    
    console.log(`🔍 Found ${slideRefs.length} slide references`);
    
    const slides: ParsedSlide[] = [];
    
    // Process each slide
    for (let i = 0; i < slideRefs.length; i++) {
      const slideRef = slideRefs[i];
      const slideId = slideRef.getAttribute('r:id') || slideRef.getAttribute('id');
      
      console.log(`🔍 Processing slide ${i + 1}, ID: ${slideId}`);
      
      try {
        // Try to find the slide file
        let slideXml = await zip.file(`ppt/slides/slide${i + 1}.xml`)?.async('string');
        if (!slideXml) {
          // Try alternative naming
          const slideFiles = fileNames.filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'));
          console.log('🔍 Available slide files:', slideFiles);
          if (slideFiles[i]) {
            slideXml = await zip.file(slideFiles[i])?.async('string');
          }
        }
        
        if (slideXml) {
          console.log(`🔍 Slide ${i + 1} XML found, length: ${slideXml.length}`);
          console.log(`🔍 Slide ${i + 1} XML preview:`, slideXml.substring(0, 1000));
          
          const slideDoc = parser.parseFromString(slideXml, 'text/xml');
          const slide = await parseSlideDebug(slideDoc, i + 1);
          slides.push(slide);
          console.log(`✅ Slide ${i + 1} parsed: "${slide.title}"`);
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
        slides.push({
          title: `Slide ${i + 1}`,
          content: 'Content could not be parsed',
          images: []
        });
      }
    }
    
    console.log(`🔍 Successfully parsed ${slides.length} slides`);
    return slides;
    
  } catch (error) {
    console.error('❌ Error parsing PowerPoint file:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      filePath: filePath
    });
    
    // Return a fallback slide
    return [{
      title: 'Imported Presentation',
      content: 'This presentation was imported but encountered an error during parsing. You can edit this slide to add your content.',
      images: []
    }];
  }
}

async function parseSlideDebug(slideDoc: Document, slideNumber: number): Promise<ParsedSlide> {
  console.log(`🔍 Parsing slide ${slideNumber} content...`);
  
  // Extract text using multiple methods
  let allText = '';
  
  // Method 1: Look for a:t elements
  const textElements = slideDoc.getElementsByTagName('a:t');
  console.log(`🔍 Found ${textElements.length} a:t elements`);
  
  for (let i = 0; i < textElements.length; i++) {
    const element = textElements[i];
    if (element.textContent && element.textContent.trim()) {
      const text = element.textContent.trim();
      allText += text + ' ';
      console.log(`🔍 Found a:t text: "${text}"`);
    }
  }
  
  // Method 2: Look for t elements
  if (!allText.trim()) {
    const tElements = slideDoc.getElementsByTagName('t');
    console.log(`🔍 Found ${tElements.length} t elements`);
    
    for (let i = 0; i < tElements.length; i++) {
      const element = tElements[i];
      if (element.textContent && element.textContent.trim()) {
        const text = element.textContent.trim();
        allText += text + ' ';
        console.log(`🔍 Found t text: "${text}"`);
      }
    }
  }
  
  // Method 3: Look for any element with text content
  if (!allText.trim()) {
    console.log('🔍 No specific text elements found, looking for any text content...');
    const allElements = slideDoc.getElementsByTagName('*');
    console.log(`🔍 Found ${allElements.length} total elements`);
    
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      if (element.textContent && element.textContent.trim()) {
        const text = element.textContent.trim();
        // Only add if it's not already included and it's meaningful text
        if (text && !allText.includes(text) && text.length > 1) {
          allText += text + ' ';
          console.log(`🔍 Found element text: "${text}"`);
        }
      }
    }
  }
  
  // Method 4: Try to get the raw text content
  if (!allText.trim()) {
    console.log('🔍 Trying raw text content extraction...');
    const rawText = slideDoc.textContent || '';
    if (rawText.trim()) {
      allText = rawText.trim();
      console.log(`🔍 Found raw text: "${allText}"`);
    }
  }
  
  // Clean up the text
  allText = allText.trim();
  
  // Split text into title and content
  const textParts = allText.split(' ');
  const title = textParts.slice(0, Math.min(5, textParts.length)).join(' ') || `Slide ${slideNumber}`;
  const content = allText;
  
  console.log(`🔍 Slide ${slideNumber} - Title: "${title}", Content length: ${content.length}`);
  console.log(`🔍 Slide ${slideNumber} - Full content: "${content}"`);
  
  return {
    title: title || `Slide ${slideNumber}`,
    content: content || 'No content found',
    images: [] // Skip images for now
  };
}

export function convertParsedSlidesToAppSlidesDebug(parsedSlides: ParsedSlide[], projectId: string): Slide[] {
  console.log('🔍 Converting parsed slides to app format...');
  console.log('🔍 Input parsed slides:', parsedSlides.map(s => ({ title: s.title, content: s.content })));
  
  const appSlides = parsedSlides.map((parsedSlide, index) => {
    console.log(`🔍 Converting slide ${index + 1}: "${parsedSlide.title}"`);
    
    const slide: Slide = {
      id: uuidv4(),
      slideOrder: index,
      slideName: parsedSlide.title || `Slide ${index + 1}`,
      type: 'paragraph',
      content: {
        id: uuidv4(),
        type: 'paragraph',
        name: 'paragraph',
        content: parsedSlide.content || `Content for slide ${index + 1}`,
        placeholder: 'Enter content...'
      }
    };

    console.log(`🔍 Final slide ${index + 1}:`, { slideName: slide.slideName, content: slide.content.content });
    return slide;
  });
  
  console.log('🔍 Converted slides:', appSlides.map(s => ({ slideName: s.slideName, content: s.content.content })));
  return appSlides;
}
