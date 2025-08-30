'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react'

interface UploadResult {
  url: string
  fileName: string
  preset: string
  originalSize: number
  optimizedSize: number
  format: string
  dimensions: {
    original: { width: number; height: number }
    optimized: { width: number; height: number }
  }
  compressionRatio: string
  message: string
}

export function ImageUploadTest() {
  const [file, setFile] = useState<File | null>(null)
  const [preset, setPreset] = useState<string>('large')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('preset', preset)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 20, 90))
      }, 200)

      const response = await fetch('/api/upload-optimized', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data: UploadResult = await response.json()
      setResult(data)
      
      // Reset progress after a delay
      setTimeout(() => setProgress(0), 1000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Image Upload Test (Sharp Optimized)
        </CardTitle>
        <CardDescription>
          Test the new Sharp-optimized image upload API with different presets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Image File</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={uploading}
          />
          {file && (
            <div className="text-sm text-gray-600">
              Selected: {file.name} ({formatFileSize(file.size)})
            </div>
          )}
        </div>

        {/* Preset Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Optimization Preset</label>
          <Select value={preset} onValueChange={setPreset} disabled={uploading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thumbnail">Thumbnail (300x300, 70% quality)</SelectItem>
              <SelectItem value="medium">Medium (800x800, 80% quality)</SelectItem>
              <SelectItem value="large">Large (1200x1200, 85% quality)</SelectItem>
              <SelectItem value="original">Original (2000x2000, 90% quality)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-pulse" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload & Optimize
            </>
          )}
        </Button>

        {/* Progress Bar */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing...</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Upload Successful!</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Original Size:</span>
                <div className="text-gray-600">{formatFileSize(result.originalSize * 1024)}</div>
              </div>
              <div>
                <span className="font-medium">Optimized Size:</span>
                <div className="text-gray-600">{formatFileSize(result.optimizedSize * 1024)}</div>
              </div>
              <div>
                <span className="font-medium">Compression:</span>
                <div className="text-gray-600">{result.compressionRatio}% smaller</div>
              </div>
              <div>
                <span className="font-medium">Format:</span>
                <Badge variant="secondary">{result.format.toUpperCase()}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Dimensions: </span>
                <span className="text-gray-600">
                  {result.dimensions.original.width}×{result.dimensions.original.height} → {result.dimensions.optimized.width}×{result.dimensions.optimized.height}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Preset: </span>
                <Badge variant="outline">{result.preset}</Badge>
              </div>
            </div>

            {result.url && (
              <div className="pt-2">
                <img 
                  src={result.url} 
                  alt="Uploaded image" 
                  className="w-full h-32 object-cover rounded-md border"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
