import { supabase } from './supabaseClient'

export interface UploadOptions {
  preset?: 'thumbnail' | 'medium' | 'large' | 'original'
  onProgress?: (progress: number) => void
  convert?: boolean
  format?: 'webp' | 'jpeg' | 'png' | 'avif' | 'original'
  quality?: number // 1-100
  promptUser?: boolean // if true, show confirm/prompt dialogs in browser
}

export interface UploadResult {
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

/**
 * Upload and optimize an image using the Sharp-optimized API
 */
export async function uploadOptimizedImage(
  file: File, 
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { preset = 'large', onProgress } = options

  let convert = options.convert ?? true
  let format = options.format ?? 'webp'
  let quality = options.quality

  if (options.promptUser && typeof window !== 'undefined') {
    try {
      const shouldConvert = window.confirm('Convert this image to WebP? Click Cancel to upload original format.')
      convert = shouldConvert
      if (shouldConvert) {
        const qualityInput = window.prompt('Enter WebP quality (1-100). Higher = better quality, larger size.', (quality?.toString() || '90'))
        const parsed = qualityInput ? parseInt(qualityInput, 10) : NaN
        if (!isNaN(parsed)) {
          quality = Math.max(1, Math.min(100, parsed))
        }
      }
    } catch {}
  }

  // Validate file
  if (!file) {
    throw new Error('No file provided')
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }

  if (file.size > 15 * 1024 * 1024) {
    throw new Error('File size must be less than 15MB')
  }

  // Create form data
  const formData = new FormData()
  formData.append('file', file)
  formData.append('preset', preset)
  if (typeof convert === 'boolean') formData.append('convert', String(convert))
  if (format) formData.append('format', format)
  if (typeof quality === 'number') formData.append('quality', String(Math.max(1, Math.min(100, quality))))

  // Simulate progress if callback provided
  if (onProgress) {
    const progressInterval = setInterval(() => {
      onProgress(Math.random() * 90) // Simulate progress up to 90%
    }, 200)

    try {
      const response = await fetch('/api/upload-optimized', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      onProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result: UploadResult = await response.json()
      return result
    } catch (error) {
      clearInterval(progressInterval)
      throw error
    }
  } else {
    // No progress tracking
    const response = await fetch('/api/upload-optimized', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Upload failed')
    }

    const result: UploadResult = await response.json()
    return result
  }
}

/**
 * Upload image to Supabase Storage (legacy method)
 */
export async function uploadToSupabase(file: File): Promise<string> {
  if (!file) {
    throw new Error('No file provided')
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }

  // Validate file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB')
  }

  // Generate unique filename
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const fileExtension = file.name.split('.').pop()
  const fileName = `variant-images/${timestamp}-${randomString}.${fileExtension}`

  // Upload to Supabase Storage
  const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images'
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Upload error:', error)
    throw new Error('Failed to upload file')
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName)

  return urlData.publicUrl
}

/**
 * Get recommended preset based on use case
 */
export function getRecommendedPreset(useCase: string): 'thumbnail' | 'medium' | 'large' | 'original' {
  switch (useCase.toLowerCase()) {
    case 'thumbnail':
    case 'avatar':
    case 'icon':
      return 'thumbnail'
    case 'card':
    case 'gallery':
    case 'medium':
      return 'medium'
    case 'hero':
    case 'banner':
    case 'large':
      return 'large'
    case 'full':
    case 'original':
    case 'high-quality':
      return 'original'
    default:
      return 'large'
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
