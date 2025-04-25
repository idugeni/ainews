"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { NEWS_CATEGORIES } from "@/config/categories"
import type { NewsCategory } from "@/types"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface CategorySelectorProps {
  selectedCategory: NewsCategory
  onCategoryChangeAction: (category: NewsCategory) => void
  disabled?: boolean
}

export function CategorySelector({ selectedCategory, onCategoryChangeAction, disabled = false }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSelectCategory = (category: NewsCategory) => {
    onCategoryChangeAction(category)
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
        <span className="flex items-center">
          {selectedCategory.icon && <selectedCategory.icon className="mr-2 h-4 w-4" />}
          {selectedCategory.name}
        </span>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-lg">
          <div className="py-1 max-h-60 overflow-auto">
            {NEWS_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                className={cn(
                  "flex w-full items-center px-4 py-2 text-left text-sm hover:bg-accent",
                  selectedCategory.id === category.id ? "bg-accent/50" : "",
                )}
                onClick={() => handleSelectCategory(category)}
              >
                <div className="flex items-center">
                  {category.icon && <category.icon className="mr-2 h-4 w-4" />}
                  <div className="flex flex-col">
                    <span>{category.name}</span>
                    <span className="text-xs text-muted-foreground">{category.description}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
