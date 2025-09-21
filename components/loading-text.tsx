"use client"

import { cn } from "@/lib/utils"

interface LoadingTextProps {
  text?: string
  className?: string
  size?: "sm" | "md" | "lg"
  showSpinner?: boolean
}

export function LoadingText({ 
  text = "Bedoraliving", 
  className,
  size = "md",
  showSpinner = true
}: LoadingTextProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  return (
    <div className={cn(
      "flex items-center justify-center gap-2 text-gray-600 font-medium",
      sizeClasses[size],
      className
    )}>
      {showSpinner && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
      )}
      <span>{text}</span>
    </div>
  )
}

// Specific loading components for different use cases
export function ImageLoadingText({ className }: { className?: string }) {
  return (
    <div className={cn(
      "absolute inset-0 flex items-center justify-center bg-white rounded-lg",
      className
    )}>
      <LoadingText text="Bedoraliving" size="sm" />
    </div>
  )
}

export function CardLoadingText({ className }: { className?: string }) {
  return (
    <div className={cn(
      "flex items-center justify-center p-8 bg-gray-50 rounded-lg",
      className
    )}>
      <LoadingText text="Bedoraliving" size="md" />
    </div>
  )
}

export function PageLoadingText({ className }: { className?: string }) {
  return (
    <div className={cn(
      "flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg",
      className
    )}>
      <LoadingText text="Bedoraliving" size="lg" />
    </div>
  )
}
