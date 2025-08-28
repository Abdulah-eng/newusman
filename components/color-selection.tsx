"use client"

import { useState } from "react"

interface ColorSelectionProps {
  selectedColor: string
  onColorChange: (color: string) => void
  colors?: string[]
  className?: string
}

export function ColorSelection({ 
  selectedColor, 
  onColorChange, 
  colors = ["Oak", "Walnut", "White"],
  className = ""
}: ColorSelectionProps) {
  const [colorModalOpen, setColorModalOpen] = useState(false)

  return (
    <>
      <div className={`border-0 rounded-lg p-4 bg-white cursor-pointer ${className}`} onClick={() => setColorModalOpen(true)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 text-gray-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
              </svg>
            </div>
            <span className="text-gray-700 font-semibold text-lg">Choose Colour</span>
          </div>
          <div className="w-6 h-6 text-gray-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Color Modal */}
      {colorModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold">Choose a Colour</h3>
              <button 
                onClick={() => setColorModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5 sm:w-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                    selectedColor === color 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    onColorChange(color);
                    setColorModalOpen(false);
                  }}
                >
                  {/* Color Name */}
                  <div className="font-semibold text-base sm:text-lg text-gray-900 mb-2">{color}</div>
                  
                  {/* Selection Indicator */}
                  {selectedColor === color && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
