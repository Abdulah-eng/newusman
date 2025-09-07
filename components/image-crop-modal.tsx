"use client"

import React, { useState, useRef, useCallback } from 'react'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageCropModalProps {
  isOpen: boolean
  onClose: () => void
  onCrop: (croppedImageUrl: string) => void
  imageFile: File | null
  aspectRatio?: number
}

export function ImageCropModal({ 
  isOpen, 
  onClose, 
  onCrop, 
  imageFile, 
  aspectRatio = 1 
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [moveX, setMoveX] = useState(0)
  const [moveY, setMoveY] = useState(0)
  const [aspect, setAspect] = useState<number | undefined>(aspectRatio)
  const [imageLoaded, setImageLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const [imageUrl, setImageUrl] = useState<string>('')

  // Reset imageLoaded and create image URL when new image file is provided
  React.useEffect(() => {
    setImageLoaded(false)
    if (imageFile) {
      const url = URL.createObjectURL(imageFile)
      setImageUrl(url)
      return () => URL.revokeObjectURL(url) // Cleanup
    }
  }, [imageFile])

  // Reset crop when aspect ratio changes (only when aspect actually changes)
  const [prevAspect, setPrevAspect] = React.useState(aspect)
  React.useEffect(() => {
    if (aspect !== prevAspect && imgRef.current) {
      const { width, height } = imgRef.current
      if (aspect) {
        setCrop(centerCrop(
          makeAspectCrop(
            {
              unit: '%',
              width: 90,
            },
            aspect,
            width,
            height
          ),
          width,
          height
        ))
      } else {
        setCrop({
          unit: '%',
          x: 10,
          y: 10,
          width: 80,
          height: 80
        })
      }
      setPrevAspect(aspect)
    }
  }, [aspect, prevAspect])

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    
    // Only reset values if this is the first time the image is loading
    if (!imageLoaded) {
      setScale(1)
      setRotate(0)
      setMoveX(0)
      setMoveY(0)
      setImageLoaded(true)
    }
    
    if (aspect) {
      setCrop(centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspect,
          width,
          height
        ),
        width,
        height
      ))
    } else {
      // If no aspect ratio, create a free crop
      setCrop({
        unit: '%',
        x: 10,
        y: 10,
        width: 80,
        height: 80
      })
    }
  }, [aspect, imageLoaded])

  const onDownloadCropClick = useCallback(() => {
    if (!previewCanvasRef.current || !completedCrop) return

    const canvas = previewCanvasRef.current
    const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9)
    onCrop(croppedImageUrl)
    onClose()
  }, [completedCrop, onCrop, onClose])

  const resetCrop = useCallback(() => {
    if (imgRef.current) {
      const { width, height } = imgRef.current
      if (aspect) {
        setCrop(centerCrop(
          makeAspectCrop(
            {
              unit: '%',
              width: 90,
            },
            aspect,
            width,
            height
          ),
          width,
          height
        ))
      } else {
        setCrop({
          unit: '%',
          x: 10,
          y: 10,
          width: 80,
          height: 80
        })
      }
    }
    // Reset all transform values
    setScale(1)
    setRotate(0)
    setMoveX(0)
    setMoveY(0)
    setImageLoaded(false)
  }, [aspect])

  const useDebounceEffect = (
    fn: () => void,
    waitTime: number,
    deps?: React.DependencyList,
  ) => {
    React.useEffect(() => {
      const t = setTimeout(() => {
        fn()
      }, waitTime)

      return () => {
        clearTimeout(t)
      }
    }, deps)
  }

  const canvasPreview = useCallback(
    (canvas: HTMLCanvasElement, crop: PixelCrop) => {
      if (!imgRef.current || !canvas || !crop) {
        throw new Error('Crop canvas does not exist')
      }

      const scaleX = imgRef.current.naturalWidth / imgRef.current.width
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('No 2d context')
      }

      const pixelRatio = window.devicePixelRatio
      canvas.width = crop.width * pixelRatio * scaleX
      canvas.height = crop.height * pixelRatio * scaleY

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      ctx.imageSmoothingQuality = 'high'

      ctx.save()

      // Calculate crop area in natural image coordinates
      const cropX = crop.x * scaleX
      const cropY = crop.y * scaleY
      const cropWidth = crop.width * scaleX
      const cropHeight = crop.height * scaleY

      // Move to center of canvas for transformations
      ctx.translate(canvas.width / 2 / pixelRatio, canvas.height / 2 / pixelRatio)
      
      // Apply transformations around the center
      ctx.translate(moveX, moveY)
      ctx.rotate((rotate * Math.PI) / 180)
      ctx.scale(scale, scale)
      
      // Move back and draw the cropped image
      ctx.translate(-canvas.width / 2 / pixelRatio, -canvas.height / 2 / pixelRatio)
      
      ctx.drawImage(
        imgRef.current,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        canvas.width / pixelRatio,
        canvas.height / pixelRatio,
      )

      ctx.restore()
    },
    [scale, rotate, moveX, moveY]
  )

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(previewCanvasRef.current, completedCrop)
      }
    },
    50, // Reduced debounce time for more responsive preview
    [completedCrop, canvasPreview]
  )

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [imageUrl])

  if (!isOpen || !imageFile) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Crop Image</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
             {/* Controls */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
               <div className="flex items-center gap-2">
                 <label className="text-sm font-medium">Scale:</label>
                 <input
                   type="range"
                   min="0.5"
                   max="3"
                   step="0.1"
                   value={scale}
                   onChange={(e) => setScale(Number(e.target.value))}
                   className="w-20"
                 />
                 <input
                   type="number"
                   min="0.5"
                   max="3"
                   step="0.1"
                   value={scale}
                   onChange={(e) => setScale(Number(e.target.value))}
                   className="w-16 px-2 py-1 border rounded text-sm text-center"
                 />
                 <span className="text-sm text-gray-600">x</span>
               </div>
               
               <div className="flex items-center gap-2">
                 <label className="text-sm font-medium">Rotate:</label>
                 <input
                   type="range"
                   min="-180"
                   max="180"
                   step="1"
                   value={rotate}
                   onChange={(e) => setRotate(Number(e.target.value))}
                   className="w-20"
                 />
                 <input
                   type="number"
                   min="-180"
                   max="180"
                   step="1"
                   value={rotate}
                   onChange={(e) => setRotate(Number(e.target.value))}
                   className="w-16 px-2 py-1 border rounded text-sm text-center"
                 />
                 <span className="text-sm text-gray-600">°</span>
               </div>

               <div className="flex items-center gap-2">
                 <label className="text-sm font-medium">Move X:</label>
                 <input
                   type="range"
                   min="-500"
                   max="500"
                   step="5"
                   value={moveX}
                   onChange={(e) => setMoveX(Number(e.target.value))}
                   className="w-20"
                 />
                 <input
                   type="number"
                   min="-500"
                   max="500"
                   step="5"
                   value={moveX}
                   onChange={(e) => setMoveX(Number(e.target.value))}
                   className="w-16 px-2 py-1 border rounded text-sm text-center"
                 />
                 <span className="text-sm text-gray-600">px</span>
               </div>

               <div className="flex items-center gap-2">
                 <label className="text-sm font-medium">Move Y:</label>
                 <input
                   type="range"
                   min="-500"
                   max="500"
                   step="5"
                   value={moveY}
                   onChange={(e) => setMoveY(Number(e.target.value))}
                   className="w-20"
                 />
                 <input
                   type="number"
                   min="-500"
                   max="500"
                   step="5"
                   value={moveY}
                   onChange={(e) => setMoveY(Number(e.target.value))}
                   className="w-16 px-2 py-1 border rounded text-sm text-center"
                 />
                 <span className="text-sm text-gray-600">px</span>
               </div>
               
               <div className="flex items-center gap-2">
                 <label className="text-sm font-medium">Aspect Ratio:</label>
                 <select
                   value={aspect || ''}
                   onChange={(e) => setAspect(e.target.value ? Number(e.target.value) : undefined)}
                   className="px-2 py-1 border rounded text-sm"
                 >
                   <option value="">Free</option>
                   <option value={1}>1:1 (Square)</option>
                   <option value={16/9}>16:9 (Wide)</option>
                   <option value={4/3}>4:3 (Standard)</option>
                   <option value={3/2}>3:2 (Photo)</option>
                 </select>
               </div>

               <div className="flex gap-2">
                 <Button 
                   variant="outline" 
                   size="sm" 
                   onClick={resetCrop}
                   className="text-xs"
                 >
                   Reset All
                 </Button>
                 <Button 
                   variant="outline" 
                   size="sm" 
                   onClick={() => {
                     setScale(1)
                     setRotate(0)
                     setMoveX(0)
                     setMoveY(0)
                     setImageLoaded(false)
                   }}
                   className="text-xs"
                 >
                   Reset Transform
                 </Button>
               </div>
             </div>

             {/* Image and Crop */}
             <div className="flex gap-4">
               <div className="flex-1">
                 <div className="mb-2">
                   <p className="text-sm text-gray-600">
                     Drag the corners or edges of the selection box to resize. Drag the center to move the selection.
                   </p>
                   <p className="text-xs text-gray-500 mt-1">
                     Use the controls above to scale, rotate, and position the image before cropping.
                   </p>
                 </div>
                 <div className="border border-gray-300 rounded-lg overflow-hidden">
                   <ReactCrop
                     crop={crop}
                     onChange={(_, percentCrop) => setCrop(percentCrop)}
                     onComplete={(c) => setCompletedCrop(c)}
                     aspect={aspect}
                     minWidth={50}
                     minHeight={50}
                     keepSelection
                     className="max-w-full"
                     disabled={false}
                     locked={false}
                     onCropChange={(newCrop) => setCrop(newCrop)}
                   >
                     <img
                       ref={imgRef}
                       alt="Crop me"
                       src={imageUrl}
                       style={{ 
                         transform: `scale(${scale}) rotate(${rotate}deg) translate(${moveX}px, ${moveY}px)`,
                         maxWidth: '100%',
                         maxHeight: '400px',
                         display: 'block'
                       }}
                       onLoad={onImageLoad}
                     />
                   </ReactCrop>
                 </div>
               </div>
              
              {/* Preview */}
              <div className="w-48">
                <h3 className="text-sm font-medium mb-2">Preview</h3>
                <canvas
                  ref={previewCanvasRef}
                  className="border rounded max-w-full"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onDownloadCropClick} disabled={!completedCrop}>
                Apply Crop
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
