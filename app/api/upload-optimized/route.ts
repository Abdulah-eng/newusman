import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import sharp from 'sharp'

// Optimization presets for different use cases
const OPTIMIZATION_PRESETS = {
  thumbnail: {
    maxWidth: 300,
    maxHeight: 300,
    quality: 80, // Increased from 70 for better quality
    format: 'webp'
  },
  medium: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 85, // Increased from 80 for better quality
    format: 'webp'
  },
  large: {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 90, // Increased from 85 for better quality
    format: 'webp'
  },
  original: {
    maxWidth: 2000,
    maxHeight: 2000,
    quality: 95, // High quality for original preset
    format: 'webp'
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const preset = formData.get('preset') as string || 'large' // Default to large preset
    const requestedFormat = (formData.get('format') as string) || 'webp'
    const convertFlag = (formData.get('convert') as string) || 'true'
    const qualityOverrideRaw = formData.get('quality') as string | null
    const convertToFormat = convertFlag !== 'false'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (15MB limit for original files)
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 15MB' }, { status: 400 })
    }

    // Validate preset
    if (!OPTIMIZATION_PRESETS[preset as keyof typeof OPTIMIZATION_PRESETS]) {
      return NextResponse.json({ error: 'Invalid preset. Use: thumbnail, medium, large, or original' }, { status: 400 })
    }

    const selectedPreset = OPTIMIZATION_PRESETS[preset as keyof typeof OPTIMIZATION_PRESETS]
    // Allow overriding format/quality via request
    const targetFormat = convertToFormat ? requestedFormat : 'original'
    const qualityOverride = qualityOverrideRaw ? Math.max(1, Math.min(100, parseInt(qualityOverrideRaw, 10))) : undefined

    // Convert File to Buffer for Sharp processing
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const outputExtension = targetFormat === 'original' ? (file.name.split('.').pop() || 'bin') : targetFormat
    const fileName = `optimized-images/${preset}/${timestamp}-${randomString}.${outputExtension}`

    // Optimize image with Sharp (or pass-through original)
    let optimizedBuffer: Buffer
    let metadata: sharp.Metadata
    let targetWidth: number
    let targetHeight: number
    
    try {
      // Get image metadata
      metadata = await sharp(buffer).metadata()
      
      // Determine optimal dimensions
      targetWidth = metadata.width || 0
      targetHeight = metadata.height || 0
      
      // Resize if image is larger than preset dimensions
      if (metadata.width && metadata.width > selectedPreset.maxWidth) {
        targetWidth = selectedPreset.maxWidth
        targetHeight = Math.round((metadata.height! * selectedPreset.maxWidth) / metadata.width!)
      }
      
      if (targetHeight && targetHeight > selectedPreset.maxHeight) {
        targetHeight = selectedPreset.maxHeight
        targetWidth = Math.round((targetWidth * selectedPreset.maxHeight) / targetHeight)
      }

      // Preserve original dimensions if no resizing is needed
      if (targetWidth === 0 || targetHeight === 0) {
        targetWidth = metadata.width || 0
        targetHeight = metadata.height || 0
      }

      if (!convertToFormat || targetFormat === 'original') {
        // No conversion requested → upload original file bytes
        optimizedBuffer = buffer
      } else {
        // Start Sharp processing
        let sharpInstance = sharp(buffer)
        
        // Only resize if the image is actually larger than the target dimensions
        if (metadata.width && metadata.height && 
            (metadata.width > selectedPreset.maxWidth || metadata.height > selectedPreset.maxHeight)) {
          sharpInstance = sharpInstance.resize(targetWidth, targetHeight, {
            fit: 'inside',
            withoutEnlargement: true,
            kernel: sharp.kernel.lanczos3 // Better quality resampling
          })
        }

        // Apply format-specific optimization
        const effectiveQuality = qualityOverride ?? selectedPreset.quality
        switch (targetFormat) {
          case 'webp':
            sharpInstance = sharpInstance.webp({ 
              quality: effectiveQuality,
              effort: 4,
              lossless: false,
              nearLossless: false,
              smartSubsample: true
            })
            break
          case 'jpeg':
            sharpInstance = sharpInstance.jpeg({ 
              quality: effectiveQuality,
              progressive: true,
              mozjpeg: true
            })
            break
          case 'png':
            // PNG is lossless; use compressionLevel only
            sharpInstance = sharpInstance.png({ 
              compressionLevel: 9
            })
            break
          case 'avif':
            sharpInstance = sharpInstance.avif({ 
              quality: effectiveQuality,
              effort: 9
            })
            break
          default:
            // Fallback to webp
            sharpInstance = sharpInstance.webp({ quality: effectiveQuality })
            break
        }

        // Process image
        optimizedBuffer = await sharpInstance.toBuffer()
      }

      // Console log removed for performance: ${metadata.width}x${metadata.height} → ${targetWidth}x${targetHeight}`)
      // Console log removed for performance.toFixed(1)}KB → ${(optimizedBuffer.length / 1024).toFixed(1)}KB`)
      // Console log removed for performance * 100).toFixed(1)}%`)
      
    } catch (sharpError) {
      console.error('Sharp processing error:', sharpError)
      return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
    }

    // Upload optimized image to Supabase Storage
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images'
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, optimizedBuffer, {
        contentType: convertToFormat && targetFormat !== 'original' ? `image/${targetFormat}` : (file.type || 'application/octet-stream'),
        cacheControl: '31536000', // 1 year cache
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: 'Failed to upload optimized image' }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    return NextResponse.json({ 
      url: urlData.publicUrl,
      fileName: fileName,
      preset: preset,
      originalSize: Math.round(buffer.length / 1024),
      optimizedSize: Math.round(optimizedBuffer.length / 1024),
      format: convertToFormat && targetFormat !== 'original' ? targetFormat : (file.type.split('/')[1] || 'original'),
      dimensions: {
        original: { width: metadata.width, height: metadata.height },
        optimized: { width: targetWidth, height: targetHeight }
      },
      compressionRatio: ((1 - optimizedBuffer.length / buffer.length) * 100).toFixed(1),
      message: 'Image optimized and uploaded successfully'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
