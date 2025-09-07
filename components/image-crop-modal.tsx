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
  const [aspect, setAspect] = useState<number | undefined>(aspectRatio)
  const imgRef = useRef<HTMLImageElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget
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
    }
  }, [aspect])

  const onDownloadCropClick = useCallback(() => {
    if (!previewCanvasRef.current || !completedCrop) return

    const canvas = previewCanvasRef.current
    const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9)
    onCrop(croppedImageUrl)
    onClose()
  }, [completedCrop, onCrop, onClose])

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

      const cropX = crop.x * scaleX
      const cropY = crop.y * scaleY

      ctx.translate(-cropX, -cropY)
      ctx.rotate((rotate * Math.PI) / 180)
      ctx.scale(scale, scale)
      ctx.drawImage(
        imgRef.current,
        0,
        0,
        imgRef.current.width,
        imgRef.current.height,
        0,
        0,
        imgRef.current.naturalWidth,
        imgRef.current.naturalHeight,
      )

      ctx.restore()
    },
    [scale, rotate]
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
    100,
    [completedCrop, canvasPreview]
  )

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
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Scale:</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-600">{scale.toFixed(1)}</span>
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
                <span className="text-sm text-gray-600">{rotate}°</span>
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
            </div>

            {/* Image and Crop */}
            <div className="flex gap-4">
              <div className="flex-1">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  minWidth={50}
                  minHeight={50}
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={URL.createObjectURL(imageFile)}
                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                    onLoad={onImageLoad}
                    className="max-w-full max-h-96"
                  />
                </ReactCrop>
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
