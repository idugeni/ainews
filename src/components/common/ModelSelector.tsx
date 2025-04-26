"use client"

import { useState, useRef, useEffect } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MODELS } from "@/config/Models"
import type { ModelOption } from "@/types"
import { cn } from "@/lib/utils"

interface ModelSelectorProps {
  selectedModel: ModelOption
  onModelChangeAction: (model: ModelOption) => void
  disabled?: boolean
}

export function ModelSelector({ selectedModel, onModelChangeAction, disabled = false }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSelectModel = (model: ModelOption) => {
    onModelChangeAction(model)
    setIsOpen(false)
  }

  // Tutup dropdown jika klik di luar area
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span>{selectedModel.name}</span>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-lg">
          <div className="py-1">
            {MODELS.map((model) => (
              <button
                key={model.id}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-accent focus:bg-accent focus:outline-none",
                  selectedModel.id === model.id && "bg-accent text-primary"
                )}
                onClick={() => handleSelectModel(model)}
                disabled={disabled}
              >
                <div className="flex flex-1 items-start">
                  <div className="flex flex-col">
                    <span>{model.name}</span>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </div>
                </div>
                {selectedModel.id === model.id && <Check className="ml-2 h-4 w-4" />}
                {model.isRecommended && (
                  <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
