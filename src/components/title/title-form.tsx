"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModelSelector } from "@/components/ui/model-selector"
import { CategorySelector } from "@/components/ui/category-selector"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { DEFAULT_MODEL } from "@/config/models"
import { DEFAULT_CATEGORY } from "@/config/categories"
import type { ModelOption, NewsCategory } from "@/types"
import { generateTitles } from "@/lib/api"
import { toast } from "sonner"
import { saveToHistory } from "@/lib/storage"
import { v4 as uuidv4 } from "uuid"

export function TitleForm() {
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<ModelOption>(DEFAULT_MODEL)
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>(DEFAULT_CATEGORY)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    setIsGenerating(true)
    setGeneratedTitles([])

    try {
      const response = await generateTitles(topic, selectedModel.id, selectedCategory.id)

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to generate titles")
      }

      // Handle streaming response
      const reader = response.data.getReader()
      const decoder = new TextDecoder()
      let result = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        result += chunk

        // Parse titles as they come in
        const currentTitles = result
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => line.replace(/^\d+\.\s*/, "").trim())

        setGeneratedTitles(currentTitles)
      }

      // Save to history
      saveToHistory({
        id: uuidv4(),
        type: "title",
        content: result,
        topic,
        category: selectedCategory.name,
        model: selectedModel.id,
        createdAt: new Date().toISOString(),
      })

      toast.success("Titles generated successfully!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      toast.error(`Failed to generate titles: ${errorMessage}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseTitle = (title: string) => {
    router.push(`/news?title=${encodeURIComponent(title.trim())}&category=${encodeURIComponent(selectedCategory.id)}`)
  }

  return (
    <div className="space-y-6 relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="topic" className="text-sm font-medium">
            Enter a news topic
          </label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., climate change, technology, sports"
            disabled={isGenerating}
            className="w-full transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Select news category
            </label>
            <CategorySelector
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-medium">
              Select AI model
            </label>
            <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} disabled={isGenerating} />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isGenerating || !topic.trim()}
          className="w-full transition-all duration-200 hover:shadow-md"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Titles"
          )}
        </Button>
      </form>

      {generatedTitles.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-xl font-semibold">Generated Titles:</h2>
          <div className="grid gap-3">
            {generatedTitles.map((title, index) => (
              <Card
                key={index}
                className="overflow-hidden p-4 flex justify-between items-center transition-all duration-200 hover:shadow-md hover:border-primary/50"
              >
                <p className="font-medium">{title}</p>
                <Button
                  size="sm"
                  onClick={() => handleUseTitle(title)}
                  className="transition-all duration-200 hover:scale-105"
                >
                  Use This Title
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
