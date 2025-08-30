import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import sharp from 'sharp'

// Optimization presets for different use cases
const OPTIMIZATION_PRESETS = {
  thumbnail: {
    maxWidth: 300,
    maxHeight: 300,
    quality: 70,
    format: 'webp'
  },
  medium: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 80,
    format: 'webp'
  },
  large: {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 85,
    format: 'webp'
  },
  original: {
    maxWidth: 2000,
    maxHeight: 2000,
    quality: 90,
    format: 'webp'
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const preset = formData.get('preset') as string || 'large' // Default to large preset
    
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

    // Convert File to Buffer for Sharp processing
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileName = `optimized-images/${preset}/${timestamp}-${randomString}.${selectedPreset.format}`

    // Optimize image with Sharp
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

      // Start Sharp processing
      let sharpInstance = sharp(buffer)
        .resize(targetWidth, targetHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })

      // Apply format-specific optimization
      switch (selectedPreset.format) {
        case 'webp':
          sharpInstance = sharpInstance.webp({ 
            quality: selectedPreset.quality,
            effort: 6 // Higher effort = better compression but slower
          })
          break
        case 'jpeg':
          sharpInstance = sharpInstance.jpeg({ 
            quality: selectedPreset.quality,
            progressive: true,
            mozjpeg: true
          })
          break
        case 'png':
          sharpInstance = sharpInstance.png({ 
            quality: selectedPreset.quality,
            compressionLevel: 9,
            progressive: true
          })
          break
        case 'avif':
          sharpInstance = sharpInstance.avif({ 
            quality: selectedPreset.quality,
            effort: 9
          })
          break
      }

      // Process image
      optimizedBuffer = await sharpInstance.toBuffer()

      console.log(`Image optimized (${preset}): ${metadata.width}x${metadata.height} → ${targetWidth}x${targetHeight}`)
      console.log(`Size reduction: ${(buffer.length / 1024).toFixed(1)}KB → ${(optimizedBuffer.length / 1024).toFixed(1)}KB`)
      console.log(`Compression ratio: ${((1 - optimizedBuffer.length / buffer.length) * 100).toFixed(1)}%`)
      
    } catch (sharpError) {
      console.error('Sharp processing error:', sharpError)
      return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
    }

    // Upload optimized image to Supabase Storage
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images'
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, optimizedBuffer, {
        contentType: `image/${selectedPreset.format}`,
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
      format: selectedPreset.format,
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
