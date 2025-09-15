import { supabase } from './supabaseClient'

export interface UploadOptions {
  onProgress?: (progress: number) => void
}

export interface UploadResult {
  url: string
  fileName: string
  originalSize: number
  optimizedSize: number
  format: string
  message: string
}

/**
 * Upload an image without compression
 */
export async function uploadOptimizedImage(
  file: File, 
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { onProgress } = options

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
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}