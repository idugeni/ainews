"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface TitleResultProps {
  titles: string[]
}

export function TitleResult({ titles }: TitleResultProps) {
  const router = useRouter()
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null)

  const handleUseTitle = (title: string) => {
    router.push(`/news?title=${encodeURIComponent(title.trim())}`)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Choose a title:</h2>
      <div className="grid gap-3">
        {titles.map((title, index) => (
          <Card
            key={index}
            className={`overflow-hidden p-4 flex justify-between items-center cursor-pointer transition-colors ${
              selectedTitle === title ? "border-primary bg-primary/5" : "hover:bg-accent"
            }`}
            onClick={() => setSelectedTitle(title)}
          >
            <p className="font-medium">{title}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                handleUseTitle(title)
              }}
            >
              Use <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
      {selectedTitle && (
        <div className="flex justify-end mt-4">
          <Button onClick={() => handleUseTitle(selectedTitle)}>
            Continue with selected title <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
