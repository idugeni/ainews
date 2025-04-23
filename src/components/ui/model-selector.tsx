"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MODELS } from "@/config/models"
import type { ModelOption } from "@/types"
import { cn } from "@/lib/utils"

interface ModelSelectorProps {
  selectedModel: ModelOption
  onModelChange: (model: ModelOption) => void
  disabled?: boolean
}

export function ModelSelector({ selectedModel, onModelChange, disabled = false }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelectModel = (model: ModelOption) => {
    onModelChange(model)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full">
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
                  "flex w-full items-center px-4 py-2 text-left text-sm hover:bg-accent",
                  selectedModel.id === model.id ? "bg-accent/50" : "",
                )}
                onClick={() => handleSelectModel(model)}
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
