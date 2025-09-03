"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from './button'
import { Palette, Check } from 'lucide-react'

interface ColorPickerProps {
  value?: string
  onChange: (color: string) => void
  label?: string
  placeholder?: string
}

// Predefined color palette
const COLOR_PALETTE = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0', '#808080',
  '#FFA500', '#FFC0CB', '#FFD700', '#90EE90', '#87CEEB', '#DDA0DD', '#F0E68C', '#98FB98',
  '#F5DEB3', '#FFB6C1', '#E0E0E0', '#D3D3D3', '#A9A9A9', '#696969', '#2F4F4F', '#708090',
  '#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460', '#BC8F8F', '#D2B48C', '#F5DEB3',
  '#FF6347', '#FF7F50', '#FFA07A', '#FFB6C1', '#FFC0CB', '#FFDAB9', '#FFE4B5', '#FFF8DC',
  '#E6E6FA', '#D8BFD8', '#DDA0DD', '#DA70D6', '#EE82EE', '#FF69B4', '#FF1493', '#DC143C',
  '#B22222', '#8B0000', '#800000', '#A52A2A', '#CD5C5C', '#F08080', '#FA8072', '#E9967A'
]

export function ColorPicker({ value = '', onChange, label, placeholder = 'Select a color' }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customColor, setCustomColor] = useState('')
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [hue, setHue] = useState(0) // 0-360
  const [sv, setSv] = useState<{ s: number; v: number }>({ s: 100, v: 100 }) // 0-100
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const svRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)

  // Utilities: color conversions
  function hsvToRgb(h: number, s: number, v: number) {
    const S = s / 100
    const V = v / 100
    const C = V * S
    const X = C * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = V - C
    let r = 0, g = 0, b = 0
    if (0 <= h && h < 60) { r = C; g = X; b = 0 }
    else if (60 <= h && h < 120) { r = X; g = C; b = 0 }
    else if (120 <= h && h < 180) { r = 0; g = C; b = X }
    else if (180 <= h && h < 240) { r = 0; g = X; b = C }
    else if (240 <= h && h < 300) { r = X; g = 0; b = C }
    else { r = C; g = 0; b = X }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    }
  }

  function rgbToHex(r: number, g: number, b: number) {
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase()
  }

  function hsvToHex(h: number, s: number, v: number) {
    const { r, g, b } = hsvToRgb(h, s, v)
    return rgbToHex(r, g, b)
  }

  function hexToHsv(hex: string) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!m) return null
    const r = parseInt(m[1], 16) / 255
    const g = parseInt(m[2], 16) / 255
    const b = parseInt(m[3], 16) / 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    const d = max - min
    let h = 0
    if (d !== 0) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h *= 60
    }
    const s = max === 0 ? 0 : d / max
    const v = max
    return { h, s: Math.round(s * 100), v: Math.round(v * 100) }
  }

  // Sync incoming value -> HSV when opening
  useEffect(() => {
    if (!value || !/^#[0-9A-F]{6}$/i.test(value)) return
    const hsv = hexToHsv(value)
    if (hsv) {
      setHue(hsv.h)
      setSv({ s: hsv.s, v: hsv.v })
      setCustomColor(value.toUpperCase())
    }
  }, [value])

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowCustomPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleColorSelect = (color: string) => {
    onChange(color)
    setIsOpen(false)
    setShowCustomPicker(false)
  }

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value)
  }

  const handleCustomColorSubmit = () => {
    if (customColor && /^#[0-9A-F]{6}$/i.test(customColor)) {
      handleColorSelect(customColor)
    }
  }

  // SV panel interactions
  const onSvMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = svRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width)
    const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height)
    const s = Math.round((x / rect.width) * 100)
    const v = Math.round(100 - (y / rect.height) * 100)
    setSv({ s, v })
    const hex = hsvToHex(hue, s, v)
    setCustomColor(hex)
    onChange(hex)
  }

  const onHueMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = hueRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width)
    const h = Math.round((x / rect.width) * 360)
    setHue(h)
    const hex = hsvToHex(h, sv.s, sv.v)
    setCustomColor(hex)
    onChange(hex)
  }

  const getColorName = (hex: string) => {
    const colorNames: { [key: string]: string } = {
      '#000000': 'Black',
      '#FFFFFF': 'White',
      '#FF0000': 'Red',
      '#00FF00': 'Green',
      '#0000FF': 'Blue',
      '#FFFF00': 'Yellow',
      '#FF00FF': 'Magenta',
      '#00FFFF': 'Cyan',
      '#800000': 'Maroon',
      '#008000': 'Green',
      '#000080': 'Navy',
      '#808000': 'Olive',
      '#800080': 'Purple',
      '#008080': 'Teal',
      '#C0C0C0': 'Silver',
      '#808080': 'Gray',
      '#FFA500': 'Orange',
      '#FFC0CB': 'Pink',
      '#FFD700': 'Gold',
      '#90EE90': 'Light Green',
      '#87CEEB': 'Sky Blue',
      '#DDA0DD': 'Plum',
      '#F0E68C': 'Khaki',
      '#98FB98': 'Pale Green',
      '#F5DEB3': 'Wheat',
      '#FFB6C1': 'Light Pink',
      '#E0E0E0': 'Light Gray',
      '#D3D3D3': 'Light Gray',
      '#A9A9A9': 'Dark Gray',
      '#696969': 'Dim Gray',
      '#2F4F4F': 'Dark Slate Gray',
      '#708090': 'Slate Gray',
      '#8B4513': 'Saddle Brown',
      '#A0522D': 'Sienna',
      '#CD853F': 'Peru',
      '#DEB887': 'Burlywood',
      '#F4A460': 'Sandy Brown',
      '#BC8F8F': 'Rosy Brown',
      '#D2B48C': 'Tan',
      '#F5DEB3': 'Wheat',
      '#FF6347': 'Tomato',
      '#FF7F50': 'Coral',
      '#FFA07A': 'Light Salmon',
      '#FFB6C1': 'Light Pink',
      '#FFC0CB': 'Pink',
      '#FFDAB9': 'Peach Puff',
      '#FFE4B5': 'Moccasin',
      '#FFF8DC': 'Cornsilk',
      '#E6E6FA': 'Lavender',
      '#D8BFD8': 'Thistle',
      '#DDA0DD': 'Plum',
      '#DA70D6': 'Orchid',
      '#EE82EE': 'Violet',
      '#FF69B4': 'Hot Pink',
      '#FF1493': 'Deep Pink',
      '#DC143C': 'Crimson',
      '#B22222': 'Fire Brick',
      '#8B0000': 'Dark Red',
      '#800000': 'Maroon',
      '#A52A2A': 'Brown',
      '#CD5C5C': 'Indian Red',
      '#F08080': 'Light Coral',
      '#FA8072': 'Salmon',
      '#E9967A': 'Dark Salmon'
    }
    return colorNames[hex] || hex
  }

  return (
    <div className="relative" ref={colorPickerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start h-10 px-3 py-2 text-left"
      >
        <div className="flex items-center gap-3">
          {value ? (
            <>
              <div 
                className="w-6 h-6 rounded border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: value }}
              />
              <span className="text-sm">{getColorName(value)}</span>
            </>
          ) : (
            <>
              <Palette className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">{placeholder}</span>
            </>
          )}
        </div>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <div className="space-y-4">
            {/* Pro gradient panel (SV) + Hue slider */}
            <div className="space-y-3">
              <div
                ref={svRef}
                onMouseDown={(e) => {
                  onSvMouse(e)
                  const move = (ev: MouseEvent) => onSvMouse((ev as unknown) as any)
                  const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
                  window.addEventListener('mousemove', move)
                  window.addEventListener('mouseup', up)
                }}
                className="w-full h-40 rounded-md cursor-crosshair"
                style={{
                  background: `linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`
                }}
              />
              <div
                ref={hueRef}
                onMouseDown={(e) => {
                  onHueMouse(e)
                  const move = (ev: MouseEvent) => onHueMouse((ev as unknown) as any)
                  const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
                  window.addEventListener('mousemove', move)
                  window.addEventListener('mouseup', up)
                }}
                className="w-full h-3 rounded-full cursor-pointer"
                style={{
                  background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)'
                }}
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => {
                    const val = e.target.value
                    setCustomColor(val)
                    if (/^#[0-9A-F]{6}$/i.test(val)) {
                      const hsv = hexToHsv(val)
                      if (hsv) {
                        setHue(hsv.h)
                        setSv({ s: hsv.s, v: hsv.v })
                        onChange(val.toUpperCase())
                      }
                    }
                  }}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: customColor || value || '#000000' }} />
              </div>
            </div>
            {/* Predefined Colors Grid */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Choose a Color</h4>
              <div className="grid grid-cols-8 gap-2">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors relative group"
                    style={{ backgroundColor: color }}
                    title={getColorName(color)}
                  >
                    {value === color && (
                      <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>


            {/* Current Selection Display */}
            {value && (
              <div className="border-t pt-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: value }}
                  />
                  <div>
                    <p className="text-sm font-medium">{getColorName(value)}</p>
                    <p className="text-xs text-gray-500">{value}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
