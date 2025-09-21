'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Upload,
  FileText,
  Image,
  File,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ImportModalProps {
  children: React.ReactNode
}

interface UploadProgress {
  file: File
  progress: number
  status: 'uploading' | 'processing' | 'success' | 'error'
  message?: string
  projectId?: string
}

const ImportModal = ({ children }: ImportModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const acceptedFileTypes = [
    { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', ext: '.pptx', label: 'PowerPoint (.pptx)' },
    { type: 'application/vnd.ms-powerpoint', ext: '.ppt', label: 'PowerPoint (.ppt)' },
    { type: 'application/pdf', ext: '.pdf', label: 'PDF (.pdf)' },
  ]

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    const validFiles = Array.from(files).filter(file => 
      acceptedFileTypes.some(accepted => 
        file.type === accepted.type || file.name.toLowerCase().endsWith(accepted.ext)
      )
    )

    if (validFiles.length === 0) {
      toast.error('Invalid file type', {
        description: 'Please select a PowerPoint (.pptx, .ppt) or PDF (.pdf) file'
      })
      return
    }

    if (validFiles.length !== files.length) {
      toast.warning('Some files were skipped', {
        description: 'Only PowerPoint and PDF files are supported'
      })
    }

    handleUpload(validFiles)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }, [handleFileSelect])

  const handleUpload = async (files: File[]) => {
    setIsUploading(true)
    
    // Initialize progress for all files
    const initialProgress = files.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
      message: 'Preparing upload...'
    }))
    setUploadProgress(initialProgress)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Update progress
        setUploadProgress(prev => 
          prev.map(p => 
            p.file === file 
              ? { ...p, progress: 25, message: 'Uploading file...' }
              : p
          )
        )

        // Upload file
        const formData = new FormData()
        formData.append('file', file)
        formData.append('originalName', file.name)

        const response = await fetch('/api/import/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`)
        }

        const result = await response.json()

        // Update progress
        setUploadProgress(prev => 
          prev.map(p => 
            p.file === file 
              ? { ...p, progress: 50, status: 'processing', message: 'Processing presentation...' }
              : p
          )
        )

        // Process the uploaded file
        const processResponse = await fetch('/api/import/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileId: result.fileId,
            originalName: file.name,
          }),
        })

        if (!processResponse.ok) {
          throw new Error(`Processing failed: ${processResponse.statusText}`)
        }

        const processResult = await processResponse.json()

        // Update progress to success
        setUploadProgress(prev => 
          prev.map(p => 
            p.file === file 
              ? { 
                  ...p, 
                  progress: 100, 
                  status: 'success', 
                  message: 'Import successful!',
                  projectId: processResult.projectId
                }
              : p
          )
        )

        toast.success('Import successful', {
          description: `${file.name} has been imported successfully`
        })
      }

      // Close modal after a short delay
      setTimeout(() => {
        setIsOpen(false)
        setUploadProgress([])
        router.refresh() // Refresh the page to show new presentations
      }, 2000)

    } catch (error) {
      console.error('Import error:', error)
      
      // Update all progress to error
      setUploadProgress(prev => 
        prev.map(p => ({ 
          ...p, 
          status: 'error', 
          message: 'Import failed' 
        }))
      )

      toast.error('Import failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const handleClose = () => {
    if (!isUploading) {
      setIsOpen(false)
      setUploadProgress([])
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  return (
    <>
      <div onClick={() => {
        setIsOpen(true)
      }}>
        {children}
      </div>
      
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Presentation</DialogTitle>
          <DialogDescription>
            Upload a PowerPoint (.pptx, .ppt) or PDF (.pdf) file to import into your presentations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                : 'border-gray-300 dark:border-gray-600'
            } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragOver ? 'Drop files here' : 'Drag and drop files here'}
              </p>
              <p className="text-sm text-gray-500">
                or click to select files
              </p>
              <input
                type="file"
                multiple
                accept={acceptedFileTypes.map(t => t.type).join(',')}
                onChange={handleFileInputChange}
                className="hidden"
                id="file-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Select Files
              </label>
            </div>
          </div>

          {/* Supported File Types */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Supported formats:
            </p>
            <div className="flex flex-wrap gap-2">
              {acceptedFileTypes.map((fileType) => (
                <div
                  key={fileType.ext}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs"
                >
                  {fileType.ext === '.pptx' || fileType.ext === '.ppt' ? (
                    <FileText className="h-3 w-3" />
                  ) : (
                    <File className="h-3 w-3" />
                  )}
                  {fileType.label}
                </div>
              ))}
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Upload Progress:</p>
              {uploadProgress.map((progress, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(progress.status)}
                      <span className="text-sm font-medium truncate max-w-48">
                        {progress.file.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {progress.progress}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progress.status === 'success'
                          ? 'bg-green-500'
                          : progress.status === 'error'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {progress.message}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
            >
              {isUploading ? 'Processing...' : 'Cancel'}
            </Button>
            {uploadProgress.some(p => p.status === 'success') && (
              <Button
                onClick={() => {
                  const successProject = uploadProgress.find(p => p.status === 'success' && p.projectId)
                  if (successProject?.projectId) {
                    router.push(`/presentation/${successProject.projectId}`)
                  }
                }}
              >
                Open Presentation
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default ImportModal
