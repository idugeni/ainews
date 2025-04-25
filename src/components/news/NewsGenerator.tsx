"use client"
/**
 * Komponen utama generator berita.
 * Mengelola state, logic, dan pemanggilan API pembuatan berita.
 * Mengimplementasikan pola modular seperti TitleGenerator.
 * @module NewsGenerator
 */
import React, { useState, useEffect, useCallback, useMemo } from "react"
import { DEFAULT_MODEL } from "@/config/models"
import { DEFAULT_CATEGORY, NEWS_CATEGORIES } from "@/config/categories"
import type { ModelOption, NewsCategory } from "@/types"
import { useSearchParams } from "next/navigation"
import { generateNews } from "@/lib/api"
import { toast } from "sonner"
import { marked } from "marked"
import { saveToHistory } from "@/lib/storage"
import { v4 as uuidv4 } from "uuid"
import { NewsForm } from "./NewsForm"

/**
 * Komponen utama generator berita
 */
export default function NewsGenerator() {
  // --- State utama ---
  const [title, setTitle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [parsedContent, setParsedContent] = useState("")
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY)
  const searchParams = useSearchParams()

  // --- Effect: Ambil param dari URL jika ada ---
  useEffect(() => {
    const titleFromParams = searchParams.get("title")
    const categoryFromParams = searchParams.get("category")
    if (titleFromParams) setTitle(titleFromParams)
    if (categoryFromParams) {
      const category = NEWS_CATEGORIES.find((c) => c.id === categoryFromParams)
      if (category) setSelectedCategory(category)
    }
  }, [searchParams])

  // --- Effect: Parsing markdown hasil berita ---
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

  // --- Handler Form ---
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
      if (!response.success || !response.data || !response.data.result) {
        throw new Error(response.error || "Gagal membuat konten berita")
      }
      setGeneratedContent(response.data.result)
      saveToHistory({
        id: uuidv4(),
        type: "news",
        content: response.data.result,
        title,
        category: selectedCategory.name,
        model: selectedModel.id,
        createdAt: new Date().toISOString(),
      })
      toast.success("Berita berhasil dibuat!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      toast.error(`Gagal membuat berita: ${errorMessage}`)
    } finally {
      setIsGenerating(false)
    }
  }, [title, selectedModel, selectedCategory])

  // --- Memo: apakah konten sudah ada ---
  const showGeneratedContent = useMemo(() => !!generatedContent, [generatedContent])

  // --- Render ---
  return (
    <NewsForm
      title={title}
      onTitleChange={handleTitleChange}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      selectedModel={selectedModel}
      onModelChange={handleModelChange}
      isGenerating={isGenerating}
      onSubmit={handleSubmit}
      generatedContent={generatedContent}
      parsedContent={parsedContent}
      showGeneratedContent={showGeneratedContent}
    />
  )
}
