'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Download,
  FileText,
  Image,
  File,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { useSlideStore } from '@/store/useSlideStore'

type DownloadFormat = 'pptx' | 'pdf' | 'images' | 'html' | 'all'

interface DownloadProgress {
  format: DownloadFormat
  progress: number
  status: 'idle' | 'downloading' | 'success' | 'error'
  message?: string
}

const DownloadDropdown = () => {
  const { slides, project, currentTheme } = useSlideStore()
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress[]>([])
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadFormats = [
    {
      id: 'pptx' as DownloadFormat,
      label: 'PowerPoint (.pptx)',
      description: 'Native PowerPoint format',
      icon: File,
      color: 'text-orange-500',
    },
    {
      id: 'pdf' as DownloadFormat,
      label: 'PDF (.pdf)',
      description: 'Portable document format',
      icon: FileText,
      color: 'text-red-500',
    },
    {
      id: 'images' as DownloadFormat,
      label: 'Images (PNG)',
      description: 'Each slide as individual images',
      icon: Image,
      color: 'text-blue-500',
    },
    {
      id: 'html' as DownloadFormat,
      label: 'HTML',
      description: 'Web-based presentation',
      icon: Globe,
      color: 'text-green-500',
    },
  ]

  const handleDownload = async (format: DownloadFormat) => {
    if (!slides || slides.length === 0) {
      toast.error('No slides to download')
      return
    }

    setIsDownloading(true)
    setDownloadProgress(prev => [...prev, {
      format,
      progress: 0,
      status: 'downloading',
      message: 'Preparing download...'
    }])

    try {
      const response = await fetch(`/api/download/${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slides,
          project,
          theme: currentTheme,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Download failed: ${response.statusText}`)
      }

      // Update progress
      setDownloadProgress(prev => 
        prev.map(p => 
          p.format === format 
            ? { ...p, progress: 50, message: 'Generating file...' }
            : p
        )
      )

      // Get the blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      const filename = `${project?.title || 'presentation'}.${format === 'images' ? 'zip' : format}`
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      // Update progress to success
      setDownloadProgress(prev => 
        prev.map(p => 
          p.format === format 
            ? { ...p, progress: 100, status: 'success', message: 'Download complete!' }
            : p
        )
      )

      toast.success('Download started', {
        description: `${format.toUpperCase()} file is being downloaded`
      })

    } catch (error) {
      console.error('Download error:', error)
      
      setDownloadProgress(prev => 
        prev.map(p => 
          p.format === format 
            ? { ...p, status: 'error', message: 'Download failed' }
            : p
        )
      )

      toast.error('Download failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    } finally {
      setIsDownloading(false)
      
      // Clear progress after 3 seconds
      setTimeout(() => {
        setDownloadProgress(prev => prev.filter(p => p.format !== format))
      }, 3000)
    }
  }

  const handleDownloadAll = async () => {
    if (!slides || slides.length === 0) {
      toast.error('No slides to download')
      return
    }

    setIsDownloading(true)
    
    // Start all downloads
    const formats: DownloadFormat[] = ['pptx', 'pdf', 'images', 'html']
    formats.forEach(format => {
      setDownloadProgress(prev => [...prev, {
        format,
        progress: 0,
        status: 'downloading',
        message: 'Preparing download...'
      }])
    })

    try {
      const response = await fetch('/api/download/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slides,
          project,
          theme: currentTheme,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Bulk download failed: ${response.statusText}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project?.title || 'presentation'}-all-formats.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      // Update all progress to success
      setDownloadProgress(prev => 
        prev.map(p => ({ ...p, progress: 100, status: 'success', message: 'Download complete!' }))
      )

      toast.success('Bulk download started', {
        description: 'All formats are being downloaded as a ZIP file'
      })

    } catch (error) {
      console.error('Bulk download error:', error)
      
      setDownloadProgress(prev => 
        prev.map(p => ({ ...p, status: 'error', message: 'Download failed' }))
      )

      toast.error('Bulk download failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    } finally {
      setIsDownloading(false)
      
      // Clear progress after 5 seconds
      setTimeout(() => {
        setDownloadProgress([])
      }, 5000)
    }
  }

  const getProgressForFormat = (format: DownloadFormat) => {
    return downloadProgress.find(p => p.format === format)
  }

  const getStatusIcon = (status: DownloadProgress['status']) => {
    switch (status) {
      case 'downloading':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            disabled={isDownloading || !slides || slides.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {downloadFormats.map((format) => {
            const progress = getProgressForFormat(format.id)
            const Icon = format.icon
            
            return (
              <DropdownMenuItem
                key={format.id}
                onClick={() => handleDownload(format.id)}
                disabled={isDownloading}
                className="flex items-center gap-3 p-3"
              >
                <Icon className={`h-4 w-4 ${format.color}`} />
                <div className="flex-1">
                  <div className="font-medium">{format.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {format.description}
                  </div>
                  {progress && (
                    <div className="mt-1">
                      <div className="flex items-center gap-2 text-xs">
                        {getStatusIcon(progress.status)}
                        <span className="text-muted-foreground">
                          {progress.message}
                        </span>
                      </div>
                      {progress.status === 'downloading' && (
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${progress.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </DropdownMenuItem>
            )
          })}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={handleDownloadAll}
            disabled={isDownloading}
            className="flex items-center gap-3 p-3 font-medium"
          >
            <Download className="h-4 w-4" />
            <div>
              <div>Download All Formats</div>
              <div className="text-xs text-muted-foreground">
                All formats in a ZIP file
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default DownloadDropdown
