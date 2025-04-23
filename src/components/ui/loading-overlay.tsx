"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  isLoading: boolean
  className?: string
}

export function LoadingOverlay({ isLoading, className }: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300">
      <div className={cn("flex flex-col items-center justify-center", className)}>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    </div>
  )
}
