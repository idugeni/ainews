"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ModelSelector } from "@/components/ui/model-selector"
import { CategorySelector } from "@/components/ui/category-selector"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { DEFAULT_MODEL } from "@/config/models"
import { DEFAULT_CATEGORY, NEWS_CATEGORIES } from "@/config/categories"
import type { ModelOption, NewsCategory } from "@/types"
import { generateNews } from "@/lib/api"
import { toast } from "sonner"
import { marked } from "marked"
import { ExportOptions } from "@/components/news/export-options"
import { WordPressPublish } from "@/components/wordpress/wordpress-publish"
import { SeoAnalyzer } from "@/components/seo/seo-analyzer"
import { saveToHistory } from "@/lib/storage"
import { v4 as uuidv4 } from "uuid"

// --- Component ---
export function NewsForm() {
  // --- State ---
  const [title, setTitle] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generatedContent, setGeneratedContent] = useState<string>("")
  const [parsedContent, setParsedContent] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<ModelOption>(DEFAULT_MODEL)
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>(DEFAULT_CATEGORY)
  const searchParams = useSearchParams()

  // --- Effects ---
  useEffect(() => {
    const titleFromParams = searchParams.get("title")
    const categoryFromParams = searchParams.get("category")
    if (titleFromParams) setTitle(titleFromParams)
    if (categoryFromParams) {
      const category = NEWS_CATEGORIES.find((c) => c.id === categoryFromParams)
      if (category) setSelectedCategory(category)
    }
  }, [searchParams])

  useEffect(() => {
    let cancelled = false;
    if (generatedContent) {
      const parse = async () => {
        try {
          const parsed = await marked.parse(generatedContent);
          if (!cancelled) setParsedContent(typeof parsed === "string" ? parsed : String(parsed));
        } catch {
          if (!cancelled) setParsedContent(generatedContent);
        }
      };
      parse();
    } else {
      setParsedContent("");
    }
    return () => {
      cancelled = true;
    };
  }, [generatedContent])

  // --- Handlers ---
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }, [])

  const handleCategoryChange = useCallback((cat: NewsCategory) => {
    setSelectedCategory(cat)
  }, [])

  const handleModelChange = useCallback((model: ModelOption) => {
    setSelectedModel(model)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) return
    setIsGenerating(true)
    setGeneratedContent("")
    setParsedContent("")
    try {
      const response = await generateNews(title, selectedModel.id, selectedCategory.id)

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to generate news content")
      }

      // Handle streaming response
      const reader = response.data.getReader()
      const decoder = new TextDecoder()
      let result = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        let chunk = ""
        if (value) {
          chunk = decoder.decode(value)
          if (typeof chunk !== "string") {
            chunk = String(chunk)
          }
        }
        result += chunk
        setGeneratedContent(result)
      }

      // Save to history
      saveToHistory({
        id: uuidv4(),
        type: "news",
        content: result,
        title,
        category: selectedCategory.name,
        model: selectedModel.id,
        createdAt: new Date().toISOString(),
      })

      toast.success("News content generated successfully!")
    } catch {
      toast.error("Failed to generate news content: An unexpected error occurred.")
    } finally {
      setIsGenerating(false)
    }
  }, [title, selectedModel, selectedCategory])

  // --- Memoized content for performance ---
  const showGeneratedContent = useMemo(() => !!generatedContent, [generatedContent])

  // --- Render ---
  return (
    <div className="space-y-6 relative">
      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Generate News Content">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Enter a news title
          </label>
          <Input
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g., New Study Reveals Impact of Climate Change on Coastal Cities"
            disabled={isGenerating}
            className="w-full transition-all duration-200"
            aria-required="true"
            aria-label="News Title"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Select news category
            </label>
            <CategorySelector
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              disabled={isGenerating}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-medium">
              Select AI model
            </label>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
              disabled={isGenerating}
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isGenerating || !title.trim()}
          className="w-full transition-all duration-200 hover:shadow-md"
          aria-busy={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Generating...
            </>
          ) : (
            "Generate News Content"
          )}
        </Button>
      </form>
      {showGeneratedContent && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Generated News Content:</h2>
            <div className="flex items-center gap-2">
              <ExportOptions content={generatedContent} title={title} />
              <WordPressPublish title={title} content={generatedContent} />
            </div>
          </div>
          <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="p-6 prose dark:prose-invert max-w-none">
              {parsedContent ? (
                <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
              ) : (
                <div className="whitespace-pre-wrap">{generatedContent}</div>
              )}
            </div>
          </Card>
          <SeoAnalyzer content={generatedContent} title={title} />
        </div>
      )}
    </div>
  )
}
