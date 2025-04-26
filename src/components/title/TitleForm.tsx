"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModelSelector } from "@/components/ui/model-selector"
import { CategorySelector } from "@/components/ui/category-selector"
import type { ModelOption, NewsCategory } from "@/types"
import { DEFAULT_MODEL } from "@/config/models"
import { DEFAULT_CATEGORY } from "@/config/categories"
import { generateTitles } from "@/lib/api"
import { toast } from "sonner"
import { saveToHistory } from "@/lib/storage"
import { v4 as uuidv4 } from "uuid"
import { TitleResultList } from "@/components/title/TitleResultList"
import { HistoryList } from "@/components/history/history-list"
import { FiLoader } from "react-icons/fi"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

interface TitleFormProps {
  topic: string;
  setTopicAction: (v: string) => void;
  count: number;
  setCountAction: (v: number) => void;
  selectedModel: ModelOption;
  setSelectedModelAction: (v: ModelOption) => void;
  selectedCategory: NewsCategory;
  setSelectedCategoryAction: (v: NewsCategory) => void;
  isGenerating: boolean;
  onSubmitAction: () => void;
  onShowHistoryAction: () => void;
  promptPreview?: string;
}

export function TitleForm({
  topic,
  setTopicAction,
  count,
  setCountAction,
  selectedModel,
  setSelectedModelAction,
  selectedCategory,
  setSelectedCategoryAction,
  isGenerating,
  onSubmitAction,
  onShowHistoryAction,
  promptPreview
}: TitleFormProps) {
  return (
    <Card className="space-y-6 relative p-6">
      <div className="flex justify-end mb-4">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-2 md:mt-0"
          onClick={onShowHistoryAction}
          disabled={isGenerating}
        >
          Riwayat
        </Button>
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Generate News Titles</h1>
        <p className="text-muted-foreground mb-0">
          Masukkan topik berita, pilih kategori dan model AI, lalu dapatkan beberapa opsi judul berita yang menarik dan siap pakai.
        </p>
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmitAction();
        }}
        className="space-y-4"
      >
        {/* Topik */}
        <div className="mb-4">
          <label htmlFor="topic" className="text-sm font-medium">Topik Berita <span className="text-red-600">*</span></label>
          <Input
            id="topic"
            type="text"
            value={topic}
            onChange={e => setTopicAction(e.target.value)}
            placeholder="Contoh: Teknologi AI di Indonesia, Ekonomi Syariah, Startup Kesehatan Digital, dll."
            disabled={isGenerating}
            className="mb-1"
            autoFocus
          />
          {/* Error topik jika ada (tambahkan jika validasi ada) */}
        </div>
        <p className="text-xs text-muted-foreground mb-2">Tulis topik utama yang ingin dijadikan judul berita. Semakin spesifik, hasil judul akan semakin relevan.</p>

        {/* Jumlah Judul */}
        <div className="mb-4">
          <label htmlFor="count-select" className="text-sm font-medium">Jumlah Judul</label>
          <Select
            value={String(count)}
            onValueChange={v => setCountAction(Number(v))}
            disabled={isGenerating}
          >
            <SelectTrigger id="count-select" className="w-full">
              <SelectValue placeholder="Pilih jumlah judul" />
            </SelectTrigger>
            <SelectContent>
              {[3,4,5,6,7,8,9,10].map(val => (
                <SelectItem key={val} value={String(val)}>{val}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground mb-2">Pilih berapa banyak alternatif judul berita yang ingin dihasilkan.</p>

        {/* Model AI */}
        <div className="mb-4">
          <label htmlFor="model-selector" className="text-sm font-medium">Model AI</label>
          <ModelSelector
            selectedModel={selectedModel || DEFAULT_MODEL}
            onModelChangeAction={setSelectedModelAction}
            disabled={isGenerating}
          />
        </div>
        <p className="text-xs text-muted-foreground mb-2">Pilih model AI yang digunakan untuk menghasilkan judul. Model berbeda bisa memberi variasi gaya penulisan.</p>

        {/* Kategori */}
        <div className="mb-4">
          <label htmlFor="category-selector" className="text-sm font-medium">Kategori Berita</label>
          <CategorySelector
            selectedCategory={selectedCategory}
            onCategoryChangeAction={setSelectedCategoryAction}
            disabled={isGenerating}
          />
        </div>
        <p className="text-xs text-muted-foreground mb-2">Pilih kategori berita agar judul yang dihasilkan lebih relevan.</p>

        <Button
          type="submit"
          disabled={isGenerating || !topic.trim()}
          className="w-full transition-all duration-200 hover:shadow-md"
          aria-busy={isGenerating}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <FiLoader className="animate-spin h-5 w-5 text-muted-foreground opacity-100" />
              Membuat Judul...
            </span>
          ) : (
            "Buat Judul"
          )}
        </Button>
        {promptPreview && (
          <Card className="mt-4 px-4 py-3 text-xs font-mono whitespace-pre-wrap text-muted-foreground border border-border">
            <span className="font-semibold text-primary">Preview Prompt ke AI:</span>\n{promptPreview}
          </Card>
        )}
      </form>
    </Card>
  );
}

export function TitleGenerator() {
  const [topic, setTopic] = useState("")
  const [count, setCount] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY)
  const router = useRouter()
  const [showHistory, setShowHistory] = useState(false)

  const handleSubmit = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    setGeneratedTitles([])

    try {
      const response = await generateTitles(topic, selectedModel.id, selectedCategory.id)
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to generate titles")
      }
      setGeneratedTitles(response.data.titles || [])
      if ((response.data.titles || []).length > 0) {
        saveToHistory({
          id: uuidv4(),
          type: "title",
          content: response.data.titles.join("\n"),
          topic,
          category: selectedCategory.name,
          model: selectedModel.id,
          createdAt: new Date().toISOString(),
        })
        toast.success("Judul berhasil dibuat!")
      } else {
        toast.error("Tidak ada judul yang dihasilkan!")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      toast.error(`Gagal membuat judul: ${errorMessage}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseTitle = (title: string) => {
    router.push(`/news?title=${encodeURIComponent(title.trim())}&category=${encodeURIComponent(selectedCategory.id)}`)
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-end mb-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowHistory(true)}
        >
          Riwayat
        </Button>
      </div>
      {showHistory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in"
          onClick={() => setShowHistory(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-4 border border-border"
            onClick={e => e.stopPropagation()}
          >
            {/* Tombol close di kanan atas, tidak overlap tombol lain */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setShowHistory(false)}
              aria-label="Tutup riwayat"
            >
              ✕
            </Button>
            <HistoryList showDeleteAtBottom />
          </div>
        </div>
      )}
      <TitleForm
        topic={topic}
        setTopicAction={setTopic}
        count={count}
        setCountAction={setCount}
        selectedModel={selectedModel}
        setSelectedModelAction={setSelectedModel}
        selectedCategory={selectedCategory}
        setSelectedCategoryAction={setSelectedCategory}
        isGenerating={isGenerating}
        onSubmitAction={handleSubmit}
        onShowHistoryAction={() => setShowHistory(true)}
        promptPreview={`Generate ${count} judul berita tentang "${topic}" dengan model "${selectedModel.name}" dan kategori "${selectedCategory.name}".`}
      />
      {(generatedTitles.length > 0) && (
        <div className="mt-8">
          <TitleResultList
            titles={generatedTitles}
            onUse={handleUseTitle}
          />
        </div>
      )}
    </div>
  )
}
