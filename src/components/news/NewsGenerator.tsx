"use client"
/**
 * Komponen utama generator berita.
 * Mengelola state, logic, dan pemanggilan API pembuatan berita.
 * Mengimplementasikan pola modular seperti TitleGenerator.
 * @module NewsGenerator
 */
import React, { useState, useEffect, useCallback, useMemo } from "react"
import { DEFAULT_MODEL } from "@/config/Models"
import { DEFAULT_CATEGORY, NEWS_CATEGORIES } from "@/config/Categories"
import type { ModelOption, NewsCategory, NewsStyle, NewsAudience, NewsTone } from "@/types"
import { useSearchParams } from "next/navigation"
import { generateNews } from "@/lib/api"
import { toast } from "sonner"
import { marked } from "marked"
import { saveToHistory } from "@/lib/storage"
import { v4 as uuidv4 } from "uuid"
import { NewsForm } from "@/components/news/NewsForm"
import { buildNewsPrompt } from "@/lib/news/newsPromptBuilder"
import { HistoryList } from "@/components/history/HistoryList"
import { FiX } from "react-icons/fi"

const DEFAULT_STYLE: NewsStyle = "Lugas (Straight News)"
const DEFAULT_AUDIENCE: NewsAudience = "Umum"
const DEFAULT_TONE: NewsTone = "Netral/Objektif"

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
  const [style, setStyle] = useState<NewsStyle>(DEFAULT_STYLE)
  const [audience, setAudience] = useState<NewsAudience>(DEFAULT_AUDIENCE)
  const [tone, setTone] = useState<NewsTone>(DEFAULT_TONE)
  const [errors, setErrors] = useState<Partial<Record<"title"|"style"|"audience"|"tone", string>>>({})
  const [showHistory, setShowHistory] = useState(false)
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

  // Validasi form
  const validate = useCallback(() => {
    const newErrors: Partial<Record<"title"|"style"|"audience"|"tone", string>> = {}
    if (!title.trim()) newErrors.title = "Judul berita wajib diisi"
    if (!style) newErrors.style = "Gaya penulisan wajib dipilih"
    if (!audience) newErrors.audience = "Audiens wajib dipilih"
    if (!tone) newErrors.tone = "Tone wajib dipilih"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [title, style, audience, tone])

  // --- Prompt builder utama ---
  const prompt = buildNewsPrompt(
    title,
    selectedCategory?.name || "-",
    style,
    audience,
    tone
  )

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

  // --- Handler selector yang menerima tipe NewsStyle | "" ---
  const handleStyleChange = useCallback((val: NewsStyle | "") => {
    if (val) setStyle(val)
  }, [])

  const handleAudienceChange = useCallback((val: NewsAudience | "") => {
    if (val) setAudience(val)
  }, [])

  const handleToneChange = useCallback((val: NewsTone | "") => {
    if (val) setTone(val)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return
    setIsGenerating(true)
    setGeneratedContent("")
    setParsedContent("")
    try {
      const response = await generateNews(title, selectedModel.id, selectedCategory.id, style, audience, tone)
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
  }, [title, selectedModel, selectedCategory, style, audience, tone, validate])

  // --- Memo: apakah konten sudah ada ---
  const showGeneratedContent = useMemo(() => !!generatedContent, [generatedContent])

  // --- Render ---
  return (
    <>
      <NewsForm
        title={title}
        onTitleChange={handleTitleChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        style={style}
        onStyleChange={handleStyleChange}
        audience={audience}
        onAudienceChange={handleAudienceChange}
        tone={tone}
        onToneChange={handleToneChange}
        isGenerating={isGenerating}
        onSubmit={handleSubmit}
        generatedContent={generatedContent}
        parsedContent={parsedContent}
        showGeneratedContent={showGeneratedContent}
        errors={errors}
        prompt={prompt}
        onShowHistoryAction={() => setShowHistory(true)}
      />
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" role="dialog" onClick={() => setShowHistory(false)}>
          <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-4 border border-border" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="absolute right-2 top-2 text-xl text-muted-foreground hover:text-primary"
              onClick={() => setShowHistory(false)}
              aria-label="Tutup riwayat"
            >
              <FiX className="w-6 h-6" />
            </button>
            <HistoryList showDeleteAtBottom />
          </div>
        </div>
      )}
    </>
  )
}
