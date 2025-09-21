import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Import upload request received')
    
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const originalName = file.name // Get original name from the file object

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'application/vnd.ms-powerpoint', // .ppt
      'application/pdf', // .pdf
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only PowerPoint (.pptx, .ppt) and PDF (.pdf) files are supported.' 
      }, { status: 400 })
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 50MB.' 
      }, { status: 400 })
    }

    // Generate unique file ID
    const fileId = uuidv4()
    const fileExtension = originalName.split('.').pop() || 'unknown'
    const fileName = `${fileId}.${fileExtension}`

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'imports')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, ignore error
    }

    // Save file to disk
    const filePath = join(uploadsDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    await writeFile(filePath, buffer)

    // Store file metadata in session or database
    // For now, we'll return the file info and handle processing separately
    const fileInfo = {
      fileId,
      originalName,
      fileName,
      filePath,
      fileType: file.type,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      userId: user.id,
    }

    console.log('✅ File uploaded successfully:', { fileId, originalName, fileType: file.type, fileSize: file.size })

    // In a production environment, you might want to store this in a database
    // For now, we'll return the file info directly
    return NextResponse.json({
      success: true,
      fileId,
      originalName,
      fileName,
      fileType: file.type,
      fileSize: file.size,
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
